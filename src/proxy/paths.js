export default [
    {
        match: /(.*?)\/js\/shellshock.js/,
        handler: 'script/route'
    },
    {
        match: /^(?!.*Linear_Gradient_Texture)(.*?)\.(png|jpg|jpeg|svg|webm|ico|gif|lightmap)$/,
        handler: 'buffer'
    },
    {
        match: /(.*?)\.(js|json|css|babylon\.manifest|babylon)(.*?)/,
        handler: 'raw'
    },
    {
        match: /^\/(?!.*\/).*$/,
        handler: 'main/route'
    }
];