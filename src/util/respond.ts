export const redirect = (url: string) => {
    return new Response(null, {
        status: 302,
        headers: {
            'Location': url
        }
    });
};

export const send = (content: BodyInit | Buffer, mime: string) => {
    let responseContent: BodyInit;

    // @ts-expect-error For some reason, it doesn't realize .buffer is a real prop (Bun defines it).
    if (Buffer.isBuffer(content)) responseContent = content.buffer;
    else responseContent = content;

    return new Response(responseContent, {
        headers: {
            'Content-Type': mime
        }
    });
}