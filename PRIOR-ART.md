# Prior Art Research

Research conducted 2026-02-28 to check for similar explanations, presentations, and websites.

## Conclusion

**The presentation appears to be original in its format and approach.** The individual concepts (agent loops, context windows, tool calling, RAG, system prompts) are well-established in the AI community, but no existing resource combines them into an interactive, progressively-revealed, split-panel presentation format.

## Closest Thematic Matches

### Andrew Bolster - "Context all the way down" (April 2024)
- **URL:** https://andrewbolster.info/2024/04/context-all-the-way-down-primer-on-methods-of-experience-injection-for-llms.html
- **Overlap:** Uses the same phrase "context all the way down"; covers prompt engineering, RAG, and context as the key abstraction
- **Differences:** Text blog post (not interactive); doesn't cover tool calling, agent loops, thinking blocks, or skills

### Sketch.dev - "The Unreasonable Effectiveness of an LLM Agent Loop with Tool Use" (May 2025)
- **URL:** https://sketch.dev/blog/agent-loop
- **Overlap:** Makes the same core point that the agent loop is "shockingly simple" (~9 lines of code)
- **Differences:** Text blog post; no visual/interactive component; focused only on the loop itself

### Simon Willison - Agent Loop Definition (2025)
- **URL:** https://simonwillison.net/tags/ai-agents/
- **Overlap:** Canonical definition "an LLM that runs tools in a loop to achieve a goal"; coined "designing agentic loops" as a skill
- **Differences:** Blog posts and newsletter format; no interactive presentation

### Anthropic - "Effective context engineering for AI agents" (2025)
- **URL:** https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- **Overlap:** Context as a finite resource, system prompts, tool results filling context, sub-agent architectures
- **Differences:** Technical blog post with diagrams; not an interactive presentation

## Visual/Interactive Explainers (Different Focus)

### LLM Visualization by Brendan Bycroft
- **URL:** https://bbycroft.net/llm
- **Overlap:** Interactive visual explainer for LLM concepts
- **Differences:** Focuses on transformer internals (attention, embeddings), not the agent layer

### Transformer Explainer (Georgia Tech)
- **URL:** https://poloclub.github.io/transformer-explainer/
- **Overlap:** Interactive, runs in-browser, educational
- **Differences:** Focuses on transformer architecture, not agents

### AnimatedLLM (Charles University)
- **URL:** https://arxiv.org/html/2601.04213v1
- **Overlap:** Interactive explainer for non-technical audiences
- **Differences:** Focused on model mechanics, not agent architecture

## Educational Resources Covering Similar Topics

### Frontend Masters - AI Agents v2
- **URL:** https://frontendmasters.com/courses/ai-agents-v2/
- **Overlap:** Covers agent loops, tool calling, context management, RAG
- **Differences:** Video course format

### Rubric Labs - "How Does Claude Code Actually Work?"
- **URL:** https://rubriclabs.com/blog/how-does-claude-code-actually-work
- **Overlap:** Deep-dive on agent loop, tool calling, sub-agents
- **Differences:** Technical blog post

## What Makes This Presentation Unique

1. **Interactive split-panel format** — chat UI alongside "under the hood" view
2. **Progressive layered reveal** — single presentation that peels back layers one at a time
3. **Specific narrative arc** — chat → context window → thinking → tool calling → RAG → system prompt → skills → "it's context all the way down"
4. **Meta angle** — presentation built by the thing it explains
5. **Build playback** — bonus stage replaying the Claude Code session that created the presentation
