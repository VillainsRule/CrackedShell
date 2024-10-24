import Bun from 'bun';
import nodePath from 'node:path';

import { redirect } from '../util/respond';

export default ({ path }) => {
    const files = {
        '/$': 'index.html',
        '/$/style.css': 'style.css',
        '/$/script.js': 'script.js'
    }

    if (files[path]) return new Response(Bun.file(nodePath.join(import.meta.dirname, 'files', files[path])));
    else return redirect('/$');
}