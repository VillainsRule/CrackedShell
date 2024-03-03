<div align="center">
    <h1>CrackedShell</h1>
    <h3>a cracked copy of shell shockers, used for mod injection.</h3>
    <h5>if you find a bug, <a href="https://github.com/VillainsRule/CrackedShell/issues">open an issue</a> and i'll do my best.</h5>
</div>

<br>
<h2 align="center">WTF is this??</h2>

CrackedShell is a modified copy of Shell Shockers that allows you to inject mods into the game.<br>
This works with a combination of a server-side "proxy" & URL params.

<br>
<h2 align="center">How can I use this?</h2>

We do not offer any pre-deployed version at this time.<br>
Here's how to set up your own copy:<br>
<br>
1. Install Node.JS, NPM, & git.
2. Clone the repository from git: `git clone https://github.com/VillainsRule/CrackedShell && cd CrackedShell`
3. Install dependencies: `npm i`
4. Configure the game in `config.js`
5. Run the server: `npm run start`
6. Visit the game at `localhost:6900`!
<br>

**If you want a public instance, try this:**
1. Install [ngrok](https://ngrok.com/download).
2. Run `ngrok http {{port here}}` (example: `ngrok http 6900`) in **another terminal**.
3. Ngrok should input a URL you can visit on any device.

**WARNING: THIS URL CONTAINS YOUR IP ADDRESS.** Be careful who you give this to.

<br>
<h2 align="center">Developer Information</h2>

Hey, fellow Developers! Here's a bit of information on turning your Tampermonkey script into a CrackedShell script!

### Supported GM values
CrackedShell supports a few GM values & defines them no matter what:

- GM_getValue (using localStorage.getItem)
- GM_setValue (using localStorage.setItem)
- GM_deleteValue (using localStorage.removeItem)
- GM_listValues (using localStorage)
- GM_setClipboard (using navigator.clipboard.writeText)

If you need a GM value that isn't defined here, add a workaround or open a [pull request](https://github.com/VillainsRule/CrackedShell/pulls)!<br>
These values are not exposed to the `window`, so don't worry about being detected!

### Manual CSS injection
I have literally NO clue why, but the CSS does not work when the native `<link>` item is added - so it's manually injected with this code:
```js
['transitions', 'forms', 'style', 'game'].forEach(async (stylesheet) => {
    let st = await fetch(`/styles/${stylesheet}.css`);
    st = await st.text();
    document.head.appendChild(document.createElement('style')).innerHTML = st;
});
```

### shellshock.js Server Modification
In order to fix WebSocket issues, `shellshock.js` is modified on the server. Here's the list of patches:
```js
['||location.host,', '||\'math.international\','], // replace /matchmaker/ socket
['${location.hostname}', 'math.international'], // replace /services/ socket
['dynamicContentRoot+', `"math.international"+`], // replace /services/ socket
['window.location.hostname', '"math.international"'], // replace /game/ socket
['isHttps()', 'true'] // fix socket http issues
```

**This would prioritize anything done with injected scripts.**<br>
Modifying ANY of these patches or rewriting them will break CrackedShell, so please find a workaround :)

### CrackedShell Detection
Speaking of workarounds, there is a variable named `isCrackedShell`.<br>
This is also only defined in the scope of your script, so detection is impossible!

### Injection Time
ALL scripts are injected in the equivalent of Tampermonkey's `document-start`.<br>
In order to make this work, we use...

### Caching
The cache is a way we store large masses of code.<br>
Storing them locally and removing the fetching requirement speeds up script injection.<br>
In order to prevent the server IP from being logged, we only allow the following script sources:

- https://raw.githack.com
- https://raw.githubusercontent.com
- https://gist.githubusercontent.com
- https://pastebin.com/raw
- https://cdn.jsdelivr.net/npm
- https://cdnjs.cloudflare.com/ajax/libs

You can add or remove these in the config.

### More Information
Not all information is contained in these docs.<br>
If you want to learn more, read the codebase - it's a small number of files with simplistic & modern code.
<br>
<br>
<h3 align="center">made with ❤️ by VillainsRule</h3>