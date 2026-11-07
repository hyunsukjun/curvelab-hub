# CurveLab Hub

CurveLab Hub brings Audio, Timbre, Space, Granular, Spectral, and Oscillator into one browser workspace. Load an audio file, edit its source waveform, then move between labs to create saved processing stages.

Serve this directory over HTTP from localhost or over HTTPS. Open its index page in a browser.

```sh
python3 -m http.server 8934 --bind 127.0.0.1
```

Open http://127.0.0.1:8934/ in Brave. Processing takes place in the browser. History lives in memory and ends when the page closes or reloads. Download WAV exports the selected saved stage. See the in-app information panel for file limits and keyboard shortcuts.

The initial release candidate comes from the local 2026-11-07 history checkpoint. Muted Brave verification covered native playback across all six labs, history selection, WAV sample comparisons, and three viewport sizes. Listening and other browsers remain outside this verification.
