var term = new Terminal({
    cursorBlink: true,
    cursorStyle: 'underline',
    cursorInactiveStyle: 'none',
    allowProposedApi: true,
    rows: 40
});

term.open(document.querySelector('.console'));
term.prompt = () => term.write('\r\n$ ');

term.writeln([
    '     CrackedShell - a Shell Shockers script injector that \x1b[1mworks everywhere\x1b[0m.',
    '',
    ' ┌ \x1b[1mCommands\x1b[0m ───────────────────────────────────────────────────────────────┐',
    ' │                                                                         │',
    ' │  \x1b[31;1mlaunch\x1b[0m                                                                 │',
    ' │    \x1b[31;1mlaunch CrackedShell with your config.\x1b[0m                                │',
    ' │                                                                         │',
    ' │  \x1b[33;1minstance get\x1b[0m                                                           │',
    ' │    \x1b[33;1mcheck your shell shockers instance.\x1b[0m                                  │',
    ' │                                                                         │',
    ' │  \x1b[33;1minstance set [url]\x1b[0m                                                     │',
    ' │    \x1b[33;1mchange your shell shockers instance.\x1b[0m                                 │',
    ' │                                                                         │',
    ' │  \x1b[32;1minject [url]\x1b[0m                                                           │',
    ' │    \x1b[32;1madd JS/CSS to the game. autodetected by extension.\x1b[0m                   │',
    ' │                                                                         │',
    ' │  \x1b[32;1muninject [url]\x1b[0m                                                         │',
    ' │    \x1b[32;1mremove an injected JS/CSS file.\x1b[0m                                      │',
    ' │                                                                         │',
    ' │  \x1b[32;1mscripts\x1b[0m                                                                │',
    ' │    \x1b[32;1mget a list of active scripts.\x1b[0m                                        │',
    ' │                                                                         │',
    ' │  \x1b[34;1minfo\x1b[0m                                                                   │',
    ' │    \x1b[34;1mshows the various links to source, issues, & support.\x1b[0m                │',
    ' │                                                                         │',
    ' └─────────────────────────────────────────────────────────────────────────┘',
    ''
].join('\n\r'));

let command = '';
let process = false;

let $INSTANCE = null;

endTask();

term.onData((e) => {
    switch (e) {
        case '\r': // enter
            if (process) break;

            const firstPart = command.trim().split(' ')[0];

            if (firstPart.length > 0) {
                term.writeln('');

                if (firstPart in commands) commands[firstPart](command.split(' ').slice(1));
                else {
                    term.writeln(`${firstPart}: command not found`);
                    endTask();
                }
            };

            command = '';
            break;

        case '\u007F': // backspace
            if (term._core.buffer.x > 2) {
                term.write('\b \b');
                if (command.length > 0) command = command.substr(0, command.length - 1);
            }
            break;

        default:
            if ($INSTANCE) {
                $INSTANCE.close();
                $INSTANCE = null;
                return process = false;
            };

            if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0') {
                command += e;
                term.write(e);
            }
    }
});

function endTask() {
    process = false;
    command = '';
    term.write('\r\n$ ');
}

