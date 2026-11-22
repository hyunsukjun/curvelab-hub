# CurveLab

[Open the public prototype](https://hyunsukjun.github.io/curvelab-hub/). This prototype is updated through the repository’s main branch.

CurveLab brings Audio, Timbre, Space, Granular, Spectral, and Oscillator into one browser workspace. Load an audio file, edit its source waveform, and move between labs. Switching labs carries the working audio forward and adds a Sound Chain stage only when the processing settings have changed.

The web edition currently uses the name CurveLab. When the Mac standalone edition launches, the planned web edition name is CurveLab for Web.

Serve this directory over HTTP from localhost or over HTTPS. Open its index page in a browser.

```sh
python3 -m http.server 8934 --bind 127.0.0.1
```

Open http://127.0.0.1:8934/ in Brave. Processing takes place in the browser. History lives in memory and ends when the page closes or reloads. The Sound Chain shows which source and stages each branch came from. Select a saved stage to reopen its input and settings for editing. Revising it creates a branch from the same input. Use **Process from Here** to start another pass in the same lab using the current result as the new input. Unsaved changes are saved first; previous stages are kept. In Edit Audio, **Reverse** reverses the entire current working audio regardless of selection or zoom. Current source volume and fades are included in the reversed audio; their controls start neutral afterward. Undo restores the previous audio and source controls. Space and Granular offer 2-, 4-, and 8-channel WAV output. Playback and the next Lab share the stereo mix from the same result. An unchanged saved stage exports its stored channel format, and an edited stage exports the latest processed output. See the in-app information panel for file limits and keyboard shortcuts.

The initial release candidate comes from the local 2026-11-07 history checkpoint. Muted Brave verification covered native playback across all six labs, history selection, WAV sample comparisons, and three viewport sizes. Listening and other browsers remain outside this verification.
