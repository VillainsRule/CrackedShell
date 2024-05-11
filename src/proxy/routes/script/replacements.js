import config from '#config';

export default [
    {
        // matchmaker ws
        find: '||location.host,',
        replace: `||'${config.socketServer}',`
    },
    {
        // services ws
        find: '${location.hostname}',
        replace: config.socketServer
    },
    {
        // services ws
        find: 'dynamicContentRoot+',
        replace: `"${config.socketServer}"+`
    },
    {
        // game ws
        find: 'window.location.hostname',
        replace: `"${config.socketServer}"`
    },
    {
        // https fixer
        find: 'isHttps()',
        replace: 'true',
        all: true
    },
    {
        // ad blocker
        find: /checkAdBlocker\(\)\{(.*?)\}adBlockerDetected\(\)\{(.*?)\}/,
        replace: `checkAdBlocker(){false}adBlockerDetected(){false}`
    },
    {
        // ad blocker
        find: /showAdBlockerVideo\(\)\{(.*?)1e4\)\}/,
        replace: `showAdBlockerVideo(){this.afterVideoAdComplete()}`
    },
    {
        // ad blocker
        find: /!\[".*?"\]\.includes\(([a-zA-Z])\)/,
        replace: `(false)`
    }
];