// What the presenter would say out loud: the reasons, consequences and practical
// advice that are not on the slides. Never repeat a callout's wording; the slide
// already shows it. One entry per step in app.js; null keeps the previous note on
// screen for steps that are only animation beats. Paragraphs split on blank lines.
const GUIDE_NOTES = {
  1: [
    ['Why this talk exists', `Most of us now use AI assistants without seeing what happens behind the chat window. That gap matters. If you picture a mind on the other end that remembers you and learns from you, you will trust it in the wrong places and miss what it is genuinely good at.

This talk starts from the familiar chat window and removes one layer at a time. No maths, no code to read: just what is actually going on.`],
    ['The name on the box', `When people say Claude, GPT or Gemini, they usually mean the model: the thing that companies spend enormous sums training. It is remarkably good with language, but on its own it only ever receives text and sends text back.

It can describe in detail how to make a cup of tea. It cannot boil a kettle.`],
    ['The product around it', `Almost nobody uses a model directly. You use a product built around one, the harness, and it decides what the model gets to see and what it is allowed to do.

This is why the same model can feel brilliant in one tool and disappointing in another. When you compare AI tools, you are often comparing harnesses as much as the models inside them.`]
  ],
  2: [
    ['Something everyone has done', `Here is the version everyone recognises: a chat window. The questions are deliberately boring. Capital cities are easy to check, so all our attention can go on what happens around the answer rather than the answer itself.`],
    null,
    null,
    ['Notice how it feels', `A little more than we asked for, in a friendly tone. That is a style choice made for us, and it is part of why chatting with an assistant feels like talking to someone. Hold on to that feeling: the rest of the talk takes it apart.`],
    ['Now the shortcut', `“What about Germany?” is not really a question on its own. What about it? Its population, its weather, its capital? We type it without a second thought, because that is how conversation works between people.`],
    null,
    null,
    ['So where did the meaning come from?', `It answered the question we meant, not the one we typed. The obvious explanation is that it remembers what we said a moment ago, the way a person would.

That explanation feels right, and it is wrong. The next slide shows why.`]
  ],
  3: [
    ['What the app really sends', `This panel shows what the chat app sends to the model behind the scenes. It is not just your latest message: it is a list, and everything gets added to it. That list is called the context.

The bar at the top is the context window: the most text the model can take in at once. It is measured in tokens, roughly three quarters of a word each.`],
    null,
    null,
    ['The Germany puzzle, solved', `Put the France exchange directly above “What about Germany?” and there is no puzzle left. Any reader would fill the gap. The model does not need to remember anything; it just reads what is in front of it.`],
    ['Two words are plenty', `“And Spain?” works for the same reason. A short follow-up is fine when the text above it already says what you are asking. Clear beats long.`],
    null,
    null,
    ['The replies take up room too', `The model’s own answers go into the list as well, and they are usually longer than the questions. Every exchange makes the next request bigger, and the bar keeps filling.`],
    ['Why this matters day to day', `This is the most useful idea in the talk, and it explains a lot of everyday behaviour.

It does not know you between chats. Features that seem to remember you work by saving notes and quietly adding them back into the context.

Long chats get slower and more expensive, because everything is read again on every turn. When the window fills up, older parts get trimmed or summarised. That is when it “forgets” what you told it at the start.

The practical tip: new task, new chat. If a conversation has gone off track, starting fresh with a clear request often beats arguing, because the argument is in the context too.`]
  ],
  4: [
    ['A question with a catch', `This has exactly the same shape as the earlier questions, but there is a catch. Can you spot it? Something that just follows the pattern would happily reply with a city and move on.`],
    null,
    ['Showing its working', `Newer “reasoning” models write working notes before they answer. The model produces its reply one small piece at a time, and each piece is based on everything before it. Writing out the steps first means the answer is built on worked reasoning rather than a snap judgement, a bit like showing your working in a maths exam.

Many apps hide these notes, or show a short “Thinking…” summary.`],
    ['A better answer', `This is the answer a knowledgeable person would give: it deals with the false assumption in the question instead of just playing along. The working notes are what made that possible.`],
    ['When it is worth it', `The trade-off is time and cost. Thinking takes longer and uses more of the context window, so it pays off on questions with a catch, multi-step problems, planning and code, and is wasted on simple lookups. Many tools now let you switch it on, or decide for you.

Nothing new has happened mechanically, though. The notes are just more text in the list.`]
  ],
  5: [
    ['Asking for an action', `Until now everything has been text in, text out. “Save these capitals to my notes” needs something to actually happen on a computer, and a brain in a jar cannot do that by writing the word “saved”.`],
    ['Meet the loop', `The harness tells the model, in text, which tools are available: here, reading and writing files. Now the model has a new option. Instead of replying to you, it can reply with a request for the harness to do something.`],
    ['Look before you leap', `A sensible first move. The model has no idea what is already in the notes, and writing blindly could wipe them. Good agents read before they change things, just as a careful person would.`],
    ['A request, not an action', `This is still only text, written in a format the harness recognises. The model has not touched anything yet.

This is where control lives. The harness decides which tools exist and whether to ask you first, which is why coding tools pop up a permission prompt before running a command or editing a file.`],
    ['The result goes back in', `The harness reads the file and adds what it found to the context. Then, crucially, it calls the model again by itself instead of handing control back to you. That one change is what lets these tools work through a task in several steps.`],
    ['Same model, more to go on', `Nothing cleverer has stepped in. The same model is reading the same list, which now includes the contents of the file.`],
    ['Second trip round', `Now it knows what is there, it asks for the updated file to be written. On a real task this cycle might run dozens of times: read some code, change it, run the tests, read the failures, try again.`],
    null,
    ['Knowing when to stop', `This time the model replies with ordinary text. The harness sees no tool request, so it hands back to you. That is the only way out of the cycle.`],
    ['What to ask about any agent', `This explains both the power and the risk. What an agent can do depends on two things: how good the model’s judgement is, and which tools it has been given. More tools means more it can do, and more that can go wrong.

Tool results also keep it honest. A test that fails is real feedback, not a guess, which is why agents are so effective at work with checkable results, like code.

So when someone offers you an “AI agent”, ask: which model, which tools, and who approves the actions?`]
  ],
  6: [
    ['A question it cannot know', `“Our” changes everything. The model learned from public text and has never seen your company’s documents. Left alone it would either admit it does not know or, worse, produce a plausible generic policy that sounds right.`],
    null,
    ['Search first', `So it uses a tool again, this time a search over the company’s documents. This is broadly how tools like Microsoft 365 Copilot answer questions about your organisation: they search the files, emails and chats you have access to, and pass the best matches to the model.`],
    ['It has a name: RAG', `You will hear this called RAG, retrieval-augmented generation. Strip away the jargon and it is search, then paste the results into the context.

The catch is that the answer can only be as good as the search. If it finds an out-of-date version of a policy, the model will summarise that, confidently.`],
    ['Check the source', `The facts in this reply came from the documents, not the model. Good tools show you which document they used, and for anything that matters it is worth clicking through. If an answer is wrong, the fix is usually the documents or the search, not the model.`],
    ['Why this is good news', `Update the document and tomorrow’s answers change, with no retraining.

The flip side: the assistant can surface anything the search can reach. Once AI can search your organisation’s files, sloppy sharing permissions start to matter a lot more.`]
  ],
  7: [
    ['A brief you never saw', `This Acme assistant had instructions from the very first message, written by whoever built the app and never shown to the user. Every AI product has one, and some run to thousands of words. It is a big part of why the same model behaves so differently from one product to the next.

Look at the last line: “Never make up information about policies”. That is the assistant being steered towards searching rather than guessing.`],
    ['You can write your own', `Most tools let you add your own version: custom instructions in ChatGPT, instruction files such as AGENTS.md for GitHub Copilot, CLAUDE.md for Claude Code. Use them for your role, your preferred style and the things you always end up correcting.

But it is just text at the top of a list. It strongly shapes behaviour; it does not guarantee it.`]
  ],
  8: [
    ['A task with a house style', `A polite decline sounds simple, but doing it well involves judgement: how formal, how much reason to give, whether to offer an alternative. Organisations often have a preferred way of doing jobs like this.`],
    ['A menu, not a manual', `The system prompt lists available skills with a one-line description of each, not the full instructions. Why not include everything? Space and focus: dozens of detailed procedures would crowd the context window and distract from the task. So it gets a short menu, and fetches the full recipe only when needed.

The user does not need to know any skill names. Plain language is enough.`],
    ['The same trick again', `Fetching the skill is just another tool call, exactly like reading the notes file. The model matched the request to the right item on the menu and asked for its instructions.`],
    ['The recipe arrives', `Now detailed, step-by-step guidance sits in the context. Writing one is not programming: a skill is usually a text file with a description and some instructions. A team can write down “how we do this” once, and everyone’s assistant follows it.`],
    ['Spotting a skill', `If you keep pasting the same long instructions into a chat, that is a skill waiting to be written. Packaging know-how this way is one of the easiest wins with these tools, and you do not need to be technical to do it.`]
  ],
  9: [
    ['The one idea', `Every feature in this talk reached the model the same way: as text added to its context. The skill in building these products is deciding what goes into that text, and when.`],
    ['A checklist for bad answers', `This stack doubles as a checklist when an assistant lets you down. Did it have the right instructions? The right documents? Has the conversation grown long or muddled? Could it check its own work with tools?

Most disappointing answers are context problems rather than intelligence problems, and many of them you can fix yourself.`],
    null,
    null,
    null,
    null,
    ['Choosing tools', `Because the same few models sit behind most products, a lot of the difference between tools comes from how well they manage this stack: what they search, which tools they offer, how they handle long conversations. That is worth weighing when deciding which tools to use.`],
    ['Practising what it preaches', `All of this was made through a couple of conversations with exactly the kind of agent described here. It read files, wrote the HTML, CSS and JavaScript, and went back over its own work to fix problems, while I clicked through each stage in the browser.

The moment it clicked: I asked to move on to phase two, only to find it had already built all eight planned stages from the first prompt.`],
    ['What the human actually did', `These are the actual prompts, and most are about direction and taste: the story, the layout, a friendlier light mode for non-technical audiences, a better title.

Halfway through I told it I was impressed, then added: “I know you’re just a pile of context so it’s silly to say that!” That is this whole talk in a sentence. If you want to see how the work happened, you can step through the recorded build.`]
  ]
};

const PLAYBACK_NOTE = ['Optional: how this was built', `This is the recorded session that built the presentation: the human’s messages, the model’s tool requests and the results returned to it. Watch for the loop from the tool calling section running for real, over and over. Use Next and Back to step through at your own pace.`];

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
    let index = offset;
    while (!playback && index > 0 && !GUIDE_NOTES[stage][index]) index--;
    const note = playback ? PLAYBACK_NOTE : GUIDE_NOTES[stage][index];
    const carried = !playback && index !== offset;
    document.getElementById('guide-heading').textContent = note[0];
    document.getElementById('guide-text').replaceChildren(...note[1].split(/\n\s*\n/).map(text => {
      const p = document.createElement('p');
      p.textContent = text;
      return p;
    }));
    document.getElementById('guide-position').textContent = playback
      ? `Build playback · ${offset} / ${Playback.getLoadedCount()} events`
      : `${STAGE_NAMES[stage]} · Step ${currentStep + 1} of ${finalIndex + 1}`;
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
      // Allow time to read a new explanation; animation beats under an
      // explanation already on screen only need time to watch.
      const seconds = carried ? 4 : Math.max(9, Math.ceil(note[1].split(/\s+/).length / 2.8) + 3);
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
