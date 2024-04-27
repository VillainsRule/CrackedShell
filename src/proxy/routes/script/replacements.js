import config from '#config';

export default [
    {
        // matchmaker ws
        find: '||location.host,',
        replace: `||'${config.server.url}',`
    },
    {
        // services ws
        find: '${location.hostname}',
        replace: config.server.url
    },
    {
        // services ws
        find: 'dynamicContentRoot+',
        replace: `"${config.server.url}"+`
    },
    {
        // game ws
        find: 'window.location.hostname',
        replace: `"${config.server.url}"`
    },
    {
        // https fixer
        find: 'isHttps()',
        replace: !!config.server.secure ? 'true' : 'false',
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