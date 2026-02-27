// ── Build Playback ────────────────────────────────────────────────────────
//
// SETUP INSTRUCTIONS
// ──────────────────
// 1. Find your Claude Code session files:
//      ~/.claude/projects/-home-user-<project-name>/
//    There will be one or more <session-id>.jsonl files (top-level only —
//    ignore the subdirectories, those are subagent logs).
//
// 2. If there are multiple session files (build spanned several sessions),
//    merge and sort them by timestamp. Run this from that directory
//    (heredoc avoids zsh history-expansion issues with !):
//
//      node << 'EOF'
//      const fs = require('fs');
//      const files = fs.readdirSync('.').filter(f => f.endsWith('.jsonl'));
//      const lines = [];
//      for (const f of files) {
//        for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
//          if (!line.trim()) continue;
//          try { const o = JSON.parse(line); lines.push([o.timestamp || '', line]); }
//          catch {}
//        }
//      }
//      lines.sort((a, b) => a[0].localeCompare(b[0]));
//      fs.writeFileSync('build-session.jsonl', lines.map(l => l[1]).join('\n'));
//      console.log('Merged', lines.length, 'entries from', files.length, 'files');
//      EOF
//
//    For a single session, just rename/copy the .jsonl directly.
//
// 3. Copy the result here (same folder as index.html):
//      agents-unmasked/build-session.jsonl
//
// 4. Serve the folder over HTTP so the file can load:
//      npx serve .
//    Then open the URL it prints (usually http://localhost:3000)
//
// The playback will load automatically on the final slide (Stage 9).
// ─────────────────────────────────────────────────────────────────────────

