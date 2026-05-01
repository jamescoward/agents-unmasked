// ── Demystifying Agents - Presentation Engine ──

// ── Step definitions ──
// Each step is { stage, action } where action is a function.
// ArrowRight advances to the next step, ArrowLeft goes back.

const steps = [];
let currentStep = -1;
let isAnimating = false;

// ── DOM refs ──
const leftPanel = document.getElementById('left-panel');
const rightPanel = document.getElementById('right-panel');
const chatMessages = document.getElementById('chat-messages');
const chatInputText = document.getElementById('chat-input-text');
const chatCursor = document.getElementById('chat-cursor');
const chatInputArea = document.getElementById('chat-input-area');
const chatHeaderTitle = document.querySelector('.chat-header-title');
const rightPanelContent = document.getElementById('right-panel-content');
const rightPanelTitle = document.querySelector('.right-panel-title');
const progressDots = document.getElementById('progress-dots');
const progressLabel = document.getElementById('progress-label');

// ── Snapshot/restore for stage transitions ──
// Stores the right panel innerHTML at key moments so backward navigation
// can restore it without replaying every step.
const panelSnapshots = {};

const STAGE_NAMES = [
  '',
  'The Chat Interface',
  'The Context Window',
  'Reasoning Models',
  'Tool Calling',
  'RAG',
  'System Prompts',
  'Skills',
  'Conclusion',
  'Build Playback'
];

const TOTAL_STAGES = 9;

// ── Utility functions ──

function scrollChatToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addChatMessage(role, html) {
  const msg = document.createElement('div');
  msg.className = `message ${role}`;
  msg.innerHTML = html;
  chatMessages.appendChild(msg);
  scrollChatToBottom();
  return msg;
}

function removeChatMessage(msg) {
  if (msg && msg.parentNode) {
    msg.parentNode.removeChild(msg);
  }
}

function showTypingIndicator() {
  const msg = document.createElement('div');
  msg.className = 'message assistant';
  msg.id = 'typing-indicator';
  msg.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
  chatMessages.appendChild(msg);
  scrollChatToBottom();
  return msg;
}

function removeTypingIndicator() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

function setInputText(text) {
  chatInputText.textContent = text;
}

function clearInput() {
  chatInputText.textContent = '';
}

function setRightPanelContent(html) {
  rightPanelContent.innerHTML = html;
}

function appendRightPanelContent(html) {
  rightPanelContent.innerHTML += html;
  rightPanelContent.scrollTop = rightPanelContent.scrollHeight;
}

function showPanelOverlay(color, colorDim, html) {
  hidePanelOverlay();
  const overlay = document.createElement('div');
  overlay.id = 'panel-overlay';
  overlay.innerHTML = `<div class="overlay-card" style="color:${color};border:1px dashed ${color};background:${colorDim};">${html}</div>`;
  document.getElementById('right-panel').appendChild(overlay);
}

function hidePanelOverlay() {
  const existing = document.getElementById('panel-overlay');
  if (existing) existing.remove();
}

function snapshotRightPanel(key) {
  panelSnapshots[key] = {
    title: rightPanelTitle.textContent,
    content: rightPanelContent.innerHTML
  };
}

function restoreRightPanel(key) {
  const snap = panelSnapshots[key];
  if (snap) {
    rightPanelTitle.textContent = snap.title;
    rightPanelContent.innerHTML = snap.content;
  }
}

// ── Progress bar ──

function initProgressBar() {
  progressDots.innerHTML = '';
  for (let i = 1; i <= TOTAL_STAGES; i++) {
    const dot = document.createElement('div');
    dot.className = 'progress-dot';
    dot.dataset.stage = i;
    dot.addEventListener('click', () => jumpToStage(i));
    progressDots.appendChild(dot);
  }
  updateProgressBar(1);
}

function updateProgressBar(stage) {
  const dots = progressDots.querySelectorAll('.progress-dot');
  dots.forEach(dot => {
    const s = parseInt(dot.dataset.stage);
    dot.className = 'progress-dot';
    if (s < stage) dot.classList.add('completed');
    else if (s === stage) dot.classList.add('active');
  });
  progressLabel.textContent = `${stage} / ${TOTAL_STAGES}  ${STAGE_NAMES[stage] || ''}`;
}

// ── Step builder helpers ──

function addStep(stage, forward, backward) {
  steps.push({ stage, forward, backward });
}

// ── Define all presentation steps ──

