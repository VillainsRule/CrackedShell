const originalGet = URLSearchParams.prototype.get;

URLSearchParams.prototype.get = function (key) {
    if (key === 'showAd') {
        if (!localStorage.getItem('skidWarning')) {
            localStorage.setItem('skidWarning', true);
            alert('a userscript just tried to show you an ad, but was blocked. we\'re redirecting you to an alternative.');
            location.href = 'https://github.com/Hydroflame522/StateFarmClient';
        } else alert('a userscript just tried to show you an ad, but was blocked. try a recommended alternative.\n\nhttps://github.com/Hydroflame522/StateFarmClient');

        const validTimestamp = Date.now() - 5 * 60 * 1000;
        return validTimestamp.toString(16);
    }

    return originalGet.call(this, key);
};

window.GM = {}
window.GM.info = {}
window.GM.info.script = {}