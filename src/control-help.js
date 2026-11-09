import {tooltipLanguage} from './tooltip-language.js?v=hub-chain-branch1';

const delay = 500;
const gap = 8;
const edge = 12;

const sourceTooltipCopy = {
  '#source-pen': 'Edit volume points in the source waveform and curve points in the Lab. Click again to return to source selection.',
  '#source-eraser': 'Remove a volume or curve point. Audio regions stay intact.',
  '#zoom-out': 'Show more of the source waveform.',
  '#zoom-in': 'Show a smaller portion of the source waveform in more detail.',
  '#zoom-fit': 'Show the full source waveform.',
  '#undo-edit': 'Undo the last source edit.',
  '#redo-edit': 'Redo the last undone source edit.',
  '#volume-reset': 'Reset the source volume envelope to 0 dB.',
  '#delete': 'Delete the selected source audio and join the remaining parts.',
};

const labTabTooltipCopy = {
  audio: 'Shape playback speed, pitch, and stereo pan.',
  timbre: 'Shape tone with filters and a chain of effects.',
  space: 'Move sound in space and shape distance and reverb.',
  granular: 'Build sound from short grains of the source audio.',
  spectral: 'Transform the frequency content of the source audio.',
  oscillator: 'Resynthesize a file or generate oscillator sound with optional file IR.',
};

const hubControlCopy = {
  '#hub-info-button': ['hub.info', 'Shortcuts and file support.'],
  '#file': ['hub.openAudio', 'Open an audio file as the working source.'],
  '#restore-original': ['hub.original', 'Restore the original audio.'],
  '#grain-channel': ['hub.grainSource', 'Mono mix uses 50% left and 50% right. Left and Right use one original channel.'],
  '#open-ir': ['hub.openIR', 'Open a separate file to use as an impulse response.'],
  '#rewind': ['hub.rewind', 'Move playback to the start.'],
  '#play': ['hub.play', 'Press Space to play or pause the same output used for WAV export.'],
  '#output-gain': ['hub.gain', 'Set gain for playback, WAV and the next Lab. Processed output is capped at −1 dBFS.'],
  '#hub-clip': ['hub.clip', 'Output clip indicator. Click to reset.'],
};

const durationCopy = {
  granular: 'Set the output duration from 0 to 10 minutes.',
  oscillator: 'Set the synthesis duration from 0 to 10 minutes. The impulse-response tail may extend the output.',
};

function legacyStateKey(lab, state) {
  if (lab === 'timbre') return state.endsWith('bypassed') ? 'state.bypassed' : 'state.active';
  if (lab === 'space') return state.includes(': on') ? 'state.on' : 'state.off';
  return state.includes(' On ·') ? 'state.spectralOn' : 'state.off';
}

