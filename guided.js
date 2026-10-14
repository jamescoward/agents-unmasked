// Presenter notes follow the existing reveals in each stage, in order.
// Keep these lists aligned with defineSteps(); playback events use a shared note.
const GUIDE_NOTES = {
  1: [
    ['Welcome to Agents Unmasked', 'You already know what chatting with AI looks like. This tour opens up the box: what receives your message, how an answer is produced, and how an AI can take actions. Use Next at your own pace, or choose Autoplay.'],
    ['Meet the model', 'The model is the part that produces responses: GPT, Claude and Gemini are examples. Think of it as the brain. By itself, it does not open your files or send your emails; it needs other software to connect it to those things.'],
    ['Meet the harness', 'The harness is that surrounding software: the body around the brain. It shows the chat, supplies information to the model, and carries out permitted actions. It can run on your device, on a server, or both. Together, model and harness make an agent possible.']
  ],
  2: [
    ['Start with a familiar chat', 'Look at the left panel. Someone is asking for the capital of France. Everything in this presentation is a scripted example, so no real AI requests are being sent. We will first show what the user sees, then reveal what happens behind it.'],
    ['Your message is sent', 'The app takes the question and passes it to the model. The chat bubble is the visible record of that exchange. Behind the scenes, the app packages the question together with any other information the model needs.'],
    ['Waiting for a reply', 'The moving dots mean the app is waiting. They are a familiar interface effect, rather than a window into what the AI is actually doing. In a real app, the model is generating a response.'],
    ['The answer arrives', 'The model produces text, and the app displays it as a reply. So far, this is a straightforward question and answer. No files have been opened and no outside tools have been used.'],
    ['A follow-up question', 'Now the user asks, “What about Germany?” Notice that they did not repeat the words “capital city”. A person understands the connection from the conversation. How does the AI get that connection?'],
    ['The conversation continues', 'The app sends this new message to the model. To make sense of it, the model also needs the earlier exchange. The next section will show how the app supplies that history.'],
    ['Another pause', 'While waiting, the app shows the same typing indicator. The interface makes this feel like talking to someone who remembers the discussion. That impression comes from how the app manages the conversation.'],
    ['An answer that fits the conversation', 'The model replies with Berlin, rather than asking what we want to know about Germany. It can do that because the earlier question was supplied alongside the new one. Next, we will reveal that information.']
  ],
  3: [
    ['Context: the information in front of the model', 'Look at the right panel. “Context” means the information supplied for this particular response. The context window is the amount the model can work with at once. Think of it as a desk with limited space, rather than an unlimited memory.'],
    ['Replies become part of the history', 'The earlier answer is included too. That lets the model refer to what has already been said. The bars and percentages here are illustrative; they show the information growing rather than measuring a real request.'],
    ['Why “What about Germany?” makes sense', 'The short follow-up sits beside the earlier question and answer. Read them together and the meaning is clear. The model gets that same surrounding information, rather than just the latest sentence.'],
    ['The context grows', 'Both sides of the conversation can be included. Every added message takes up some of the available space. Models count this space in “tokens”: small pieces of text, often words or parts of words. You do not need to read any code to understand the pattern.'],
    ['Try another short question', '“And Spain?” is even shorter. On its own, it could mean almost anything. In this conversation it means, “What is the capital of Spain?” The history supplies the missing meaning.'],
    ['One message, two views', 'The question now appears on both sides. The left is what the user sees; the right represents information supplied to the model. These are two views of the same exchange.'],
    ['Working with the supplied context', 'The model can use the history and the new question together to generate its next reply. It does not need to have personally remembered your earlier visit: the app supplies what is relevant now.'],
    ['The reply joins the context', 'Madrid appears in the chat, and the reply becomes available for later turns. This creates the feeling of a continuous conversation even though each response uses a new request.'],
    ['The app manages the memory', 'The key idea is that the model relies on the context supplied with each request. This example includes the whole short conversation. Real apps may shorten, summarise or retrieve older messages when the conversation is too long. Saved memory is also something the app can supply.']
  ],
  4: [
    ['Some questions need more care', 'Now the user asks about Czechoslovakia, a country that no longer exists. A helpful answer needs to notice that complication instead of treating the question as another simple capital-city lookup.'],
    ['The question still arrives as context', 'The basic arrangement has not changed: the app supplies information, and the model produces a response. The difference is how much work the model does before answering.'],
    ['An illustration of reasoning', 'The purple block illustrates working through a problem: notice the country dissolved, identify its successors, and decide how to explain that. This is a scripted teaching example, not a literal view inside every AI model. Some apps show a summary of reasoning; others do not.'],
    ['The user gets the final answer', 'The left panel shows the useful result: historic Prague, and the capitals of today’s Czechia and Slovakia. A reasoning model can spend extra computation before producing this answer, without showing all of that work to the user.'],
    ['Extra work can help, but is no guarantee', 'Reasoning is useful for tasks that need several connected steps. It can take longer and cost more computation. It does not make the answer automatically correct: checking facts still matters. The important distinction here is between working through a problem and the final reply.']
  ],
  5: [
    ['From answering to doing', '“Save these capitals to my notes” asks for an action outside the chat. Producing a sentence saying “saved” would not actually change a file. The model needs a connection to a tool that can do the work.'],
    ['Follow the loop on the right', 'The diagram separates three parts: the model decides what it needs, a tool call describes the requested action, and the harness carries it out. This repeated exchange is the core of an agent.'],
    ['First, find out what is already there', 'The model decides to read the notes before changing them. That avoids blindly replacing existing content. At this point it has chosen an action, but no file has been opened yet.'],
    ['A tool call is a request', 'read_file("notes.txt") means “please open this file and give me its contents”. You do not need to understand the punctuation. It is a structured instruction for the surrounding software, rather than an ordinary reply to the user.'],
    ['The harness does the opening', 'The model cannot open the file by itself. The harness runs the permitted tool and returns what it found. Those contents are added to the context, so the model can use them on the next pass through the loop.'],
    ['Decide again with new information', 'The model now sees the existing notes. It can work out how to add the capitals. Notice the loop returns to the same model, with more information than it had before.'],
    ['Ask for the change', 'The next request is to write the updated file. A real harness decides which tools are available and enforces access rules. Depending on the app and the action, it may also ask the user to approve the change.'],
    ['The tool reports what happened', 'The harness writes the file and returns a success result. A tool could also report an error, such as a missing file or denied access. The model needs that result before it can accurately describe what happened.'],
    ['Now a normal reply is enough', 'After seeing success, the model tells the user the capitals were saved. It does not request another tool here, so this example’s loop finishes. The reply is supported by an action result, rather than just a promise.'],
    ['The agent loop', 'This is the main takeaway: decide, request an action, receive the result, then decide again. A real system can also stop because of a limit, an error or a user interruption. The model supplies decisions; the harness supplies the connections and controls.']
  ],
  6: [
    ['What if the answer is in company documents?', 'The user now asks about a parental leave policy. A general AI model cannot be assumed to know a company’s current internal handbook. It needs the relevant documents. The policy shown here is fictional.'],
    ['Use the question to find information', 'The question provides a search topic. Instead of guessing from general knowledge, the system can look for relevant passages in an accessible company knowledge base.'],
    ['Search is another tool', 'This tool request asks for information about parental leave. The same agent pattern can be used: request a search, get results, then answer. Some apps perform retrieval automatically before asking the model to respond.'],
    ['Put useful passages in front of the model', 'The search returns handbook excerpts. These are supplied as context, like putting the right pages on the model’s desk. This approach is called RAG: retrieval-augmented generation. In everyday language, find useful information, then use it to answer.'],
    ['Answer using the retrieved material', 'The model can now summarise the policy from the passages it received. In a real app, source references help you check the answer. Its reliability still depends on finding accurate, current documents and interpreting them correctly.'],
    ['Retrieval is different from training', 'The model has not learned a new company policy permanently just by reading these results. It is using information supplied for this response. Updating the documents can therefore change future answers without retraining the model.']
  ],
  7: [
    ['Instructions you did not type', 'The app can include instructions before your message: for example, be concise, answer about company policies, and say when information is missing. These are called system instructions or a system prompt. Think of them as the assistant’s brief.'],
    ['Guidance and permissions are different', 'Instructions help shape tone and behaviour, but they are not a guarantee the model will follow every rule. They also do not grant access to files or email. The surrounding software controls which tools and permissions are actually available.']
  ],
  8: [
    ['A reusable recipe for a task', 'The user asks for a polite reply declining a meeting. Rather than repeating a long set of writing instructions every time, an app can provide a reusable recipe called a skill.'],
    ['A menu of available skills', 'The right panel lists short descriptions of recipes for common tasks. The model can choose a suitable one from the user’s request. Some apps also let users choose explicitly with a command such as /email-draft.'],
    ['Choose and load the recipe', 'The model matches the request to the email-draft skill and asks for its instructions. Notice that loading a skill is itself a tool call. It gives the model more guidance about how to do the task.'],
    ['The instructions join the context', 'Now the full recipe is supplied: match the tone, decline politely, and do not invent details. The model can apply it to this request. These instructions are loaded when useful, rather than every recipe being included in every exchange.'],
    ['A draft, not a sent email', 'The reply follows the recipe without inventing a reason for declining. It is still only a draft: sending it would require a separate tool and appropriate access. A skill tells the model how to approach a task; it does not by itself perform an outside action.']
  ],
  9: [
    ['Put the pieces together', 'We have seen several features that can look like separate kinds of magic. Many work by giving the model useful information and instructions, then connecting its requests to tools. The next reveals collect those pieces in one place.'],
    ['The assistant’s brief', 'System instructions set the intended role, tone and rules. They are part of the information supplied to the model, even when the chat interface does not display them.'],
    ['The task recipe', 'A skill adds detailed guidance when a particular task needs it. In our example, it supplied a recipe for drafting a polite email.'],
    ['Relevant reference material', 'Retrieved documents add information the model may not otherwise have, such as a company’s current policy. Retrieval supplies evidence for an answer without changing the model’s training.'],
    ['The conversation so far', 'The app supplies relevant previous messages so follow-ups make sense. For longer conversations, it may use summaries or retrieve selected history to fit the available context.'],
    ['Work before the final reply', 'Some models spend additional computation working through a problem. The thinking block in this presentation is illustrative; how that work is handled and what is visible varies between models and apps.'],
    ['Connections to the outside world', 'Tools let the surrounding software search, read or act on the model’s requests, and return results. The useful picture is context plus a decision-and-action loop, with access controlled by the harness.'],
    ['This presentation is an example too', 'The presentation itself was built with a coding agent. Instead of updating notes, its tools could read and edit website files. The same loop supported a different kind of task.'],
    ['You have reached the end of the tour', 'The model produces responses and decisions. The harness supplies context, runs permitted tools, and feeds results back. Documents and skills add information and instructions along the way. You can restart, revisit any section, or explore the optional build playback to see a coding agent at work.']
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
