<div align="center">
    <h1>CrackedShell</h1>
    <h3>a cracked copy of shell shockers, with injection.</h3>
    <h5>if you find a bug, <a href="https://github.com/VillainsRule/CrackedShell/issues">open an issue</a> and i'll do my best.</h5>
</div>

<br>
<h2 align="center">What is this??</h2>
<p align="center">CrackedShell is a Shell Shockers "proxy" that allows users to add plugins & themes to the game from the client.</p>

<br>
<h2 align="center">How can I use this?</h2>

You can try a public deployment @ [shell.onlypuppy7.online](https://shell.onlypuppy7.online).<br>
Here's how to set up your own copy:<br>
<br>
1. Install Node.JS, NPM, & git.
2. Clone the repository from git: `git clone https://github.com/VillainsRule/CrackedShell && cd CrackedShell`
3. Install dependencies: `npm i`
4. Configure the game in `config.js` (see the Configuration section for more information)
5. Run the server: `npm start`
6. Visit the game at `localhost:6900`!

<br>
<h2 align="center">Configuration</h2>

Local CrackedShell instances can be configued in `config.js`. Here's what's going on in there:

### port
This tells the server what port to run on.<br>
If you're a developer and are using port `6900` for something else, change this. If not, ignore it.

### cacheable
This specifies allowed script origins in the cache.<br>
This prevents your server/computer from being IP logged from malicious scripts put in the `/mod` page.<br>
If you don't care about your privacy, you can add the `*` script to disable this entirely.<br>

**Note: the default scripts are ALL trusted raw script sources that will not attack your computer.**

### fileHost
The file host is the server to fetch the game files from.

### authorization
This is the authorization key used for accessing the file host. For example, to access the staging server, use a string such as `Buffer.from('STAGING_USERNAME:STAGING_PASSWORD').toString('base64')`. To access the normal game, used `undefined` or `null`.

#### socketServer
The socket server the client connects to. WARNING: This can be modified by the client, so it's just the default if the client doesn't use any plugins to override it.

<br>
<h2 align="center">How??</h2>

So, you might be wondering how we got this together. the answer is a lot of pain, struggling, and debugging. No, literally. This was my first ever project making a proxy to access a site, and it's been very hard. At first, I figured this would work by just proxying everything in the server. No big deal, one file, just add a few bits and parts here and there and the panel to inject the code. No problem! The issue I quickly ran into was the lack of good Node.JS customizable proxy libraries. As a result, I just built a hacky one myself. It uses regexes to determine what kind of file it is and subsequently what "handler" the file should go through. That part is simple enough. I then tried to figure out how to proxy WebSockets, but realized a problem: if the CrackedShell host gets IP banned, nobody can use CrackedShell. As a result, I built a special "handler" for shellshock.js that forced WebSockets to be rerouted to a customizable node of the official game. That way, IP bans were handled on the client and the game would basically be unable to find the CrackedShell host. I then had to actually implement plugins & themes. I built a small page and did some server-side checking to make sure that the main page would redirect to the mod builder if the correct mods weren't found. Plugins & themes are passed to the client with a URL paramemer, cs, which is then read by the server. The server will append a style & script tag at the top with the plugins & themes. After that, I was basically done. I added a caching system for scripts, and later added more features & configuration on request. Enjoy :P

<br>
<h2 align="center">File Replacements</h2>

If you are the host of a CrackedShell instance, you can force files to be replaced.<br>
Here's how:

1. Make a folder named `replacements/` in the root CrackedShell folder.
2. Encode the file name in [Base64](https://www.base64encode.org) and then put it in `replacements/`. Do NOT add extensions.
3. Add the contents to replace into the file!

The server will replace the file when sending server data!

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

### shellshock.js Server Modification
In order to fix WebSocket issues, `shellshock.js` is modified on the server. Here's the list of patches:
```js
['||location.host,', '||\'{{config.socketServer}}\','], // replace /matchmaker/ socket
['${location.hostname}', '{{config.socketServer}}'], // replace /services/ socket
['dynamicContentRoot+', `"{{config.socketServer}}"+`], // replace /services/ socket
['window.location.hostname', '"{{config.socketServer}}"'], // replace /game/ socket
['isHttps()', 'true'] // fix socket http issues
```

**This would prioritize anything done with injected scripts.**<br>
If you want an original copy of the Shell Shockers JS script before it's modified, you can fetch `/js/shellshock.og.js`.<br>
Do NOT use this to replace script injection. It will cause WebSocket errors - the modified code is shown above.

### isCrackedShell
You can detect CrackedShell clients with a `isCrackedShell` boolean on the scope of your script.<br>
Like the GM modifications, this is undetectable.

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
<h3 align="center">made with ❤️ by 1ust</h3>