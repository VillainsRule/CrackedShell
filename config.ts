export default {
    // The port to run CrackedShell on
    port: 6900,

    // This specifies script sources that the server can fetch, which are input by users.
    // This helps prevent your server from being IP logged with malicious scripts.
    // If your IP is already exposed or don't need to hide it, add "*" to disable caching.
    // The default scripts below are all trusted raw sources that do not log IPs.
    fetchable: [
        'raw.githack.com',
        'raw.githubusercontent.com',
        'gist.githubusercontent.com',
        'cdn.jsdelivr.net',
        'cdnjs.cloudflare.com'
    ]
};