// Explain only the current reveal. Keep each note aligned with defineSteps();
// do not move a takeaway ahead of its visual or qualify the slide's wording.
// Playback events use a shared note.
const GUIDE_NOTES = {
  1: [
    ['Welcome to Agents Unmasked', 'Agents Unmasked: how LLM agents actually work under the hood, by James Coward. Use Next and Back to move through the presentation at your own pace, or choose Autoplay.'],
    ['Meet the model', 'Claude, GPT and Gemini are models: text-in, text-out programs running in the cloud. The model is the brain in a jar. It produces text, but cannot do anything on its own.'],
    ['Meet the harness', 'The harness is the body around the brain: software running on your computer that lets the model see and act in the world. Copilot Chat, Claude Code and the ChatGPT app are examples.']
  ],
  2: [
    ['A question in the input box', 'The user has typed “What is the capital of France?” in the chat input. The right panel is empty, keeping our attention on the chat.'],
    ['The message is sent', 'The question has moved from the input box into a user message in the conversation.'],
    ['Waiting for a reply', 'The moving dots show the assistant preparing a reply. The user is waiting.'],
    ['The answer arrives', 'The assistant answers Paris and adds a short description of the city. The exchange looks like an ordinary question and answer.'],
    ['A follow-up question', 'The user types “What about Germany?” They have not repeated “What is the capital of”.'],
    ['The follow-up is sent', '“What about Germany?” now appears as the next user message beneath the first exchange.'],
    ['Waiting again', 'The typing indicator appears again while the user waits for the second reply.'],
    ['The answer fits', 'The assistant answers Berlin. It has treated the short follow-up as another question about a capital city.']
  ],
  3: [
    ['The context window appears', 'The right panel now shows the API request. The first question is in the context window: the space available for text supplied to the model. The bar shows how much of that space is occupied.'],
    ['The first reply is included', 'The Paris answer joins the first question in the context window. The bar grows from 2% to 4%. Both sides of that exchange are now visible on the right.'],
    ['The follow-up has context', '“What about Germany?” appears beneath the France question and the Paris answer. Together, those messages give the short question its meaning.'],
    ['The second reply is included', 'The Berlin answer joins the context too. Each message adds more text, and the bar now reads 8%. Models measure text in tokens: words or pieces of words.'],
    ['Another short question', 'The user types “And Spain?” The earlier exchanges remain visible in the context window.'],
    ['One message, two views', '“And Spain?” now appears in both the chat and the context window. The left shows the conversation; the right shows the text supplied to the model.'],
    ['Waiting with the context in view', 'The typing indicator is back. On the right, the earlier questions and answers sit above the new Spain question.'],
    ['The answer joins both views', 'The assistant answers Madrid. That reply appears in the chat and in the context window, whose bar has grown to 14%.'],
    ['The model is stateless', 'The model is stateless. The whole conversation is sent every time. It gets the earlier messages again with each request; that is how it can answer a follow-up without remembering the previous request.']
  ],
  4: [
    ['A different question', 'The user types “What is the capital of Czechoslovakia?” in the input box.'],
    ['The question enters the context', 'The question has been sent and appears in the right panel. The context window contains the conversation so far and the new question.'],
    ['Thinking appears in the context', 'The thinking block works through the complication: Czechoslovakia dissolved in 1993. It identifies Czechia and Slovakia, their capitals, and the historic capital. This text is in the context window, hidden from the user’s chat.'],
    ['The final answer appears', 'The user sees the final answer: historic Prague, now the capital of Czechia, and Bratislava, the capital of Slovakia. The thinking stays on the right; the answer appears in both panels.'],
    ['Reasoning is thinking in the context', '“Reasoning” is just the model thinking out loud in the context window. It uses more tokens, but produces better answers for complex questions. The thinking block and the final answer both take up space in the context.']
  ],
  5: [
    ['A request to act', 'The user types “Save these capitals to my notes”. This asks for a change to a file, beyond a text answer in the chat.'],
    ['Model, tool call and harness', 'The request is sent. The diagram shows the model reading the whole conversation. The tool call and harness boxes are waiting; the harness wraps the model and runs tools on its behalf.'],
    ['The model decides to read', 'The model decides it needs to read the file first. The model box is active; the tool call and harness boxes are still waiting.'],
    ['The read request appears', 'The model emits read_file("notes.txt"). It cannot open the file itself, so it asks the harness to do it. The tool call box is now active.'],
    ['The harness returns the contents', 'The harness opens notes.txt and returns its contents. The result is added to the context, and the arrow leads back to the model.'],
    ['The model uses the file contents', 'Iteration 2 begins. The model sees the existing file and prepares the capitals to append. The model box is active again.'],
    ['The write request appears', 'The model emits write_file("notes.txt", …) with the updated text. The tool call box is active, and the harness is waiting to run this request.'],
    ['The harness writes the file', 'The harness writes notes.txt and returns success. That result is added to the context, and the arrow leads back to the model again.'],
    ['The model replies and the loop exits', 'The model returns a text reply saying the capitals were saved. It makes no further tool call, so the harness is idle and the loop exits.'],
    ['An agent is just this loop', 'An agent is just this loop running until the model stops calling tools. The model reads the context, calls a tool, receives the harness’s result, and repeats. That is it.']
  ],
  6: [
    ['A company policy question', 'The chat has cleared. The user types “What’s our parental leave policy?” The right panel is empty.'],
    ['The policy question is sent', 'The question now appears in the chat and as a user message in the right panel.'],
    ['A knowledge base search', 'The tool call is search_knowledge_base("parental leave policy"). It requests information from the company knowledge base.'],
    ['The search results arrive', 'The tool returns passages from two handbook documents: 26 weeks of paid parental leave, available regardless of gender. Those passages are now in the context. RAG stands for retrieval-augmented generation: retrieving text to use in an answer.'],
    ['An answer from the passages', 'The assistant answers with 26 weeks of paid leave for all employees, regardless of gender. The answer uses the handbook passages shown in the tool result.'],
    ['Search results, not learning', 'The model is not learning anything. What looks like institutional knowledge is just a search result injected into the context. The policy information came from the retrieved passages.']
  ],
  7: [
    ['The system prompt is revealed', 'The system prompt was there all along, before the user’s messages. It tells the model to act as an Acme Corp assistant, answer policy questions, be concise and professional, and avoid making up information.'],
    ['More text in the context', 'Personality, rules, and capabilities are all just text prepended to the context window. The system prompt supplies that text before the conversation. More context.']
  ],
  8: [
    ['A request for a meeting reply', 'The chat has cleared. The user types “draft a polite decline to this meeting invite”. The right panel is empty.'],
    ['The available skills appear', 'The request is sent. The system prompt lists summarise, email-draft and meeting-notes, with short descriptions and triggers. It tells the model to load detailed instructions when a request matches a skill.'],
    ['The model selects email-draft', 'The model matches the request to email-draft and calls load_skill("email-draft"). Selecting a skill is itself a tool call.'],
    ['The skill expands into context', 'The full email-draft instructions now appear in the context. They cover tone, acknowledgement, a clear decline, an appropriate reason or alternative, a polite sign-off, and a 120-word limit. They also say never to invent meeting details or commitments.'],
    ['The draft and the skill takeaway', 'The chat now shows the draft, including a Thursday afternoon conflict and an offer of a written update. The callout explains the mechanism: skills are prompt templates loaded via tool calls. The model picks the skill, its detailed instructions appear in context, and the model uses them to draft the reply.']
  ],
  9: [
    ['It is context all the way down', 'The conclusion puts the central idea on screen: it is context all the way down.'],
    ['System prompt', 'The first layer is the system prompt: “You are a helpful assistant…” Instructions are text in the context.'],
    ['Skill expansion', 'The skill expansion joins the stack: detailed instructions loaded on demand.'],
    ['RAG chunks', 'Retrieved documents join the stack. They are injected into the context before the model call.'],
    ['Conversation history', 'Every message, every turn, sent every time. The model is stateless; the whole conversation is sent every time.'],
    ['Thinking blocks', 'Thinking blocks join the stack: chain-of-thought reasoning in the context, hidden from the user.'],
    ['Tool calls and results', 'Tool calls and results complete the stack. Their exchanges keep the loop running until the task is done.'],
    ['Built with Claude Code', 'This presentation was built with Claude Code. The presentation itself is an example of the agent workflow it has just explained.'],
    ['The prompts that built the presentation', 'The final reveal shows the actual prompts: a plan, pauses for discussion, layout direction, light mode, the title, continuing the phases, polish, and collecting the prompts for this slide. The tour is complete. You can restart, revisit a section, or explore the optional build playback.']
  ]
};