function defineSteps() {

  // ════════════════════════════════════════
  // STAGE 1: The Chat Interface
  // ════════════════════════════════════════

  // Step: Title slide
  addStep(1,
    () => {
      clearInput();
      chatHeaderTitle.textContent = 'Copilot Chat';
      rightPanelTitle.textContent = '';
      setRightPanelContent(`
        <div class="title-slide">
          <h1>Agents Unmasked</h1>
          <div class="subtitle">How LLM agents actually work under the hood</div>
          <div class="author">James Coward</div>
        </div>
      `);
    },
    () => {}
  );

  // Step: User types question in input
  addStep(1,
    () => { setInputText('What is the capital of France?'); },
    () => { clearInput(); }
  );

  // Step: User "sends" the message
  let msg1user;
  addStep(1,
    () => {
      clearInput();
      msg1user = addChatMessage('user', 'What is the capital of France?');
    },
    () => {
      removeChatMessage(msg1user);
      setInputText('What is the capital of France?');
    }
  );

  // Step: Typing indicator
  let typing1;
  addStep(1,
    () => { typing1 = showTypingIndicator(); },
    () => { removeTypingIndicator(); }
  );

  // Step: Assistant responds
  let msg1asst;
  addStep(1,
    () => {
      removeTypingIndicator();
      msg1asst = addChatMessage('assistant', 'The capital of France is Paris. It\'s the largest city in France and serves as the country\'s political, economic, and cultural centre.');
    },
    () => {
      removeChatMessage(msg1asst);
      showTypingIndicator();
    }
  );

  // Step: User types second question
  addStep(1,
    () => { setInputText('What about Germany?'); },
    () => { clearInput(); }
  );

  // Step: User sends second message
  let msg2user;
  addStep(1,
    () => {
      clearInput();
      msg2user = addChatMessage('user', 'What about Germany?');
    },
    () => {
      removeChatMessage(msg2user);
      setInputText('What about Germany?');
    }
  );

  // Step: Typing indicator
  addStep(1,
    () => { showTypingIndicator(); },
    () => { removeTypingIndicator(); }
  );

  // Step: Assistant responds
  let msg2asst;
  addStep(1,
    () => {
      removeTypingIndicator();
      msg2asst = addChatMessage('assistant', 'The capital of Germany is Berlin. It\'s the largest city in Germany and has a rich history, particularly during the Cold War when it was divided into East and West Berlin.');
    },
    () => {
      removeChatMessage(msg2asst);
      showTypingIndicator();
    }
  );

  // ════════════════════════════════════════
  // STAGE 2: The Context Window
  // ════════════════════════════════════════

  // Helper to set up the context panel scaffold
  function initContextPanel(pct) {
    rightPanelTitle.textContent = 'Under the Hood — API Request';
    setRightPanelContent(`
      <div class="context-bar-container">
        <div class="context-bar-label">
          <span>Context Window</span>
          <span id="context-pct">${pct}%</span>
        </div>
        <div class="context-bar"><div class="context-bar-fill" id="context-fill" style="width: ${pct}%"></div></div>
      </div>
      <div id="context-sections"></div>
    `);
  }

  function updateContextBar(pct) {
    const fill = document.getElementById('context-fill');
    const pctEl = document.getElementById('context-pct');
    if (fill) fill.style.width = pct + '%';
    if (pctEl) pctEl.textContent = pct + '%';
  }

  function appendContextSection(type, label, body) {
    const sections = document.getElementById('context-sections');
    if (!sections) return;
    const div = document.createElement('div');
    div.className = `context-section ${type}`;
    div.innerHTML = `
      <div class="context-label"><span class="dot"></span> ${label}</div>
      <div class="context-body">${body}</div>
    `;
    sections.appendChild(div);
    rightPanelContent.scrollTop = rightPanelContent.scrollHeight;
  }

  function removeLastContextSection() {
    const sections = document.getElementById('context-sections');
    if (sections && sections.lastElementChild) {
      sections.removeChild(sections.lastElementChild);
    }
  }

  function restoreTitleSlide() {
    rightPanelTitle.textContent = '';
    setRightPanelContent(`
      <div class="title-slide">
        <h1>Agents Unmasked</h1>
        <div class="subtitle">How LLM agents actually work under the hood</div>
        <div class="author">James Coward</div>
      </div>
    `);
  }

  // Step: Transition — show the context panel with just the first user message
  addStep(2,
    () => {
      initContextPanel(2);
      appendContextSection('user-msg', 'User', 'What is the capital of France?');
    },
    () => { restoreTitleSlide(); }
  );

  // Step: First assistant response appears in context
  addStep(2,
    () => {
      appendContextSection('assistant-msg', 'Assistant',
        "The capital of France is Paris. It's the largest city in France and serves as the country's political, economic, and cultural centre.");
      updateContextBar(4);
    },
    () => { removeLastContextSection(); updateContextBar(2); }
  );

  // Step: Second user message in context
  addStep(2,
    () => {
      appendContextSection('user-msg', 'User', 'What about Germany?');
      updateContextBar(5);
    },
    () => { removeLastContextSection(); updateContextBar(4); }
  );

  // Step: Second assistant response in context
  addStep(2,
    () => {
      appendContextSection('assistant-msg', 'Assistant',
        "The capital of Germany is Berlin. It's the largest city in Germany and has a rich history, particularly during the Cold War when it was divided into East and West Berlin.");
      updateContextBar(8);
    },
    () => { removeLastContextSection(); updateContextBar(5); }
  );

  // Step: User types a new question
  addStep(2,
    () => { setInputText('And Spain?'); },
    () => { clearInput(); }
  );

  // Step: User sends — appears in both chat and context simultaneously
  let msg3user;
  addStep(2,
    () => {
      clearInput();
      msg3user = addChatMessage('user', 'And Spain?');
      appendContextSection('user-msg', 'User', 'And Spain?');
      updateContextBar(9);
    },
    () => {
      removeChatMessage(msg3user);
      setInputText('And Spain?');
      removeLastContextSection();
      updateContextBar(8);
    }
  );

  // Step: Typing indicator
  addStep(2,
    () => { showTypingIndicator(); },
    () => { removeTypingIndicator(); }
  );

  // Step: Assistant responds — both chat and context
  let msg3asst;
  addStep(2,
    () => {
      removeTypingIndicator();
      msg3asst = addChatMessage('assistant', 'The capital of Spain is Madrid. It\'s located in the centre of the Iberian Peninsula and is known for its rich cultural heritage, including the Prado Museum and the Royal Palace.');
      appendContextSection('assistant-msg', 'Assistant',
        "The capital of Spain is Madrid. It's located in the centre of the Iberian Peninsula and is known for its rich cultural heritage.");
      updateContextBar(14);
    },
    () => {
      removeChatMessage(msg3asst);
      showTypingIndicator();
      removeLastContextSection();
      updateContextBar(9);
    }
  );

  // Step: The reveal — "The entire conversation is sent every time"
  addStep(2,
    () => {
      showPanelOverlay('var(--orange)', 'var(--orange-dim)',
        `The model is stateless.<br>The <strong>whole conversation</strong> is sent on every request.`
      );
      snapshotRightPanel('end-of-stage-2');
    },
    () => {
      hidePanelOverlay();
    }
  );

  // ════════════════════════════════════════
  // STAGE 3: Reasoning Models (Thinking)
  // ════════════════════════════════════════

  // Step: New question in chat
  addStep(3,
    () => {
      hidePanelOverlay();
      setInputText('What is the capital of Czechoslovakia?');
    },
    () => { clearInput(); }
  );

  let msg4user;
  addStep(3,
    () => {
      clearInput();
      msg4user = addChatMessage('user', 'What is the capital of Czechoslovakia?');
      // Update right panel title
      rightPanelTitle.textContent = 'Under the Hood — Thinking';
      // Reset right panel content
      setRightPanelContent(`
        <div class="context-bar-container">
          <div class="context-bar-label">
            <span>Context Window</span>
            <span id="context-pct">18%</span>
          </div>
          <div class="context-bar"><div class="context-bar-fill" id="context-fill" style="width: 18%"></div></div>
        </div>
        <div id="context-sections">
          <div class="context-section user-msg" style="opacity: 0.5">
            <div class="context-label"><span class="dot"></span> User</div>
            <div class="context-body">What is the capital of France?</div>
          </div>
          <div class="context-section assistant-msg" style="opacity: 0.5">
            <div class="context-label"><span class="dot"></span> Assistant</div>
            <div class="context-body">The capital of France is Paris...</div>
          </div>
          <div style="text-align: center; color: var(--text-muted); font-size: 12px; padding: 4px;">⋮ (earlier messages)</div>
          <div class="context-section user-msg highlight-new">
            <div class="context-label"><span class="dot"></span> User</div>
            <div class="context-body">What is the capital of Czechoslovakia?</div>
          </div>
        </div>
      `);
    },
    () => {
      removeChatMessage(msg4user);
      setInputText('What is the capital of Czechoslovakia?');
      restoreRightPanel('end-of-stage-2');
    }
  );

  // Step: Show thinking block in response
  addStep(3,
    () => {
      const sections = document.getElementById('context-sections');
      if (sections) {
        sections.innerHTML += `
          <div class="context-section thinking highlight-new">
            <div class="context-label"><span class="dot"></span> Thinking <span style="font-size: 10px; opacity: 0.6; font-weight: 400; text-transform: none;">(hidden from user)</span></div>
            <div class="context-body">The user is asking about Czechoslovakia, but that country no longer exists. It dissolved on 1 January 1993 into two independent states: the Czech Republic (now Czechia) and Slovakia.

Rather than just saying "it doesn't exist", I should be helpful and give them the capitals of both successor states:
  - Czech Republic → Prague
  - Slovakia → Bratislava

I'll also mention that the historic capital of Czechoslovakia was Prague.</div>
          </div>
        `;
        rightPanelContent.scrollTop = rightPanelContent.scrollHeight;
      }
      const fill = document.getElementById('context-fill');
      const pct = document.getElementById('context-pct');
      if (fill) fill.style.width = '26%';
      if (pct) pct.textContent = '26%';
    },
    () => {
      const sections = document.getElementById('context-sections');
      if (sections && sections.lastElementChild) {
        sections.removeChild(sections.lastElementChild);
      }
      const fill = document.getElementById('context-fill');
      const pct = document.getElementById('context-pct');
      if (fill) fill.style.width = '18%';
      if (pct) pct.textContent = '18%';
    }
  );

  // Step: Assistant responds (only final answer shown in chat)
  let msg4asst;
  addStep(3,
    () => {
      msg4asst = addChatMessage('assistant', 'Czechoslovakia dissolved in 1993. The historic capital was <strong>Prague</strong>, which is now the capital of the Czech Republic (Czechia). The capital of Slovakia is <strong>Bratislava</strong>.');
      const sections = document.getElementById('context-sections');
      if (sections) {
        sections.innerHTML += `
          <div class="context-section assistant-msg highlight-new">
            <div class="context-label"><span class="dot"></span> Assistant</div>
            <div class="context-body">Czechoslovakia dissolved in 1993. The historic capital was Prague (now capital of Czechia). The capital of Slovakia is Bratislava.</div>
          </div>
        `;
        rightPanelContent.scrollTop = rightPanelContent.scrollHeight;
      }
      const fill = document.getElementById('context-fill');
      const pct = document.getElementById('context-pct');
      if (fill) fill.style.width = '30%';
      if (pct) pct.textContent = '30%';
    },
    () => {
      removeChatMessage(msg4asst);
      const sections = document.getElementById('context-sections');
      if (sections && sections.lastElementChild) {
        sections.removeChild(sections.lastElementChild);
      }
      const fill = document.getElementById('context-fill');
      const pct = document.getElementById('context-pct');
      if (fill) fill.style.width = '26%';
      if (pct) pct.textContent = '26%';
    }
  );

  // Step: Reasoning callout
  addStep(3,
    () => {
      const sections = document.getElementById('context-sections');
      if (sections) {
        const callout = document.createElement('div');
        callout.className = 'context-callout';
        callout.style.borderColor = 'var(--orange)';
        callout.style.color = 'var(--orange)';
        callout.innerHTML = `"Reasoning" is just the model thinking out loud in the context window.<br>It uses more tokens, but produces better answers for complex questions.`;
        sections.appendChild(callout);
        rightPanelContent.scrollTop = rightPanelContent.scrollHeight;
      }
      snapshotRightPanel('end-of-stage-3');
    },
    () => {
      const sections = document.getElementById('context-sections');
      if (sections && sections.lastElementChild) {
        sections.removeChild(sections.lastElementChild);
      }
    }
  );

  // ════════════════════════════════════════
  // STAGE 4: Tool Calling (The Agent Loop)
  // ════════════════════════════════════════

  // Helpers shared by Stage 4 and Stage 5 (RAG is the same loop with a different tool)
  function buildLoopFrame() {
    return `
      <div class="loop-frame">
        <div class="loop-iteration-badge" id="loop-badge">Iteration 1</div>
        <div class="loop-row">
          <div class="loop-stack">
            <div class="loop-step model-step" id="ls-model">
              <div class="loop-step-title">🤖 Model</div>
              <div class="loop-step-detail" id="ls-model-detail">Reads the whole conversation</div>
            </div>
            <div class="loop-arrow">↓ <span class="loop-arrow-label">tool_use</span></div>
            <div class="loop-step tool-step" id="ls-tool">
              <div class="loop-step-title">🔧 Tool call</div>
              <div class="loop-step-detail" id="ls-tool-detail">(waiting)</div>
            </div>
            <div class="loop-arrow">↓</div>
            <div class="loop-step harness-step" id="ls-harness">
              <div class="loop-step-title">⚙️ Harness</div>
              <div class="loop-step-detail" id="ls-harness-detail">(waiting)</div>
            </div>
          </div>
          <svg class="loop-back-arrow" id="loop-back-arrow" viewBox="0 0 60 200" preserveAspectRatio="none" aria-hidden="true">
            <path d="M 4 196 Q 55 196 55 100 Q 55 4 4 4" stroke="currentColor" stroke-width="2" stroke-dasharray="5 4" fill="none" />
            <polygon points="0 4, 8 0, 8 8" fill="currentColor" />
          </svg>
        </div>
        <div class="loop-status" id="loop-status">The harness wraps the model and runs tools on its behalf</div>
      </div>
    `;
  }

  function setLoopState({ iteration, model, tool, harness, status, active, pulseBack, exited }) {
    const badge = document.getElementById('loop-badge');
    const modelDetail = document.getElementById('ls-model-detail');
    const toolDetail = document.getElementById('ls-tool-detail');
    const harnessDetail = document.getElementById('ls-harness-detail');
    const status_ = document.getElementById('loop-status');
    const modelStep = document.getElementById('ls-model');
    const toolStep = document.getElementById('ls-tool');
    const harnessStep = document.getElementById('ls-harness');
    const backArrow = document.getElementById('loop-back-arrow');

    if (badge && iteration !== undefined) badge.textContent = iteration;
    if (modelDetail && model !== undefined) modelDetail.innerHTML = model;
    if (toolDetail && tool !== undefined) toolDetail.innerHTML = tool;
    if (harnessDetail && harness !== undefined) harnessDetail.innerHTML = harness;
    if (status_ && status !== undefined) status_.innerHTML = status;

    [modelStep, toolStep, harnessStep].forEach(el => el && el.classList.remove('active'));
    if (active === 'model' && modelStep) modelStep.classList.add('active');
    if (active === 'tool' && toolStep) toolStep.classList.add('active');
    if (active === 'harness' && harnessStep) harnessStep.classList.add('active');

    if (backArrow) {
      backArrow.classList.remove('pulse');
      if (pulseBack) {
        // restart animation
        void backArrow.offsetWidth;
        backArrow.classList.add('pulse');
      }
    }

    [modelStep, toolStep, harnessStep].forEach(el => el && el.classList.toggle('dim', !!exited));
  }

  // Step: User types question
  addStep(4,
    () => {
      chatHeaderTitle.textContent = 'Microsoft 365 Copilot';
      setInputText('Save these capitals to my notes');
    },
    () => {
      chatHeaderTitle.textContent = 'Copilot Chat';
      clearInput();
    }
  );

  // Step: User sends + scaffold the loop diagram
  let msg5user;
  addStep(4,
    () => {
      clearInput();
      msg5user = addChatMessage('user', 'Save these capitals to my notes');
      rightPanelTitle.textContent = 'Under the Hood — Tool Calling';
      setRightPanelContent(buildLoopFrame());
    },
    () => {
      removeChatMessage(msg5user);
      setInputText('Save these capitals to my notes');
      restoreRightPanel('end-of-stage-3');
    }
  );

  // Step: Iteration 1 — model decides to read the file
  addStep(4,
    () => {
      setLoopState({
        iteration: 'Iteration 1',
        active: 'tool',
        model: 'Decides it needs to read the file first',
        tool: 'read_file("notes.txt")',
        harness: '(waiting)',
        status: 'The model can\'t open files itself — it asks the harness to do it'
      });
    },
    () => {
      setLoopState({
        iteration: 'Iteration 1',
        active: null,
        model: 'Reads the whole conversation',
        tool: '(waiting)',
        harness: '(waiting)',
        status: 'The harness wraps the model and runs tools on its behalf'
      });
    }
  );

  // Step: Iteration 1 — harness runs the read, loop pulses back to top
  addStep(4,
    () => {
      setLoopState({
        active: 'harness',
        harness: 'Opens notes.txt → returns the contents',
        status: 'Tool result is added to the context. Loop back to the model.',
        pulseBack: true
      });
    },
    () => {
      setLoopState({
        active: 'tool',
        harness: '(waiting)',
        status: 'The model can\'t open files itself — it asks the harness to do it'
      });
    }
  );

  // Step: Iteration 2 — model decides to write
  addStep(4,
    () => {
      setLoopState({
        iteration: 'Iteration 2',
        active: 'tool',
        model: 'Sees the file, appends the capitals',
        tool: 'write_file("notes.txt", …)',
        harness: '(waiting)',
        status: 'Same loop, different tool. The bubbles update.'
      });
    },
    () => {
      setLoopState({
        iteration: 'Iteration 1',
        active: 'harness',
        model: 'Decides it needs to read the file first',
        tool: 'read_file("notes.txt")',
        harness: 'Opens notes.txt → returns the contents',
        status: 'Tool result is added to the context. Loop back to the model.'
      });
    }
  );

  // Step: Iteration 2 — harness writes, loop pulses back
  addStep(4,
    () => {
      setLoopState({
        active: 'harness',
        harness: 'Writes notes.txt → returns success',
        status: 'Tool result is added to the context. Loop back to the model.',
        pulseBack: true
      });
    },
    () => {
      setLoopState({
        active: 'tool',
        harness: '(waiting)',
        status: 'Same loop, different tool. The bubbles update.'
      });
    }
  );

  // Step: Loop exits — model returns text, no more tool calls
  let msg5asst;
  addStep(4,
    () => {
      setLoopState({
        iteration: 'Loop exits',
        active: 'model',
        model: 'No more tools needed. Returns a text reply.',
        tool: '(none — model returned text)',
        harness: '(idle)',
        status: 'Loop exits when the model stops calling tools.',
        exited: true
      });
      msg5asst = addChatMessage('assistant', 'Done! I\'ve saved the capital cities to your notes.');
    },
    () => {
      removeChatMessage(msg5asst);
      setLoopState({
        iteration: 'Iteration 2',
        active: 'harness',
        model: 'Sees the file, appends the capitals',
        tool: 'write_file("notes.txt", …)',
        harness: 'Writes notes.txt → returns success',
        status: 'Tool result is added to the context. Loop back to the model.',
        exited: false
      });
    }
  );

  // Step: The reveal — "An agent is just this loop"
  addStep(4,
    () => {
      showPanelOverlay('var(--orange)', 'var(--orange-dim)',
        `An "agent" is just this loop running until the model stops calling tools.<br>That's it.`
      );
      snapshotRightPanel('end-of-stage-4');
    },
    () => {
      hidePanelOverlay();
    }
  );

  // ════════════════════════════════════════
  // STAGE 5: RAG
  // ════════════════════════════════════════

  addStep(5,
    () => {
      hidePanelOverlay();
      setInputText("What's our parental leave policy?");
      rightPanelTitle.textContent = 'Under the Hood — RAG';
      setRightPanelContent(`
        <div id="rag-callback" class="loop-callback">↩ Remember the loop? RAG is just the model calling a search tool.</div>
        <div id="rag-context-pre">
          <div class="context-section user-msg highlight-new">
            <div class="context-label"><span class="dot"></span> User</div>
            <div class="context-body">What's our parental leave policy?</div>
          </div>
        </div>
        ${buildLoopFrame()}
        <div id="rag-result"></div>
      `);
      setLoopState({
        iteration: 'Iteration 1',
        active: null,
        model: 'Reads the conversation, sees a question about company docs',
        tool: '(waiting)',
        harness: '(waiting)',
        status: 'The model decides whether to look something up — same loop as before'
      });
    },
    () => {
      clearInput();
      restoreRightPanel('end-of-stage-4');
    }
  );

  // Step: Send the question — chat bubble appears (right panel was already set up)
  let msg6user;
  addStep(5,
    () => {
      clearInput();
      msg6user = addChatMessage('user', "What's our parental leave policy?");
    },
    () => {
      removeChatMessage(msg6user);
      setInputText("What's our parental leave policy?");
    }
  );

  // Step: Iteration 1 — model decides to search the knowledge base
  addStep(5,
    () => {
      setLoopState({
        active: 'tool',
        model: 'Decides it needs to look this up',
        tool: 'search_knowledge_base("parental leave policy")',
        harness: '(waiting)',
        status: 'The model can\'t see internal docs — it asks the harness to search'
      });
    },
    () => {
      setLoopState({
        active: null,
        model: 'Reads the conversation, sees a question about company docs',
        tool: '(waiting)',
        harness: '(waiting)',
        status: 'The model decides whether to look something up — same loop as before'
      });
    }
  );

  // Step: Iteration 1 — harness queries the company knowledge base, loop pulses back
  addStep(5,
    () => {
      setLoopState({
        active: 'harness',
        harness: 'Searches the company knowledge base → returns matching passages',
        status: 'Tool result is added to the context. Loop back to the model.',
        pulseBack: true
      });
      const result = document.getElementById('rag-result');
      result.innerHTML = `
        <div class="context-section rag highlight-new" style="margin-top: 14px;">
          <div class="context-label"><span class="dot"></span> Tool result — passages from the company knowledge base</div>
          <div class="context-body">[handbook/parental-leave.md]
"All employees are entitled to 16 weeks of paid parental leave. Leave can be taken in blocks or continuously within the first 12 months…"

[handbook/benefits-overview.md]
"Parental leave is available to all employees regardless of gender or tenure. Additional unpaid leave of up to 8 weeks may be requested…"</div>
        </div>
      `;
      rightPanelContent.scrollTop = rightPanelContent.scrollHeight;
    },
    () => {
      setLoopState({
        active: 'tool',
        harness: '(waiting)',
        status: 'The model can\'t see internal docs — it asks the harness to search'
      });
      document.getElementById('rag-result').innerHTML = '';
    }
  );

  // Step: Iteration 2 — model uses the passages to answer (loop exits), assistant message appears
  let msg6asst;
  addStep(5,
    () => {
      setLoopState({
        iteration: 'Loop exits',
        active: 'model',
        model: 'Reads the passages, writes the answer. No more tools needed.',
        tool: '(none — model returned text)',
        harness: '(idle)',
        status: 'Loop exits when the model stops calling tools.',
        exited: true
      });
      msg6asst = addChatMessage('assistant', 'Our parental leave policy offers <strong>16 weeks of paid leave</strong> for all employees, regardless of gender or tenure. You can take it in continuous blocks or split it within the first 12 months. Additional unpaid leave of up to 8 weeks is also available upon request.');
      rightPanelContent.scrollTop = rightPanelContent.scrollHeight;
      snapshotRightPanel('stage-5-assistant-response');
    },
    () => {
      removeChatMessage(msg6asst);
      setLoopState({
        iteration: 'Iteration 1',
        active: 'harness',
        model: 'Decides it needs to look this up',
        tool: 'search_knowledge_base("parental leave policy")',
        harness: 'Searches the company knowledge base → returns matching passages',
        status: 'Tool result is added to the context. Loop back to the model.',
        exited: false
      });
    }
  );

  // Step: The reveal
  addStep(5,
    () => {
      showPanelOverlay('var(--yellow)', 'var(--yellow-dim)',
        `The model isn't learning anything. What looks like institutional knowledge is just a search result injected into the context.`
      );
      snapshotRightPanel('end-of-stage-5');
    },
    () => {
      hidePanelOverlay();
    }
  );

  // ════════════════════════════════════════
  // STAGE 6: System Prompts & agent.md
  // ════════════════════════════════════════

  addStep(6,
    () => {
      hidePanelOverlay();
      rightPanelTitle.textContent = 'Under the Hood — System Prompt';
      setRightPanelContent(`
        <div id="context-sections">
          <div class="context-section system highlight-new" style="border-width: 2px;">
            <div class="context-label"><span class="dot"></span> System Prompt</div>
            <div class="context-body">You are a helpful assistant for Acme Corp.
You answer questions about company policies.
Be concise, friendly, and professional.
If you don't know something, say so.
Never make up information about policies.</div>
          </div>
          <div style="text-align: center; color: var(--text-muted); font-size: 12px; padding: 4px;">⋮ (this was always here — just hidden until now)</div>
          <div class="context-section user-msg" style="opacity: 0.5">
            <div class="context-label"><span class="dot"></span> User</div>
            <div class="context-body">What is the capital of France?</div>
          </div>
          <div class="context-section assistant-msg" style="opacity: 0.5">
            <div class="context-label"><span class="dot"></span> Assistant</div>
            <div class="context-body">The capital of France is Paris...</div>
          </div>
          <div style="text-align: center; color: var(--text-muted); font-size: 12px; padding: 4px;">⋮ (conversation continues)</div>
        </div>
      `);
    },
    () => {
      restoreRightPanel('end-of-stage-5');
    }
  );

  // Step: Show agent.md being loaded
  addStep(6,
    () => {
      const sections = document.getElementById('context-sections');
      const systemSection = sections.querySelector('.context-section.system');
      // Insert agent.md (plus a plain-English explainer) before the system section
      const wrapper = document.createElement('div');
      wrapper.className = 'agent-md-wrapper highlight-new';
      wrapper.innerHTML = `
        <div class="context-section system" style="border-color: rgba(247, 120, 186, 0.4); background: var(--pink-dim); margin-bottom: 6px;">
          <div class="context-label" style="color: var(--pink);"><span class="dot" style="background: var(--pink);"></span> agent.md</div>
          <div class="context-body"># Acme Corp Assistant

## Identity
- Name: AcmeBot
- Role: Internal HR & Policy Assistant

## Rules
- Only reference official handbook documents
- Escalate sensitive topics to HR team
- Log all policy queries for compliance

## Available Tools
- search_handbook: Search company docs
- create_ticket: Create HR tickets</div>
        </div>
        <div class="agent-md-explainer">
          <strong>What is agent.md?</strong>
          A plain-text file you (or your team) write — house rules for the agent.
          Who it is, how it should behave, what it's allowed to do.
          The agent reads it before every conversation.
        </div>
      `;
      sections.insertBefore(wrapper, systemSection);
      rightPanelContent.scrollTop = 0;
    },
    () => {
      const sections = document.getElementById('context-sections');
      if (sections && sections.firstElementChild) {
        sections.removeChild(sections.firstElementChild);
      }
    }
  );

  // Step: Annotation
  addStep(6,
    () => {
      const sections = document.getElementById('context-sections');
      sections.innerHTML += `
        <div class="context-callout" style="margin-top: 8px; border-color: var(--purple); color: var(--purple);">
          Personality, rules, and capabilities are all just text<br>prepended to the context window. More context.
        </div>
      `;
      rightPanelContent.scrollTop = rightPanelContent.scrollHeight;
      snapshotRightPanel('end-of-stage-6');
    },
    () => {
      const sections = document.getElementById('context-sections');
      if (sections.lastElementChild) sections.removeChild(sections.lastElementChild);
    }
  );

  // ════════════════════════════════════════
  // STAGE 7: Skills / Slash Commands
  // ════════════════════════════════════════

  addStep(7,
    () => {
      setInputText('draft a polite decline to this meeting invite');
      rightPanelTitle.textContent = 'Under the Hood — Skills';
      setRightPanelContent(`
        <div id="skill-flow"></div>
      `);
    },
    () => {
      clearInput();
      restoreRightPanel('end-of-stage-6');
    }
  );

  let msg7user;
  addStep(7,
    () => {
      clearInput();
      msg7user = addChatMessage('user', 'draft a polite decline to this meeting invite');
      const flow = document.getElementById('skill-flow');
      flow.innerHTML = `
        <div class="context-section system" style="margin-bottom: 16px;">
          <div class="context-label"><span class="dot"></span> System Prompt — Available Skills</div>
          <div class="context-body">## Skills
The following skills are available. When the user's
request matches a skill, call the load_skill tool
to fetch detailed instructions.

- <span style="color: var(--orange);">summarise</span>: Summarise a long document or thread
  Triggers: /summarise, "summarise this", "tl;dr"
- <span style="color: var(--orange);">email-draft</span>: Draft a professional email
  Triggers: /email-draft, "draft a reply", "write an email"
- <span style="color: var(--orange);">meeting-notes</span>: Turn raw notes into clean meeting notes
  Triggers: /meeting-notes, "clean up my notes"</div>
        </div>
      `;
    },
    () => {
      removeChatMessage(msg7user);
      setInputText('draft a polite decline to this meeting invite');
      document.getElementById('skill-flow').innerHTML = '';
    }
  );

  // Step: Model matches intent → tool call
  addStep(7,
    () => {
      const flow = document.getElementById('skill-flow');
      flow.innerHTML += `
        <div class="context-section tool-call highlight-new">
          <div class="context-label"><span class="dot"></span> Tool Call</div>
          <div class="context-body">load_skill("email-draft")

The model matched "draft a polite decline…" to the
email-draft skill. This is itself a form of tool calling!</div>
        </div>
        <div class="skill-expansion"><div class="arrow-down">↓</div></div>
      `;
      rightPanelContent.scrollTop = rightPanelContent.scrollHeight;
    },
    () => {
      const flow = document.getElementById('skill-flow');
      flow.removeChild(flow.lastElementChild);
      flow.removeChild(flow.lastElementChild);
    }
  );

  // Step: Skill template expands into context
  addStep(7,
    () => {
      const flow = document.getElementById('skill-flow');
      flow.innerHTML += `
        <div class="context-section tool-result highlight-new">
          <div class="context-label"><span class="dot"></span> Skill Expansion → Injected into Context</div>
          <div class="context-body">## Email Draft Skill

1. Identify the recipient and prior context
2. Match tone to the relationship (formal / peer / casual)
3. Open with a brief acknowledgement
4. State the message clearly:
   - For a decline: thank, decline, give a brief reason
     if appropriate, offer an alternative if there is one
5. Close politely with a sign-off matching the tone
6. Keep it under 120 words unless the user asks for more

Never invent meeting details or commitments.</div>
        </div>
      `;
      rightPanelContent.scrollTop = rightPanelContent.scrollHeight;
    },
    () => {
      const flow = document.getElementById('skill-flow');
      flow.removeChild(flow.lastElementChild);
    }
  );

  // Step: Show the assistant acting on it
  let msg7asst;
  addStep(7,
    () => {
      msg7asst = addChatMessage('assistant', "Here's a draft:\n\n<em>Hi [Name],</em>\n\n<em>Thanks for the invite. I'm going to have to pass on this one — my Thursday afternoon is fully booked with prep for the quarterly review. If a written update would help, I'm happy to send one through.</em>\n\n<em>Best,<br>[You]</em>");

      const flow = document.getElementById('skill-flow');
      flow.innerHTML += `
        <div class="context-callout" style="margin-top: 12px; border-color: var(--cyan); color: var(--cyan);">
          Skills are prompt templates loaded via tool calls.<br>
          The user says "draft a polite decline…" → the model picks the<br>
          right skill → detailed instructions appear → model follows them.
        </div>
      `;
      rightPanelContent.scrollTop = rightPanelContent.scrollHeight;
      snapshotRightPanel('end-of-stage-7');
    },
    () => {
      removeChatMessage(msg7asst);
      const flow = document.getElementById('skill-flow');
      if (flow.lastElementChild) flow.removeChild(flow.lastElementChild);
    }
  );

  // ════════════════════════════════════════
  // STAGE 8: Conclusion
  // ════════════════════════════════════════

  addStep(8,
    () => {
      rightPanelTitle.textContent = 'The Full Picture';
      setRightPanelContent(`
        <div class="full-picture" id="full-picture">
          <div class="conclusion-title">It's context all the way down</div>
        </div>
      `);
    },
    () => {
      restoreRightPanel('end-of-stage-7');
    }
  );

  // Step: Stack up all the layers
  addStep(8,
    () => {
      const fp = document.getElementById('full-picture');
      fp.innerHTML += `
        <div class="context-section system" style="padding: 8px 12px; margin-bottom: 6px;">
          <div class="context-label"><span class="dot"></span> System Prompt</div>
          <div class="context-body" style="font-size: 11px;">You are a helpful assistant...</div>
        </div>
      `;
    },
    () => {
      const fp = document.getElementById('full-picture');
      fp.removeChild(fp.lastElementChild);
    }
  );

  addStep(8,
    () => {
      const fp = document.getElementById('full-picture');
      fp.innerHTML += `
        <div class="context-section system" style="padding: 8px 12px; margin-bottom: 6px; border-color: rgba(247, 120, 186, 0.4); background: var(--pink-dim);">
          <div class="context-label" style="color: var(--pink);"><span class="dot" style="background: var(--pink);"></span> agent.md</div>
          <div class="context-body" style="font-size: 11px;">Identity, rules, available tools...</div>
        </div>
      `;
    },
    () => {
      const fp = document.getElementById('full-picture');
      fp.removeChild(fp.lastElementChild);
    }
  );

  addStep(8,
    () => {
      const fp = document.getElementById('full-picture');
      fp.innerHTML += `
        <div class="context-section tool-result" style="padding: 8px 12px; margin-bottom: 6px;">
          <div class="context-label"><span class="dot"></span> Skill Expansion</div>
          <div class="context-body" style="font-size: 11px;">Detailed instructions loaded on demand...</div>
        </div>
      `;
    },
    () => {
      const fp = document.getElementById('full-picture');
      fp.removeChild(fp.lastElementChild);
    }
  );

  addStep(8,
    () => {
      const fp = document.getElementById('full-picture');
      fp.innerHTML += `
        <div class="context-section rag" style="padding: 8px 12px; margin-bottom: 6px;">
          <div class="context-label"><span class="dot"></span> RAG Chunks</div>
          <div class="context-body" style="font-size: 11px;">Retrieved documents injected before the call...</div>
        </div>
      `;
    },
    () => {
      const fp = document.getElementById('full-picture');
      fp.removeChild(fp.lastElementChild);
    }
  );

  addStep(8,
    () => {
      const fp = document.getElementById('full-picture');
      fp.innerHTML += `
        <div class="context-section user-msg" style="padding: 8px 12px; margin-bottom: 6px;">
          <div class="context-label"><span class="dot"></span> Conversation History</div>
          <div class="context-body" style="font-size: 11px;">Every message, every turn, sent every time...</div>
        </div>
      `;
    },
    () => {
      const fp = document.getElementById('full-picture');
      fp.removeChild(fp.lastElementChild);
    }
  );

  addStep(8,
    () => {
      const fp = document.getElementById('full-picture');
      fp.innerHTML += `
        <div class="context-section thinking" style="padding: 8px 12px; margin-bottom: 6px;">
          <div class="context-label"><span class="dot"></span> Thinking Blocks</div>
          <div class="context-body" style="font-size: 11px;">Chain-of-thought reasoning, hidden from user...</div>
        </div>
      `;
    },
    () => {
      const fp = document.getElementById('full-picture');
      fp.removeChild(fp.lastElementChild);
    }
  );

  addStep(8,
    () => {
      const fp = document.getElementById('full-picture');
      fp.innerHTML += `
        <div class="context-section tool-call" style="padding: 8px 12px; margin-bottom: 6px;">
          <div class="context-label"><span class="dot"></span> Tool Calls & Results</div>
          <div class="context-body" style="font-size: 11px;">Looping until the task is done...</div>
        </div>
      `;
    },
    () => {
      const fp = document.getElementById('full-picture');
      fp.removeChild(fp.lastElementChild);
    }
  );

  // Step: The reveal
  addStep(8,
    () => {
      const fp = document.getElementById('full-picture');
      fp.innerHTML += `
        <div class="built-with-agent visible" style="margin-top: 12px;">
          This presentation was built with Claude Code. (in about an hour)
        </div>
      `;
      rightPanelContent.scrollTop = rightPanelContent.scrollHeight;
    },
    () => {
      const fp = document.getElementById('full-picture');
      fp.removeChild(fp.lastElementChild);
    }
  );

  // Step: Show the prompts used to build this
  addStep(8,
    () => {
      const fp = document.getElementById('full-picture');
      fp.innerHTML += `
        <div class="prompts-reveal visible" style="margin-top: 12px;">
          <div class="prompts-header">The prompts that built this presentation:</div>
          <ol class="prompts-list">
            <li>The plan <span class="prompt-meta">(stage structure, layout, tech choices)</span></li>
            <li>"Can you pause after each phase so we can discuss" <span class="prompt-meta">(so I can keep up)</span></li>
            <li>"I was thinking the right panel should always be there" <span class="prompt-meta">(a bit of layout direction)</span></li>
            <li>"Could we add a light mode toggle" <span class="prompt-meta">(already asking for extra features!)</span></li>
            <li>"Lets go for Agents Unmasked" <span class="prompt-meta">(brainstorming titles for the talk)</span></li>
            <li>"Lets move onto phase 2" <span class="prompt-meta">(this is where I realise claude has one-shotted my vision)</span></li>
            <li>"Can you go through the rest of the phases to check for polish" <span class="prompt-meta">(tidy up and fix anything that was missed)</span></li>
            <li>"Can you pull out all my prompts for the final slide" <span class="prompt-meta">(a bit of extra flair)</span></li>
          </ol>
        </div>
      `;
      rightPanelContent.scrollTop = rightPanelContent.scrollHeight;
    },
    () => {
      const fp = document.getElementById('full-picture');
      fp.removeChild(fp.lastElementChild);
    }
  );

  // ════════════════════════════════════════
  // STAGE 9: Build Playback
  // ════════════════════════════════════════

  // Entry step: switch layout to full-width playback mode.
  // The individual event steps are appended dynamically by Playback.load().
  addStep(9,
    () => {
      // Expand left panel, hide right panel
      leftPanel.classList.remove('split');
      leftPanel.classList.add('full');
      rightPanel.classList.remove('visible');
      chatHeaderTitle.textContent = 'How This Was Built';

      // Swap chat UI for playback feed
      chatMessages.classList.add('hidden');
      chatInputArea.classList.add('hidden');
      const feed = document.getElementById('playback-feed');
      const status = document.getElementById('playback-status');
      feed.classList.remove('hidden');
      status.classList.remove('hidden');

      // Clear any events from a previous visit and reset cursor
      Playback.reset();

      if (Playback.getLoadedCount() === 0) {
        // build-session.jsonl not found — show setup instructions
        feed.innerHTML = `
          <div class="playback-placeholder">
            <h3>📼 Build Playback</h3>
            <p>Copy your Claude Code session file here, then serve the folder:</p>
            <code>~/.claude/projects/…/&lt;session-id&gt;.jsonl</code>
            <code style="color:var(--green)">→ agents-unmasked/build-session.jsonl</code>
            <p style="margin-top:4px">Then run:</p>
            <code>npx serve .</code>
          </div>`;
      }

      Playback.updateStatus();
    },
    () => {
      // Restore split layout and chat UI
      leftPanel.classList.add('split');
      leftPanel.classList.remove('full');
      rightPanel.classList.add('visible');
      chatHeaderTitle.textContent = 'Microsoft 365 Copilot';

      chatMessages.classList.remove('hidden');
      chatInputArea.classList.remove('hidden');
      document.getElementById('playback-feed').classList.add('hidden');
      document.getElementById('playback-status').classList.add('hidden');
    }
  );
}

