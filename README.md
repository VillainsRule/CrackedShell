<div align="center">
    <img src="https://i.imgur.com/easCvaS.png" width="70%">
    <h3>has hit the stars with version II.</h3>
</div><br>

## About
CrackedShell allows you to self-host Shell Shockers with tons of setting - all while playing on official servers!

Features:
- Script Injection
- Theme Injection
- Client + Server Customization
- Fully Open Source!

You can try a demo @ [shell.onlypuppy7.online](https://shell.onlypuppy7.online).<br>

## Setting Up CrackedShell
Here's how to set up your own deployment:

1. Install [Bun](https://bun.sh) & [git](https://git-scm.com).
2. Clone the repository (`git clone https://github.com/VillainsRule/CrackedShell && cd CrackedShell`).
3. Configure the server in your local config.ts file.
4. Run the server using bun (`bun .`).
5. Play CrackedShell at `localhost:6900`!

### Why Bun?
In short, Node is slow. There are a lot of people who would argue for hours over how optimized Bun is. In the end, Bun provides many out-of-the-box utilities used in CrackedShell. Using standard Node.JS, I would have to have used several dependencies in order to accomplish the things Bun can do. Bun natively supports a stable http server with `Bun.serve`, meaning that I don't have to struggle with Fastify or Express. Additionally, Bun's server allows for static routes, which would likely be another dependency using Node. It also supports native mime type lookup for any extension, which saves yet another dependency.

Personally, I find Bun much more flexible and clean. Perhaps you will too.

> [!NOTE]
> You don't need to run `bun i` or install any dependencies, as Bun provides everything out of the box.<br>
> If you are developing, it might be useful to run this in order to get type annotation in your editor.

## Developer Documentation
CrackedShell works in a somewhat similar way to Tampermonkey in terms of scripting, and supports many of the GM values and offers alternatives for other ones.

### GM.* replacements
- GM.addElement: use insertAdjacentHTML or normal selectors.
- GM.addStyle: use a style tag.
- GM.download: there are lots of tutorials online (check StackOverflow).
- GM.log: use console.log, stop being lazy.
- GM.notification: use the [notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notification).
- GM.openInTab: use the [window opening API](https://developer.mozilla.org/en-US/docs/Web/API/Window/open).
- GM.setClipboard: use the [clipboard API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard).
- GM.setValue: use the [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- GM.getValue: use the [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- GM.deleteValue: use the [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- GM.listValues: use the [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- GM.setValues: use the [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- GM.getValues: use the [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- GM.deleteValues: use the [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- GM_addValueChangeListener: use the above localStorage API & [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval) at a low value.
- GM_removeValueChangeListener: use [clearInterval](https://developer.mozilla.org/en-US/docs/Web/API/Window/clearInterval) on the previously set interval.
- GM_xmlhttpRequest: use the [XMLHttpRequest API](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest).
- GM_cookie: use the [cookie API](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie).
- window.onurlchange: use the [popstate event](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event).

### window.close
This value can be achieved (likely normally) using the native close() function, due to how CrackedShell opens the tab. You might want to wrap this in a catch block and use the `$INSTANCE` variable to instead close the page. Here's an example:

```js
function closePage() {
    try {
        window.close();
    } catch {
        window.$INSTANCE.close();
    }
}
```

The `$INSTANCE` variable is a reference to the parent CrackedShell launcher. Note that if the launcher is closed, this will error.

### Unsupported GM values:
- GM_getResourceText: this is specific to Tampermonkey meta unused by CrackedShell.
- GM_getResourceURL: this is specific to Tampermonkey meta unused by CrackedShell.
- GM_info: this is specific to Tampermonkey meta unused by CrackedShell.
- GM_registerMenuCommand: the browser cannot do this in a website.
- GM_unregisterMenuCommand: the browser cannot do this in a website.
- GM_getTab: the browser cannot do this in a website.
- GM_saveTab: the browser cannot do this in a website.
- GM_getTabs: the browser cannot do this in a website.
- GM_webRequest: the browser cannot do this in a website.
- window.focus: window.focus() might work, or fail due to browser privacy settings.

Since v2, GM.* APIs are no longer built in. Define them yourself.

### shellshock.js Server Modification

> [!NOTE]
> Patch finds & replacements are in [patches.ts](./src/game/patches.ts).

To fix WebSocket issues, WebSockets are replaced with a $WEBSOCKET variable.<br>
A built-in adblocker is also added. This cannot be disabled. If this conflicts, make it not.

These patches obviously modify the original shellshock.js as fetched by the game. If you want an original copy of the Shell Shockers JS script pre-patches, you can fetch `/js/shellshock.og.js`.

### Detecting CrackedShell
You can detect CrackedShell clients versus a normal client by checking the existence of a global `$WEBSOCKET` variable. Renaming, reusing, or otherwise deleting this variable will result in WebSocket opening breaking.

### Caching
The server cache stores all of the files of Shell Shockers locally after fetch. This cache can be cleared by stopping and starting CrackedShell. I recommend you have a program do this every couple hours anyways, as restarting is harmless and doesn't end any WebSocket connections since these don't go through CrackedShell.

### Fetchables
The server protects itself from malicious injected scripts that might point to an IP logger, to help keep the server's IP safe. If you develop a script and test it on an instance, ensure the script's host is whitelisted in config.ts. If you do not own the instance, ask the instance owner. The default souces can be found in [config.ts](./config.ts). Fetchables do not in any way guarantee that there is no malware in any scripts/dependencies. The  purpose of this whitelist is to protect the server, not the users.

### Dependencies
You can import things using the Tampermonkey `@require` system. This works the same in terms of cross-compatibility. All dependencies must be part of the "Fetchables" list, so it is recommended to import your libraries using one of the default allowed CDNs or a raw Github link.

<br>
<br>
<h3 align="center">made with ❤️ by VillainsRule</h3>