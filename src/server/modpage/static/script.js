HTMLElement.prototype.append = function (s) {
    this.insertAdjacentHTML('beforeend', s);
};

HTMLElement.prototype.after = function (s) {
    this.insertAdjacentHTML('afterend', s);
};

let find = (s) => document.querySelector(s);
let rowChild = (el) => [...el.children][el.children.length - 1].children[0];

let create = (type) => {
    let removeID = crypto.randomUUID();

    let result = document.querySelector('div[template=\'linkrow\']').innerHTML;
    result = result.replace('{{type}}', type).replace('{{id}}', removeID);
    find(`.${type}s`).append(result);

    document.getElementById(removeID).onclick = (ev) => {
        let lastElement = rowChild(find(`.${type}s`));
        if (lastElement.parentElement.children[1].id === removeID) ev.target.parentElement.children[0].value = '';
        else ev.target.parentElement.remove();
    };
};

let allowedScripts = [];

let register = () => [...document.querySelectorAll('input')].forEach((s) => s.oninput = (e) => {    
    if (!!rowChild(document.querySelector('.scripts')).value) create('script');
    if (!!rowChild(document.querySelector('.styles')).value) create('style');

    if (!e.target.id) e.target.id = 'input-' + crypto.randomUUID();
    document.querySelector('#error' + e.target.id.replace('input', ''))?.remove();

    let requirements = [
        [(val) => {
            try {
                new URL(val);
                return true;
            } catch {
                return false;
            }
        }, 'Invalid URL.'],
        [(val) => val.endsWith([...e.target.parentElement.parentElement.classList].includes('scripts') ? '.js' : '.css'),
            `Files must end in "${[...e.target.parentElement.parentElement.classList].includes('scripts') ? '.js' : '.css'}".`],
        [(val) => allowedScripts.includes('*') || allowedScripts.some(s => val.startsWith(s)),
            `This script is not allowed. <a href='https://github.com/villainsrule/crackedshell?tab=readme-ov-file#caching'>Learn More</a>`]
    ];

    for (const [ func, error ] of requirements) {
        if (!func(e.target.value)) {
            e.target.parentElement.after(`<div class="error" id="error${e.target.id.replace('input', '')}"><i class="fas fa-circle-exclamation"></i><div>${error}</div></div>`);
            break;
        };
    };

    s.oninput = null;
    register();
});

create('script');
create('style');
register();

document.querySelector('.launch').onclick = async () => {
    const crackedData = [];

    let promises = await Promise.all([...document.querySelectorAll('.linkinput')].filter(s => s.value).map(async (scriptElement) => {
        let resp = await fetch('/mod/download', {
            method: 'POST',
            body: JSON.stringify({
                url: scriptElement.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return await resp.json();
    }));

    promises.forEach((p) => (p.success) ? crackedData.push(p.url) : null);

    open('/?cs=' + btoa(JSON.stringify(crackedData)), '_blank');
};

(async () => {
    let resp = await fetch('/mod/data');
    resp = await resp.json();

    allowedScripts = resp.canCache;
    console.log(allowedScripts);
})();