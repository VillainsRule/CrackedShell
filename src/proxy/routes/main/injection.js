let unsafeWindow = window;

let GM_openInTab = (link) => window.open(link, '_blank');
let GM_setClipboard = (text, _, callback) => navigator.clipboard.writeText(text).then(() => callback());

let GM_deleteValue = (...a) => localStorage.removeItem(...a);
let GM_listValues = () => localStorage;

let GM_setValue = (name, value) => {
    if (typeof value === 'object') localStorage.setItem(name, JSON.stringify(value));
    else localStorage.setItem(name, value);
};

let GM_getValue = (name) => {
    try {
        return JSON.parse(localStorage.getItem(name));
    } catch {
        localStorage.getItem(name);
    };
};

let isCrackedShell = true;