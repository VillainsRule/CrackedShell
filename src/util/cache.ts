const cacheMap = new Map<string, string>();

const cache = {
    has: (key: string) => cacheMap.has(key),
    get: (key: string) => cacheMap.get(key),
    set: (key: string, value: string) => cacheMap.set(key, value)
};

export default cache;