const log = (msg, color = 'white') => document.querySelector('.logs').insertAdjacentHTML('beforeend', `<div style='color: ${color};'>${msg}</div>`);

document.querySelector('#addScript').onclick = () =>
    document.querySelector('.scriptlist').insertAdjacentHTML('beforeend', `
                <input type='text' class='script' placeholder='script URL...'></input>
            `);

document.querySelector('.launch').onclick = async () => {
    log('Started launching! 🚀');
    log('Filtering unused injectors...');

    [...document.querySelectorAll('.script')]
        .forEach(s => (!!s.value) ? false : s.remove());

    log('Filtered! Fetching scripts & caching them on the server...');

    const scripts = [...document.querySelectorAll('.script')].map(s => s.value);

    const sendingData = {
        scripts: []
    };

    let promises = await Promise.all(scripts.map(async (s) => {
        let resp = await fetch('/mod/download/', {
            method: 'POST',
            body: JSON.stringify({
                url: s
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return await resp.json();
    }));

    promises.forEach((p) => {
        log(p.message || p.error, p.success ? '' : 'red');
        if (p.success) sendingData.scripts.push(p.url);
    });

    log('Finished! 🎉 Launching game...', 'blue');

    open('/?_cracked=' + btoa(JSON.stringify(sendingData)), '_blank');
};