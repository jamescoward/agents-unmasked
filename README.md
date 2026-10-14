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

Presenter notes live in `guided.js`, in the same order as each stage's steps in
`app.js`. Explain only what the current step has revealed; keep each takeaway at
its matching callout. Update both when adding or rearranging reveals.

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