// ── Navigation ──

function goForward() {
  if (isAnimating) return;
  if (currentStep >= steps.length - 1) return;

  currentStep++;
  const step = steps[currentStep];
  step.forward();
  updateProgressBar(step.stage);
}

function goBack() {
  if (isAnimating) return;
  if (currentStep < 0) return;

  const step = steps[currentStep];
  step.backward();
  currentStep--;

  if (currentStep >= 0) {
    updateProgressBar(steps[currentStep].stage);
  } else {
    updateProgressBar(1);
  }
}

function jumpToStage(targetStage) {
  if (isAnimating) return;

  // Find the index of the first step in the target stage
  const targetIndex = steps.findIndex(s => s.stage === targetStage);
  if (targetIndex === -1) return;
  if (targetIndex === currentStep) return;

  // Disable animations during rapid traversal
  document.documentElement.classList.add('no-animate');

  if (targetIndex > currentStep) {
    // Fast-forward
    while (currentStep < targetIndex) {
      currentStep++;
      steps[currentStep].forward();
    }
  } else {
    // Rewind
    while (currentStep >= targetIndex) {
      steps[currentStep].backward();
      currentStep--;
    }
    // Now step forward to land on the target
    currentStep++;
    steps[currentStep].forward();
  }

  updateProgressBar(steps[currentStep].stage);

  // Re-enable animations on next frame
  requestAnimationFrame(() => {
    document.documentElement.classList.remove('no-animate');
  });
}

// ── Keyboard handler ──

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault();
    goForward();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    goBack();
  }
});

// ── Init ──

async function init() {
  defineSteps();
  // Fetch build-session.jsonl and register event steps before the progress
  // bar is drawn, so the dot count is stable from the start.
  await Playback.load(addStep);
  initProgressBar();
  // Start at the first step
  goForward();
}

// ── Theme toggle ──

const themeToggle = document.getElementById('theme-toggle');
const iconSun = document.getElementById('theme-icon-sun');
const iconMoon = document.getElementById('theme-icon-moon');

function setTheme(light) {
  if (light) {
    document.documentElement.classList.add('light');
    iconSun.style.display = 'none';
    iconMoon.style.display = 'block';
  } else {
    document.documentElement.classList.remove('light');
    iconSun.style.display = 'block';
    iconMoon.style.display = 'none';
  }
}

themeToggle.addEventListener('click', () => {
  const isLight = !document.documentElement.classList.contains('light');
  setTheme(isLight);
});

init();
