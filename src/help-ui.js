import {helpTranslations} from './help-translations.js?v=20261108-help-languages1';

// English leads the menu. The other languages follow their English names.
const languages = [
  ['en', 'English'],
  ['zh-Hans', '简体中文'],
  ['fr', 'Français'],
  ['de', 'Deutsch'],
  ['it', 'Italiano'],
  ['ja', '日本語'],
  ['ko', '한국어'],
  ['pt', 'Português'],
  ['es', 'Español'],
];
const preferenceKey = 'curvelab-hub-help-language';

export function connectHubHelp(dialog, openButton) {
  const title = dialog.querySelector('h2');
  const select = dialog.querySelector('#hub-info-language');
  const closeButton = dialog.querySelector('#hub-info-close');
  const headings = [...dialog.querySelectorAll('h3')];
  const [source, lab] = [...dialog.querySelectorAll('dl')].map(list => [...list.children]);
  const [playback, ...processing] = dialog.querySelectorAll('p');
  const files = [...dialog.querySelectorAll('li')];
  const text = (nodes) => nodes.map(node => node.textContent);
  const english = {
    title: title.textContent,
    language: select.getAttribute('aria-label'),
    close: closeButton.getAttribute('aria-label'),
    headings: text(headings),
    source: text(source),
    lab: text(lab),
    playback: playback.textContent,
    processing: text(processing),
    files: text(files),
  };

  for (const [code, name] of languages) {
    const option = new Option(name, code);
    option.lang = code;
    select.add(option);
  }

  function showLanguage(code) {
    const translation = Object.hasOwn(helpTranslations, code) ? helpTranslations[code] : null;
    const content = translation || english;
    dialog.lang = translation ? code : 'en';
    select.value = dialog.lang;
    select.setAttribute('aria-label', content.language);
    closeButton.setAttribute('aria-label', content.close);
    title.textContent = content.title;
    playback.textContent = content.playback;
    for (const [nodes, values] of [
      [headings, content.headings],
      [source, content.source.flat()],
      [lab, content.lab.flat()],
      [processing, content.processing],
      [files, content.files],
    ]) {
      nodes.forEach((node, index) => { node.textContent = values[index]; });
    }
  }

  let preferred = 'en';
  try { preferred = localStorage.getItem(preferenceKey) || 'en'; } catch { /* Storage can be unavailable. */ }
  showLanguage(preferred);
  select.addEventListener('change', () => {
    showLanguage(select.value);
    try { localStorage.setItem(preferenceKey, dialog.lang); } catch { /* The selection still applies here. */ }
  });
  openButton.addEventListener('click', () => {
    dialog.showModal();
    dialog.scrollTop = 0;
  });
  closeButton.addEventListener('click', () => dialog.close());
}