export function createControlHelp() {
  const tip = document.createElement('div');
  tip.id = 'hub-control-help';
  tip.lang = 'en';
  tip.hidden = true;
  tip.setAttribute('aria-hidden', 'true');
  document.body.append(tip);
  let current, timer;
  let descriptionId = 0;
  const refreshCopy = [];
  tooltipLanguage.subscribe(() => {
    tip.lang = tooltipLanguage.code;
    for (const refresh of refreshCopy) refresh();
    if (current) show(current);
  });

  function hide() {
    clearTimeout(timer);
    current = null;
    tip.hidden = true;
  }

  function show(entry) {
    hide();
    const {anchor, frame, description} = entry;
    if (frame?.hidden || !anchor.getClientRects().length) return;
    const rect = anchor.getBoundingClientRect();
    const frameRect = frame?.getBoundingClientRect();
    const x = rect.left + (frameRect?.left ?? 0);
    const y = rect.top + (frameRect?.top ?? 0);
    const bottom = y + rect.height;
    if (bottom <= 0 || y >= innerHeight) return;

    tip.textContent = description.textContent;
    tip.hidden = false;
    const {offsetWidth: width, offsetHeight: height} = tip;
    const top = bottom + gap + height <= innerHeight - edge ? bottom + gap : y - height - gap;
    tip.style.left = `${Math.max(edge, Math.min(x, innerWidth - width - edge))}px`;
    tip.style.top = `${Math.max(edge, top)}px`;
    current = entry;
  }

  function dismissAfterLeave(entry) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (current === entry && !entry.anchor.matches(':hover') &&
          !tip.matches(':hover') && !entry.control.matches(':focus-visible')) hide();
    }, 180);
  }

  function register(control, getCopy, frame) {
    const doc = control.ownerDocument;
    const description = doc.createElement('span');
    description.id = `hub-help-description-${++descriptionId}`;
    description.hidden = true;
    doc.body.append(description);
    function refresh() {
      description.lang = tooltipLanguage.code;
      description.textContent = getCopy();
    }
    refresh();
    refreshCopy.push(refresh);
    const previous = control.getAttribute('aria-describedby');
    control.setAttribute('aria-describedby', [previous, description.id].filter(Boolean).join(' '));
    // An empty title also suppresses any native tooltip inherited from a parent.
    control.title = '';
    const anchor = control.closest('.hub-help-anchor, label.file') || control;
    const entry = {control, anchor, frame, description};

    anchor.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      clearTimeout(timer);
      if (current === entry) return;
      hide();
      timer = setTimeout(() => {
        if (anchor.matches(':hover')) show(entry);
      }, delay);
    });
    anchor.addEventListener('pointerleave', () => dismissAfterLeave(entry));
    control.addEventListener('focus', () => {
      if (control.matches(':focus-visible')) show(entry);
    });
    control.addEventListener('blur', hide);
  }

  function registerText(control, key, english, frame) {
    register(control, () => tooltipLanguage.text(key, english), frame);
  }

  function localizeParameterHelp(doc, lab) {
    for (const control of doc.querySelectorAll('[data-parameter-help]')) {
      const help = doc.getElementById(control.getAttribute('aria-describedby'));
      const heading = help?.querySelector('strong');
      const body = help?.querySelector('span:not(.helpState)');
      if (!heading || !body) continue;
      const english = [heading.textContent, body.textContent];
      const state = help.querySelector('.helpState');

      function refreshState() {
        const original = control.dataset.helpState || '';
        const text = original && tooltipLanguage.text(legacyStateKey(lab, original), original);
        if (state.textContent !== text) state.textContent = text;
      }

      function refresh() {
        const [title, text] = tooltipLanguage.text(`${lab}.${help.id}`, english);
        help.lang = tooltipLanguage.code;
        help.style.wordBreak = help.lang === 'ko' ? 'keep-all' : '';
        help.style.overflowWrap = help.lang === 'ko' ? 'anywhere' : '';
        heading.textContent = title;
        body.textContent = text;
        if (state) refreshState();
      }

      if (state) new MutationObserver(refreshState).observe(state, {childList: true});
      refresh();
      refreshCopy.push(refresh);
    }
  }

  function connectLab(frame, lab, copy) {
    const doc = frame.contentDocument;
    observe(doc);
    localizeParameterHelp(doc, lab);
    for (const [selector, english] of Object.entries(copy)) {
      for (const control of doc.querySelectorAll(selector)) {
        const key = control.id === 'clearCurveButton' ? 'lab.clearCurrent' : `${lab}.${control.id || control.dataset.waveform}`;
        registerText(control, key, english, frame);
      }
    }
    if (durationCopy[lab]) {
      const duration = doc.getElementById('durationInput');
      registerText(duration, `${lab}.durationInput`, durationCopy[lab], frame);
      function refreshDurationTitle() {
        const text = tooltipLanguage.text(`${lab}.durationInput`, durationCopy[lab]);
        for (const element of doc.querySelectorAll('#durationPanel, #durationValue')) element.title = text;
      }
      refreshDurationTitle();
      refreshCopy.push(refreshDurationTitle);
    }
    const chain = doc.getElementById('chainDiagram');
    if (chain) {
      function refreshChainTitles() {
        for (const button of chain.querySelectorAll('button.chainBlock')) {
          const text = lab === 'timbre'
            ? tooltipLanguage.text('chain.timbre', 'Drag to reorder; keyboard: Alt + Left/Right arrow')
            : tooltipLanguage.text('chain.spectral', 'Click to edit {effect}; drag to change processing order; keyboard: Alt + Left/Right arrow');
          button.title = text.replace('{effect}', () => button.textContent);
        }
      }
      new MutationObserver(refreshChainTitles).observe(chain, {childList: true});
      refreshChainTitles();
      refreshCopy.push(refreshChainTitles);
    }
    const sourceBand = lab === 'oscillator' && doc.querySelector('.sourceBand[title]');
    if (sourceBand) {
      const english = sourceBand.title;
      const refresh = () => { sourceBand.title = tooltipLanguage.text('oscillator.sourceBand', english); };
      refresh();
      refreshCopy.push(refresh);
    }
  }

  function observe(doc) {
    const dismissVisible = () => { if (current) hide(); };
    doc.addEventListener('pointerdown', event => {
      if (!tip.contains(event.target)) hide();
    }, true);
    doc.addEventListener('keydown', event => {
      if (event.key === 'Escape') hide();
    });
    doc.defaultView.addEventListener('scroll', dismissVisible, true);
    doc.defaultView.addEventListener('resize', dismissVisible);
  }

  tip.addEventListener('pointerenter', () => clearTimeout(timer));
  tip.addEventListener('pointerleave', () => {
    if (current && !current.anchor.matches(':hover') && !current.control.matches(':focus-visible')) hide();
  });
  observe(document);
  for (const [selector, english] of Object.entries(sourceTooltipCopy)) {
    const control = document.querySelector(selector);
    const key = `source.${selector.slice(1)}`;
    const shortcut = selector === '#zoom-in' ? '+' : selector === '#zoom-out' ? '−' : '';
    register(control, () => {
      const copy = tooltipLanguage.text(key, english);
      return shortcut ? `${copy} (${shortcut})` : copy;
    });
  }
  for (const [selector, [key, english]] of Object.entries(hubControlCopy)) {
    registerText(document.querySelector(selector), key, english);
  }
  return {
    connectLab,
    registerLabTab(button, lab) {
      register(button, () => {
        const summary = tooltipLanguage.text(`tab.${lab}`, labTabTooltipCopy[lab]);
        const handoff = tooltipLanguage.text('tab.handoff', 'Switching Labs saves a new stage when processing settings changed.');
        return `${summary} ${handoff}`;
      });
    },
  };
}
