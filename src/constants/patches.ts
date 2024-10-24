const patches = {
    '/js/shellshock.js': [{
        // Replace Matchmaker Websocket
        find: '||location.host,',
        replace: `||$WEBSOCKET,`
    }, {
        // Replace Services Websocket
        find: '${location.hostname}',
        replace: '${$WEBSOCKET}'
    }, {
        // Replace Services Websocket
        find: '+dynamicContentRoot+',
        replace: `+$WEBSOCKET+`
    }, {
        // Replace Game Websocket
        find: '||window.location.hostname',
        replace: `||$WEBSOCKET`
    }, {
        // Spoof HTTPS for testing on localhost
        find: 'isHttps()',
        replace: 'true',
        global: true
    }, {
        // Ad Blocker
        find: /checkAdBlocker\(\)\{(.*?)\}adBlockerDetected\(\)\{(.*?)\}/,
        replace: `checkAdBlocker(){false}adBlockerDetected(){false}`
    }, {
        // Ad Blocker
        find: /showAdBlockerVideo\(\)\{(.*?)1e4\)\}/,
        replace: `showAdBlockerVideo(){this.afterVideoAdComplete()}`
    }, {
        // Ad Blocker
        find: /!\[".*?"\]\.includes\(([a-zA-Z])\)/,
        replace: `(false)`
    }]
};

export default patches;