let commands = {
    info: () => {
        process = true;

        term.writeln([
            '',
            '    CrackedShell is made possible by the work of one person.',
            '    If you like the project, please consider power poles.',
            '      Source: \x1b[34;1mhttps://github.com/VillainsRule/CrackedShell\x1b[0m',
            '      Discord: \x1b[34;1mhttps://dsc.gg/sfnetwork\x1b[0m',
            '      Bug Report: \x1b[34;1mhttps://github.com/VillainsRule/CrackedShell/issues/new\x1b[0m',
            ''
        ].join('\n\r'));

        endTask();
    },
    launch: () => {
        process = true;

        term.writeln('  compiling launch...');

        const payload = JSON.stringify({
            js: localStorage.getItem('js') || '[]',
            css: localStorage.getItem('css') || '[]',
            instance: localStorage.getItem('instance') || 'risenegg.com'
        });

        term.writeln('  launching game...');

        window.$INSTANCE = window.open(`/?payload=${payload}`, '_blank');

        window.$INSTANCE.onload = () => {
            term.writeln('  game loaded. press any key to quit...');

            window.$INSTANCE.onbeforeunload = (e) => {
                e.preventDefault();
                window.$INSTANCE && window.$INSTANCE.close();
                window.$INSTANCE = null;
                process = false;
                return true;
            }
        }
    },
    instance: async (args) => {
        if (args[0] === 'get') {
            term.writeln('  current instance: ' + localStorage.getItem('instance') || 'shellshock.io');
            endTask();
        };

        if (args[0] === 'set') {
            if (!args[1]) return term.writeln('  x1b[31;1mmissing instance URL.x1b[0m usage: instance set [url]');

            if (args[2] !== '--local') {
                let r = await fetch('https://uncors.vercel.app/?url=https://' + args[0]);
                r = await r.text();

                if (r === 'Request couldn\'t be processed') {
                    term.writeln('  x1b[31;1mthat was identified as something other than a valid instance.x1b[0m');
                    term.writeln('  you can use instance set [url] --local to bypass this check.');
                    return endTask();
                };

                if (!r.includes('const useLogo = HouseAds.shellLogo.filter(logo => logo.active);')) {
                    term.writeln('  x1b[31;1mthat was identified as something other than a valid instance.x1b[0m');
                    term.writeln('  you can use instance set [url] --local to bypass this check.');
                    return endTask();
                };
            } else {
                term.writeln('  \x1b[33;1mwarning: using the --local flag is dangerous.\x1b[0m');
                term.writeln('  \x1b[33;1mif you don\'t know what you\'re doing, remove it.\x1b[0m');
            };

            localStorage.setItem('instance', args[1]);

            term.writeln('  \x1b[32;1minstance updated successfully!\x1b[0m');
            term.writeln('  \x1b[33;1mremember not to use instances you don\'t trust.\x1b[0m');
        }
    },
    inject: (args) => {
        if (!args[0]) return term.writeln('  \x1b[31;1mmissing URL.\x1b[0m usage: inject [url]');

        const url = args[0];
        const type = url.split('.').pop();

        if (type === 'js') {
            let js = JSON.parse(localStorage.getItem('js') || '[]');
            js.push(url);
            localStorage.setItem('js', JSON.stringify(js));
        } else if (type === 'css') {
            let css = JSON.parse(localStorage.getItem('css') || '[]');
            css.push(url);
            localStorage.setItem('css', JSON.stringify(css));
        } else {
            term.writeln('  \x1b[31;1munknown file type.\x1b[0m');
            return endTask();
        };

        term.writeln('  \x1b[32;1minjection successful!\x1b[0m');
        term.writeln('  \x1b[33;1mreload the game to see changes.\x1b[0m');

        endTask();
    },
    uninject: (args) => {
        if (!args[0]) return term.writeln('  \x1b[31;1mmissing URL.\x1b[0m usage: uninject [url]');

        const url = args[0];
        if (url === 'all') {
            localStorage.setItem('js', JSON.stringify([]));
            localStorage.setItem('css', JSON.stringify([]));

            term.writeln('  \x1b[32;1mremoved all scripts!\x1b[0m');
            term.writeln('  \x1b[33;1mreload the game to get back to the norm.\x1b[0m');
    
            return endTask();
        }

        const type = url.split('.').pop();
        if (type === 'js') {
            let js = JSON.parse(localStorage.getItem('js') || '[]');
            js = js.filter(item => item !== url);
            localStorage.setItem('js', JSON.stringify(js));
        } else if (type === 'css') {
            let css = JSON.parse(localStorage.getItem('css') || '[]');
            css = css.filter(item => item !== url);
            localStorage.setItem('css', JSON.stringify(css));
        } else {
            term.writeln('  \x1b[31;1munknown file type.\x1b[0m');
            return endTask();
        };

        term.writeln('  \x1b[32;1muninjection successful!\x1b[0m');
        term.writeln('  \x1b[33;1mreload the game to see changes.\x1b[0m');

        endTask();
    },
    scripts: () => {
        process = true;

        let js = JSON.parse(localStorage.getItem('js') || '[]');
        let css = JSON.parse(localStorage.getItem('css') || '[]');

        if (js.length === 0 && css.length === 0) {
            term.writeln('  \x1b[31;1mno scripts found.\x1b[0m');
        } else {
            term.writeln('  \x1b[32;1mactive scripts:\x1b[0m');
            js.forEach(script => term.writeln(`  \x1b[33;1mJS:\x1b[0m ${script}`));
            css.forEach(script => term.writeln(`  \x1b[33;1mCSS:\x1b[0m ${script}`));
        }

        endTask();
    }
}