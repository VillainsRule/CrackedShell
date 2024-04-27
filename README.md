<div align="center">
    <h1>CrackedShell</h1>
    <h3>a cracked copy of shell shockers, with injection.</h3>
    <h5>if you find a bug, <a href="https://github.com/VillainsRule/CrackedShell/issues">open an issue</a> and i'll do my best.</h5>
</div>

<br>
<h2 align="center">What is this??</h2>

CrackedShell is a modified copy of Shell Shockers that allows you to inject scripts & styles into the game.<br>
This works with a combination of a server-side "proxy" & URL params.

<br>
<h2 align="center">How can I use this?</h2>

You can try the demo at [shell.onlypuppy7.online](https://shell.onlypuppy7.online).<br>
Here's how to set up your own copy:<br>
<br>
1. Install Node.JS, NPM, & git.
2. Clone the repository from git: `git clone https://github.com/VillainsRule/CrackedShell && cd CrackedShell`
3. If it is not already on your machine, add PNPM: `npm i -g pnpm`
4. Install dependencies: `pnpm i`
5. Configure the game in `config.js` (see the Configuration section for more information)
6. Run the server: `pnpm dev`
7. Visit the game at `localhost:6900`!

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

### server
This allows you to customize the Shell Shockers server host.

#### url
This specifies the URL of the server. You're best off using an official Shell Shockers instance such as `shellshock.io`.<br>
If hosting locally, use `localhost:port`.

#### secure
This specifies whether or not the server is secure (`wss://` or `ws://`).<br>
For official servers, set this to `true`. For locally hosted servers, set it to `false`.

#### custom
This is a boolean that helps you make connect custom servers.<br>
Keep this as `false` unless instructed to by the server provider.


<br>
<h2 align="center">Replacements</h2>

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
['||location.host,', '||\'risenegg.com\','], // replace /matchmaker/ socket
['${location.hostname}', 'risenegg.com'], // replace /services/ socket
['dynamicContentRoot+', `"risenegg.com"+`], // replace /services/ socket
['window.location.hostname', '"risenegg.com"'], // replace /game/ socket
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
