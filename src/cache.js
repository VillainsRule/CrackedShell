class CacheManager {
    cache = {};
   
    constructor () {};
   
    has = (key) => this.cache.hasOwnProperty(key);
    get = (key) => this.cache[key];
    set = (key, value) => this.cache[key] = value;
};

const cache = new CacheManager();
export default cache;