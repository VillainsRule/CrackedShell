export default {
    // The port for the server to run on.
    port: 6900,

    cache: {
        // A list of allowed cache links.
        // Prevents server IP logging.
        allowed: [
            'https://raw.githack.com/',
            'https://raw.githubusercontent.com/',
            'https://gist.githubusercontent.com/',
            'https://pastebin.com/raw/',
            'https://cdn.jsdelivr.net/npm/',
            'https://cdnjs.cloudflare.com/ajax/libs/',
        ]
    }
};