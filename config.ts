export default {
    // The port to run CrackedShell on
    port: 6900,

    // This specifies user-input script hosts that the server is allowed to fetch.
    // This helps prevent your server from being "IP logged" with malicious hosts.
    // If your IP doesn't need to be hidden, add "*" to disable this functionality.
    // The default hosts entries are script CDNs & sources that are commonly used.
    fetchable: [
        'raw.githubusercontent.com',
        'gist.githubusercontent.com',
        'cdnjs.cloudflare.com',
        'cdn.jsdelivr.net',
        'raw.githack.com',
        'unpkg.com',
        'localhost',
        'esm.sh'
    ]
}