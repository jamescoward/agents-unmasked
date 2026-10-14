const assert = require('node:assert/strict');

// These boundaries are editorial requirements, independent of GUIDE_NOTES.
// A heading can spoil a reveal just as easily as the body copy can.
const boundaries = [
  [1, 3, /harness|body around the brain/i],
  [2, 9, /context|history|earlier (?:exchange|question).*supplied/i],
  [3, 9, /stateless|whole conversation|every request|sent every time/i],
  [4, 3, /dissolved|1993|successor|\bCzechia\b|\bSlovakia\b|Bratislava/i],
  [4, 5, /more tokens|better answers/i],
  [5, 10, /an agent is|agent loop|core of an agent/i],
  [5, 7, /write_file/i],
  [6, 4, /26 weeks|handbook|regardless of gender/i],
  [6, 6, /not learning|isn't learning|not training|retraining/i],
  [7, 2, /personality, rules, and capabilities/i],
  [8, 4, /120.word|sign.off|never.*invent|acknowledgement/i],
  [8, 5, /Thursday|quarterly review|written update|skills are prompt templates/i],
  [9, 8, /Claude Code|built with|built by|presentation.*built/i],
  [9, 9, /actual prompts|prompts that built|layout direction|light mode/i]
];

// Copy restored from b98efcb, checked in the rendered presentation.
const copyChecks = {
  '1:2': /A text-in, text-out program running in the cloud\./,
  '1:3': /Software running on your computer that lets the model see and act in the world\./,
  '3:9': /The model is stateless\.The whole conversation is sent on every request\./,
  '4:3': /Thinking \(hidden from user\)/,
  '4:5': /"Reasoning" is just the model thinking out loud in the context window\.It uses more tokens, but produces better answers for complex questions\./,
  '5:10': /An "agent" is just this loop running until the model stops calling tools\./,
  '6:6': /The model isn't learning anything\. What looks like institutional knowledge is just a search result injected into the context\./,
  '7:2': /Personality, rules, and capabilities are all just text\s*prepended to the context window\. More context\./,
  '8:5': /my Thursday afternoon is fully booked with prep for the quarterly review\. If a written update would help, I'm happy to send one through\./,
  '9:5': /Every message, every turn, sent every time\.\.\./,
  '9:6': /Chain-of-thought reasoning, hidden from user\.\.\./,
  '9:8': /This presentation was built with Claude Code\./,
  '9:9': /The prompts that built this presentation:/
};

module.exports = async function verifyRevealContent(page) {
  const state = await page.evaluate(() => {
    const stage = steps[currentStep].stage;
    return {
      stage,
      reveal: currentStep - steps.findIndex(s => s.stage === stage) + 1,
      note: document.getElementById('guide-heading').textContent + ' ' + document.getElementById('guide-text').textContent,
      slide: ['right-panel', 'chat-messages'].map(id => document.getElementById(id).textContent).join(' ').replace(/\s+/g, ' ').trim()
    };
  });
  const key = `${state.stage}:${state.reveal}`;
  for (const [stage, firstReveal, pattern] of boundaries) {
    if (state.stage === stage && state.reveal < firstReveal) {
      assert.doesNotMatch(state.note, pattern, `Narration previews a later reveal at ${key}`);
    }
  }
  assert.doesNotMatch(state.note, /next (?:section|reveals?)|we will|illustrative|not a literal|aren't guaranteed|real apps may|some apps/i,
    `Narration previews or softens the explanation at ${key}`);
  if (copyChecks[key]) assert.match(state.slide, copyChecks[key], `Original copy missing at ${key}`);
  if (key === '3:9' || key === '9:5') {
    assert.match(state.note, /the model is stateless/i);
    assert.match(state.note, /the whole conversation is sent every time/i);
  }
  if (key === '9:9') {
    assert.match(state.note, /actual prompts/i, 'The last note must explain the prompts reveal');
  }
};
