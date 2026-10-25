# Agents Unmasked

A static, interactive presentation explaining models, context, reasoning, tools,
retrieval, system instructions, and skills. All demonstrations are scripted.

Serve the checkout over HTTP so the recorded build playback can load:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open the served presentation in your browser. Use the arrow keys or stage dots to
navigate. Choose **Guided tour** for explanations at each reveal, then **Next**
and **Back** to read at your own pace. **Autoplay** advances after a reading delay;
**Pause**, manual navigation, turning the tour off, or leaving the browser tab
stops it. The tour finishes at the conclusion, with build playback offered as an
optional extra. This mode uses written explanations, with no audio or AI service.

Presenter notes live in `guided.js`, one entry per step of each stage in `app.js`.
They hold what the presenter would say out loud: why a step matters, what it
means in practice, and the background behind the build. Never repeat what the
slides already say; the callouts carry the takeaways. Use `null` for steps that
are only animation beats, which keeps the previous note on screen. Don't give
away a reveal before it appears. Update both files when adding or rearranging
reveals. The tour never changes the slides themselves.

## Browser regression check

The website has no build or package dependencies. Its optional browser test uses
Playwright Core and a locally installed Chromium. With the HTTP server running,
install the test tooling outside the checkout and run:

```sh
npm install --prefix /tmp/agents-unmasked-tests --cache /tmp/agents-unmasked-npm-cache --no-audit --no-fund playwright-core
NODE_PATH=/tmp/agents-unmasked-tests/node_modules node tests/guided-tour.cjs
```

The test defaults to `/usr/bin/chromium` and the local server on port 8000. Set
`CHROMIUM_PATH` or `PRESENTATION_URL` to use other locations. It checks all tour
steps forwards and backwards, autoplay timing and stopping, restart, optional
playback, keyboard interaction, and a small-screen layout. External fonts are
blocked during the test to verify the fallback fonts work. Content checks also
protect the restored slide wording and prevent narration from getting ahead of
key reveals, in both navigation directions.
