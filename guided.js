// Speak as the presenter: explain why each step matters, rather than captioning
// visible changes. Keep explanations grounded in what has been revealed so far;
// save each takeaway for its matching callout. Playback uses a shared note.
const GUIDE_NOTES = {
  1: [
    ['What makes an agent an agent?', 'A fluent chat can make AI feel like a person on the other end. But what are we actually interacting with? “Agent” sounds like a whole new kind of intelligence. The useful starting point is to unpack what that word means.'],
    ['A brain in a jar', 'The model is the part that turns text into more text. That is a powerful ability, but it does not give Claude or GPT hands. Asking a model to open a file does not, by itself, give it a way to touch your computer.'],
    ['The body around the brain', 'The harness gives that language ability a way to do useful work. This is why two products using the same model can feel so different: the surrounding software determines what the model can see and act on. The model and the product are different things.']
  ],
  2: [
    ['Start with something familiar', 'A capital-city question is a useful starting point because the task is unambiguous and the answer is easy to recognise. There is no special command language to learn; we just ask a question.'],
    ['Ordinary language is the interface', 'We have not told the assistant which function to run or which database field to look up. We have described what we want in everyday language and left it to the assistant to produce an answer.'],
    ['A very human rhythm', 'Those typing dots borrow a familiar rhythm from messaging another person: your turn, a pause, then their turn. A small interface choice makes the interaction feel surprisingly social.'],
    ['A straightforward answer', 'Paris is the answer we expected. The extra explanation also makes the reply feel conversational, rather than like a search box returning a single fact. So far, this could be a series of independent questions.'],
    ['We leave most of the question out', '“What about Germany?” is incomplete on its own. What about its population, its language, its weather? We leave those words out because, in conversation, we expect the other participant to follow the thread.'],
    ['An expectation borrowed from conversation', 'We have only named a country, but we are trusting the assistant to carry over the task. That is an expectation we bring from human conversation: once a subject is established, we do not restate it at every turn.'],
    ['It feels like talking to someone', 'We do not usually notice how much we assume in an exchange like this. We simply wait for an appropriate reply, as though there were someone on the other end who has been following along.'],
    ['It understood a question we never fully asked', 'Berlin answers the implied question perfectly. The interesting part is not knowing a capital city; it is understanding what those three words were asking. How did the assistant get the missing meaning?']
  ],
  3: [
    ['Context is the working material', 'Context is the text the model has in front of it to work with. The context window is the space available for that material. Think of a desk: the question is something placed on it, and the desk has a limited size.'],
    ['The assistant’s own words matter too', 'A conversation is shaped by answers as well as questions. If you ask an assistant to “explain that more simply”, its previous answer is the very thing you are referring to. That text belongs in the working material too.'],
    ['The missing meaning is in the surrounding text', 'Put the Germany question beside the France exchange and the ambiguity disappears. The earlier question establishes the task, and the follow-up changes the country. That is what context contributes: meaning that the latest message does not contain on its own.'],
    ['Conversation takes up space', 'Each exchange adds to the material the model has to work with. That space is measured in tokens: words or pieces of words. A long answer uses space just as a long question does; both contribute to the size of the conversation.'],
    ['Two words can be enough', '“And Spain?” pushes the same shortcut further. A useful question does not have to be long if the surrounding conversation already establishes what is being asked. Length and clarity are different things.'],
    ['The chat is an interface to the text', 'To us, this feels like a conversation. For the model, the question is part of a body of text to interpret. The connection between “Spain” and “capital city” is there in that text; it does not have to be spelled out in the latest sentence.'],
    ['Useful context does work for you', 'This is why a short follow-up can be more effective than a long question without any background. The task has already been established. The new message only needs to say what has changed.'],
    ['An answer becomes something to refer to', 'Madrid completes the exchange, but the answer is also part of the conversation now. A reply can introduce facts, names and explanations that a later question refers back to. The assistant’s output becomes working material in its own right.'],
    ['The model is stateless', 'The model is stateless. The whole conversation is sent every time. It is not remembering the previous request; it is reading the earlier messages again. What feels like a continuous discussion is built from fresh requests containing the conversation.']
  ],
  4: [
    ['The same question pattern', 'The earlier questions established a very easy pattern: name a country, get a capital. This question has exactly the same shape. It is tempting to treat it as just another item in that sequence.'],
    ['What does a useful answer require?', 'The wording tells us what the user wants, but a useful answer takes more than matching the form of the question. The model has to work out how to respond to this particular request, rather than just continuing the earlier pattern.'],
    ['Work through the premise before answering', 'Here is the complication: Czechoslovakia no longer exists. The thinking text works through what that means for the question, identifies the successor states, and plans an explanation. Writing those steps gives the model something to build on before it produces its reply.'],
    ['Answer the question behind the question', 'Simply saying “Prague” would miss the point. The useful answer explains the historical change and gives the capitals of both successor states. The work in the thinking block has shaped an answer that addresses what the user needs to understand.'],
    ['Reasoning is text in the context', '“Reasoning” is the model thinking out loud in the context window. It uses more tokens, but produces better answers for complex questions. The model can build on its own intermediate work, just as writing out a problem helps you work through it.']
  ],
  5: [
    ['Words need a way to become actions', '“Save these capitals” asks for something a text answer cannot accomplish by itself. A sentence saying “saved” does not change a file. This is where the distinction between the model and its harness becomes practical.'],
    ['Deciding and doing are separate jobs', 'The model reads the request and decides what should happen. The harness provides the machinery for carrying out a tool call. Keeping those jobs separate explains how a text-producing model can participate in work on a computer.'],
    ['Understand the file before changing it', 'Saving these facts safely means finding out what is already in the notes. Otherwise, adding something could mean replacing work the user wanted to keep. Reading first gives the model the information it needs to decide on a sensible change.'],
    ['A tool call is a different kind of output', 'read_file("notes.txt") is still output from the model, but it is addressed to the harness. Its structure identifies an operation and a file. That gives the software something specific to execute, rather than a sentence to display to the user.'],
    ['Bring the outside world back as text', 'The harness does the actual file access. Returning the contents as a tool result turns something outside the conversation into text the model can use. That is the bridge between a model working with text and a computer holding files.'],
    ['The same model, with better information', 'There is no new intelligence taking over for the second iteration. The same model now has the file contents alongside the request. The extra information lets it work out how to add the capitals to what is already there.'],
    ['Specify the change', 'The write_file call describes the next operation: which file to change and what its contents should be. The model supplies those details; the harness is responsible for performing the file operation.'],
    ['A result is evidence of what happened', 'The success result matters. Choosing an action and completing it are separate events. Feeding the result back gives the model evidence that the requested change has actually happened.'],
    ['The choice to stop is part of the process', 'With success in hand, the model can answer the user. This time its output is an ordinary reply instead of another tool call. That choice ends the cycle: there is no further operation for the harness to run.'],
    ['An agent is just this loop', 'An agent is just this loop running until the model stops calling tools. The model decides, the harness acts, and the result becomes context for another decision. The word “agent” names that arrangement; it does not require a different kind of model.']
  ],
  6: [
    ['“Our” changes the question', 'A company policy is a different kind of fact from a capital city. “Our” points to a particular organisation, and the right answer depends on that organisation’s current rules. A plausible-sounding policy would not be enough.'],
    ['What would count as an answer?', 'The user wants the company’s rule, not general advice about parental leave. To answer that request, the assistant needs company-specific information. Knowing what evidence the task requires is part of understanding the question.'],
    ['Use a tool to get information', 'A tool can find information as well as change a file. This search asks the company knowledge base for material relevant to the question. The model does not have to supply the policy from its own general knowledge.'],
    ['Put the right documents on the desk', 'These handbook passages provide the missing company-specific facts. RAG means retrieval-augmented generation: retrieve relevant text, then use it to generate an answer. The important move is bringing useful source material into the context.'],
    ['The source does the factual work', 'The 26-week entitlement and the eligibility statement both come directly from the retrieved passages. The model’s job here is to turn that source material into a useful reply. The answer’s company knowledge comes from the documents it has been given.'],
    ['It did not learn a company policy', 'The model is not learning anything. What looks like institutional knowledge is just a search result injected into the context. Change the source documents and a later search can supply different information, without retraining the model.']
  ],
  7: [
    ['The assistant has a brief', 'The user did not type these instructions. They come from the application and tell the model what job it is doing and how to approach it. The same question can produce a different response when the assistant has been given a different brief.'],
    ['The brief is text too', 'Personality, rules, and capabilities are all just text prepended to the context window. There is no separate personality component needed to explain the Acme assistant’s manner: its brief tells it how to behave. More context.']
  ],
  8: [
    ['A familiar job with unstated expectations', '“Draft a polite decline” sounds simple, but there are plenty of choices inside it. How formal should it be? How much explanation is appropriate? We use a short request because we expect the assistant to understand the kind of work we mean.'],
    ['A catalogue makes tasks discoverable', 'The short skill descriptions give the model a way to recognise the kinds of help available. The user can express an intention in ordinary language; they do not have to memorise the exact name of the relevant skill.'],
    ['Match the intention, then ask for the instructions', 'The model has connected “polite decline” with email drafting. Loading that skill uses the same tool-calling mechanism as reading a file. It is a request for the instructions that fit this particular job.'],
    ['Make the procedure explicit', 'The loaded instructions turn “write a good email” into a concrete procedure: consider the relationship, acknowledge the invitation, decline clearly, and close appropriately. That procedure is now material the model can work from, rather than something the user has to explain from scratch.'],
    ['Reusable instructions, delivered when needed', 'Skills are prompt templates loaded via tool calls. The useful part is reuse: the person asking for an email does not have to spell out the writing procedure on every request. The model chooses the relevant instructions and uses them to produce the draft.']
  ],
  9: [
    ['It is context all the way down', 'Several things that sound like separate AI features share a common mechanism. They put useful text in front of the model. Asking what information it has to work with makes the system much easier to understand.'],
    ['What job is the assistant doing?', 'The system prompt answers that question. It gives the model its role and instructions, so the user does not have to establish the assistant’s job at the start of every conversation.'],
    ['How should it approach this task?', 'The skill supplies the procedure for a particular kind of work. Detailed guidance arrives when the task calls for it, instead of making the user repeat the instructions.'],
    ['Which facts does the answer depend on?', 'Retrieval supplies the relevant source material. The model can answer about a company document because the useful passages have been placed in its context.'],
    ['What have we already said?', 'The model is stateless. The whole conversation is sent every time. Conversation history supplies the continuity that makes a two-word follow-up meaningful.'],
    ['What work has it done on the problem?', 'Thinking blocks give the model intermediate work to build on. That reasoning takes up context too, even though the user’s chat contains only the final answer.'],
    ['How does the work reach the outside world?', 'Tool calls hand operations to the harness, and tool results bring the outcomes back into context. That is how text generation becomes part of a process that can read documents, change files and complete a task.'],
    ['This was built with the same arrangement', 'This presentation was built with Claude Code. The model could work on the website because its harness let it read files, make edits and check the results. You are looking at the output of the process we have just unpacked.'],
    ['The human’s part in the work', 'These actual prompts show the human contribution: setting the direction, asking for pauses, making design choices and requesting polish. The person did not need to specify every line of code to shape the result. They directed the work through conversation. You can explore the recorded build, revisit a section or restart the tour.']
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
      ? ['Optional: how this was built', 'The recording lets you examine the process in practice: the human’s instructions, the model’s tool requests and the results returned to it. Each result is evidence behind a subsequent decision. Use Next and Back to follow the work at your own pace.']
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
