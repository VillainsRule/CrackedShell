<div align="center">
    <img src="https://files.offshore.cat/Cm5DtDlG.png" width="70%">
    <h3>is officially now on version II.</h3>
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

Here's how to set up your own deployment:<br>
<br>
1. Install [Bun](https://bun.sh) & [git](https://git-scm.com).
2. Clone the repository (`git clone https://github.com/VillainsRule/CrackedShell && cd CrackedShell`).
3. Install dependencies using bun (`bun i`).
4. Configure the server in your local config.ts file.
5. Run the server using bun (`bun .`).
6. Play CrackedShell at `localhost:6900`!

> [!WARNING]
> Node __is not supported__ when using CrackedShell v2.<br>
> Please ensure you use Bun, or you will experience runtime errors.

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

Unsupported GM values:
- GM_getResourceText: this is specific to Tampermonkey meta unused by CrackedShell.
- GM_getResourceURL: this is specific to Tampermonkey meta unused by CrackedShell.
- GM_info: this is specific to Tampermonkey meta unused by CrackedShell.
- GM_registerMenuCommand: the browser cannot do this in a website.
- GM_unregisterMenuCommand: the browser cannot do this in a website.
- GM_getTab: the browser cannot do this in a website.
- GM_saveTab: the browser cannot do this in a website.
- GM_getTabs: the browser cannot do this in a website.
- GM_webRequest: the browser cannot do this in a website.
- window.close: the browser cannot do this in a website.
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
The server cache stores all of the files of Shell Shockers locally after fetch. This cache can be cleared by stopping and starting CrackedShell. We recommend you do this every couple hours anyways, as restarting is generally harmless and doesn't end any WebSocket connections since these don't go through CrackedShell.

### Fetchables
The server protects itself from malicious injected scripts that might point to an IP logger, to help keep the server's IP safe. If you develop a script and test it on an instance, ensure the script's host is whitelisted in config.ts. If you do not own the instance, ask the instance owner. The default souces can be found in [config.ts](./config.ts).

### Disclaimer
This README obviously cannot cover the entire codebase. I highly recommend that anyone wanting to script for CrackedShell should read the codebase. It's incredibly small and easy to process.

<br>
<br>
<h3 align="center">made with ❤️ by VillainsRule</h3>