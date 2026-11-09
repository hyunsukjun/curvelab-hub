let language = 'en';
let messages = {};
let selection = 0;
const listeners = new Set();

export const tooltipLanguage = {
  get code() { return language; },
  text(key, english) { return messages[key] ?? english; },
  subscribe(listener) { listeners.add(listener); },
  async select(code) {
    const request = ++selection;
    if (code === language) return;

    let next = {};
    try {
      if (code !== 'en') next = (await import(`./tooltip-translations/${code}.js?v=hub-chain-branch1`)).default;
    } catch {
      code = 'en';
    }
    if (request !== selection) return;

    language = code;
    messages = next;
    for (const listener of listeners) listener();
  },
};