const Playback = (() => {

  // ── Truncation limits ──
  const MAX_TEXT      = 600;   // assistant prose response
  const MAX_THINKING  = 280;   // internal reasoning (shown dimmed)
  const MAX_RESULT    = 300;   // generic tool result
  const MAX_BASH_CMD  = 200;   // bash command
  const MAX_FILE_SHOW = 8;     // lines of a file read result to show
  const MAX_TASK_IN   = 150;   // task tool prompt preview

  // ── Helpers ──

  function esc(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function trunc(str, max) {
    str = String(str ?? '').trim();
    if (str.length <= max) return str;
    return str.slice(0, max) + `… [+${str.length - max} chars]`;
  }

  // ── Tool call input formatting ──
  // Returns HTML string - be careful to escape user content.
  function fmtInput(name, input) {
    if (!input) return '';
    switch (name) {
      case 'Read':
        return `📄 ${esc(input.file_path || '')}`;

      case 'Write': {
        const lines = (input.content || '').split('\n');
        const preview = lines.slice(0, 4).join('\n');
        const suffix = lines.length > 4 ? `\n… (${lines.length - 4} more lines)` : '';
        return `✏️ ${esc(input.file_path || '')}\n${esc(preview)}${suffix}`;
      }

      case 'Edit': {
        const path = esc(input.file_path || '');
        const oldS = esc(trunc(input.old_string || '', 80));
        const newS = esc(trunc(input.new_string || '', 80));
        return `📝 ${path}\n<span class="pb-minus">- ${oldS}</span>\n<span class="pb-plus">+ ${newS}</span>`;
      }

      case 'Bash':
        return `<span class="pb-prompt">$</span> ${esc(trunc(input.command || '', MAX_BASH_CMD))}`;

      case 'Grep':
        return `🔍 /${esc(input.pattern || '')}/${input.type ? ` --type=${esc(input.type)}` : ''} ${esc(input.path || '.')}`;

      case 'Glob':
        return `🔍 ${esc(input.pattern || '')}`;

      case 'Task':
        return `🤖 <span class="pb-badge">${esc(input.subagent_type || '')}</span> ${esc(input.description || '')}\n${esc(trunc(input.prompt || '', MAX_TASK_IN))}`;

      case 'TodoWrite': {
        const todos = (input.todos || []);
        const done = todos.filter(t => t.status === 'completed').length;
        return `✓ Task list — ${todos.length} items, ${done} done`;
      }

      case 'WebFetch':
        return `🌐 ${esc(trunc(input.url || '', 120))}`;

      case 'WebSearch':
        return `🔍 "${esc(input.query || '')}"`;

      case 'AskUserQuestion': {
        const q = (input.questions || [])[0];
        return q ? `❓ ${esc(q.question || '')}` : '❓ (question)';
      }

      case 'ExitPlanMode':
        return `📋 Submitting plan for approval`;

      default:
        return esc(trunc(JSON.stringify(input), 200));
    }
  }

  // ── Tool result formatting ──
  function fmtResult(toolName, content) {
    if (!content) return '<span class="pb-empty">(empty)</span>';
    const text = typeof content === 'string' ? content : JSON.stringify(content);

    // File reads: show first N lines with a count of what's hidden
    if (toolName === 'Read' || toolName === 'Write') {
      const lines = text.split('\n');
      if (lines.length > MAX_FILE_SHOW) {
        return esc(lines.slice(0, MAX_FILE_SHOW).join('\n'))
          + `\n<span class="pb-trunc">… ${lines.length - MAX_FILE_SHOW} more lines</span>`;
      }
      return esc(text);
    }

    // Task results have richer content worth showing more of
    if (toolName === 'Task') {
      return esc(trunc(text, MAX_RESULT * 2));
    }

    // Bash: show output but truncate hard
    if (toolName === 'Bash') {
      return esc(trunc(text, MAX_RESULT));
    }

    return esc(trunc(text, MAX_RESULT));
  }

  // ── JSONL → events ──
  // Normalises the raw JSONL into a flat array of typed event objects.
  function parseJSONL(text) {
    const toolNames = {};  // tool_use id → tool name (for matching results)
    const events = [];

    for (const line of text.split('\n')) {
      if (!line.trim()) continue;
      let entry;
      try { entry = JSON.parse(line); } catch { continue; }

      // Skip internal housekeeping lines
      if (entry.type === 'queue-operation') continue;

      const msg = entry.message;
      if (!msg) continue;

      const content = msg.content;

      if (msg.role === 'user') {
        if (typeof content === 'string') {
          // Plain text user message
          events.push({ kind: 'user-message', text: content });
        } else if (Array.isArray(content)) {
          for (const c of content) {
            if (c.type === 'tool_result') {
              const txt = Array.isArray(c.content)
                ? c.content.map(r => r.text || '').join('\n')
                : (c.content || '');
              events.push({
                kind: 'tool-result',
                toolName: toolNames[c.tool_use_id] || '?',
                content: txt,
              });
            } else if (c.type === 'text' && c.text) {
              events.push({ kind: 'user-message', text: c.text });
            }
          }
        }

      } else if (msg.role === 'assistant') {
        if (Array.isArray(content)) {
          for (const c of content) {
            if (c.type === 'thinking') {
              events.push({ kind: 'thinking', text: c.thinking });
            } else if (c.type === 'text') {
              events.push({ kind: 'text', text: c.text });
            } else if (c.type === 'tool_use') {
              toolNames[c.id] = c.name;
              events.push({ kind: 'tool-call', name: c.name, input: c.input });
            }
          }
        }
      }
    }

    return events;
  }

  // ── HTML templates for each event kind ──
  function eventHtml(event) {
    switch (event.kind) {

      case 'user-message':
        return `<div class="playback-event user-msg">
          <div class="context-label"><span class="dot"></span>Prompt</div>
          <div class="context-body pb-body">${esc(event.text)}</div>
        </div>`;

      case 'text':
        return `<div class="playback-event assistant-msg">
          <div class="context-label"><span class="dot"></span>Response</div>
          <div class="context-body pb-body">${esc(trunc(event.text, MAX_TEXT))}</div>
        </div>`;

      case 'thinking':
        return `<div class="playback-event thinking">
          <div class="context-label"><span class="dot"></span>Thinking <span class="pb-dim">(internal)</span></div>
          <div class="context-body pb-body">${esc(trunc(event.text, MAX_THINKING))}</div>
        </div>`;

      case 'tool-call':
        return `<div class="playback-event tool-call">
          <div class="context-label"><span class="dot"></span>Tool Call <span class="pb-tool-name">${esc(event.name)}</span></div>
          <div class="context-body pb-body pb-code">${fmtInput(event.name, event.input)}</div>
        </div>`;

      case 'tool-result':
        return `<div class="playback-event tool-result">
          <div class="context-label"><span class="dot"></span>Result <span class="pb-tool-name">${esc(event.toolName)}</span></div>
          <div class="context-body pb-body pb-code">${fmtResult(event.toolName, event.content)}</div>
        </div>`;

      default:
        return '';
    }
  }

  // ── Playback state ──
  let _events = [];
  let _idx = -1;

  function getFeed() {
    return document.getElementById('playback-feed');
  }

  function updateStatus() {
    const el = document.getElementById('playback-status');
    if (!el) return;
    if (_events.length === 0) {
      el.textContent = 'Drop a .jsonl file onto the slide to load the session';
      return;
    }
    const shown = Math.max(0, _idx + 1);
    el.textContent = `${shown} / ${_events.length} events`;
  }

  function showNext() {
    _idx++;
    if (_idx >= _events.length) { _idx = _events.length - 1; return; }
    const html = eventHtml(_events[_idx]);
    if (!html) return;
    const feed = getFeed();
    if (!feed) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    feed.appendChild(tmp.firstElementChild);
    feed.scrollTop = feed.scrollHeight;
    updateStatus();
  }

  function showPrev() {
    const feed = getFeed();
    if (!feed) return;
    const last = feed.lastElementChild;
    if (last) feed.removeChild(last);
    _idx = Math.max(-1, _idx - 1);
    feed.scrollTop = feed.scrollHeight;
    updateStatus();
  }

  function reset() {
    _idx = -1;
    const feed = getFeed();
    if (feed) feed.innerHTML = '';
    updateStatus();
  }

  // ── Public API ──

  async function load(addStep) {
    try {
      const res = await fetch('build-session.jsonl');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      _events = parseJSONL(text);
    } catch (_err) {
      _events = [];
    }

    // Register one step per event (appended after the stage 9 entry step)
    for (let i = 0; i < _events.length; i++) {
      addStep(9, () => showNext(), () => showPrev());
    }

    return _events.length;
  }

  function getLoadedCount() { return _events.length; }

  return { load, getLoadedCount, reset, updateStatus };

})();
