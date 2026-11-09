# CurveLab Hub

[Open the public prototype](https://hyunsukjun.github.io/curvelab-hub/). This prototype is updated through the repository’s main branch.

CurveLab Hub brings Audio, Timbre, Space, Granular, Spectral, and Oscillator into one browser workspace. Load an audio file, edit its source waveform, and move between labs. Switching labs carries the working audio forward and adds a Sound Chain stage only when the processing settings have changed.

Serve this directory over HTTP from localhost or over HTTPS. Open its index page in a browser.

```sh
python3 -m http.server 8934 --bind 127.0.0.1
```

Open http://127.0.0.1:8934/ in Brave. Processing takes place in the browser. History lives in memory and ends when the page closes or reloads. The Sound Chain shows which source and stages each branch came from. Select a saved stage to reopen its input and settings for editing. Revising it creates a branch from the same input. Use **Use Output as Input** to start another pass in the same lab from the current output. Pending changes are saved first. Play and Download WAV use the same audio. An unchanged saved stage uses its stored output, and an edited stage uses the latest processed output. See the in-app information panel for file limits and keyboard shortcuts.

The initial release candidate comes from the local 2026-11-07 history checkpoint. Muted Brave verification covered native playback across all six labs, history selection, WAV sample comparisons, and three viewport sizes. Listening and other browsers remain outside this verification.