const GuidedTour = (() => {
  let enabled = false;
  let playing = false;
  let timer = null;
  const panel = document.getElementById('guided-tour');
  const toggle = document.getElementById('guide-toggle');
  const back = document.getElementById('guide-back');
  const next = document.getElementById('guide-next');
  const play = document.getElementById('guide-play');
  const extra = document.getElementById('guide-playback');
  const status = document.getElementById('guide-status');

  function pause() {
    clearTimeout(timer);
    timer = null;
    playing = false;
    play.textContent = 'Autoplay';
    play.setAttribute('aria-pressed', 'false');
    status.textContent = 'Read at your own pace';
  }

  function render() {
    clearTimeout(timer);
    if (!enabled || currentStep < 0 || !steps[currentStep]) return;
    const stage = steps[currentStep].stage;
    const stageStart = steps.findIndex(step => step.stage === stage);
    const offset = currentStep - stageStart;
    const finalIndex = steps.findIndex(step => step.stage === 10) - 1;
    const finished = currentStep === finalIndex;
    const playback = stage === 10;
    const note = playback
      ? ['Optional: how this was built', 'This is a recorded coding session, not a live agent. Use Next and Back to explore its events: requests, tool actions and results. It is an optional look behind the scenes; you have already covered the core explanation. Autoplay ends with the main tour.']
      : GUIDE_NOTES[stage][offset];
    document.getElementById('guide-heading').textContent = note[0];
    document.getElementById('guide-text').textContent = note[1];
    document.getElementById('guide-position').textContent = playback
      ? `Build playback · ${offset} / ${Playback.getLoadedCount()} events`
      : `${STAGE_NAMES[stage]} · ${offset + 1} / ${GUIDE_NOTES[stage].length} · Tour ${currentStep + 1} / ${finalIndex + 1}`;
    back.disabled = currentStep <= 0;
    next.disabled = finished || currentStep >= steps.length - 1;
    play.disabled = finished || playback;
    extra.hidden = !finished;
    if (finished || playback) {
      pause();
      status.textContent = finished ? 'Tour complete' : 'Explore at your own pace';
      return;
    }
    play.textContent = playing ? 'Pause' : 'Autoplay';
    play.setAttribute('aria-pressed', String(playing));
    if (playing) {
      // Allow time to read the explanation and examine the corresponding visual.
      const seconds = Math.max(9, Math.ceil(note[1].split(/\s+/).length / 2.8) + 3);
      status.textContent = `Autoplay · next in ${seconds}s`;
      timer = setTimeout(() => goForward(true), seconds * 1000);
    } else status.textContent = 'Read at your own pace';
  }

  toggle.addEventListener('click', () => {
    pause();
    enabled = !enabled;
    panel.hidden = !enabled;
    document.body.classList.toggle('guided', enabled);
    toggle.setAttribute('aria-pressed', String(enabled));
    render();
  });
  back.addEventListener('click', () => goBack());
  next.addEventListener('click', () => goForward());
  play.addEventListener('click', () => {
    if (playing) pause();
    else playing = true;
    render();
  });
  document.getElementById('guide-restart').addEventListener('click', () => jumpToStage(1));
  extra.addEventListener('click', () => jumpToStage(10));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pause();
      render();
    }
  });
  return { render, pause };
})();
