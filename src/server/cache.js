// using classes due to simplicity
class CacheManager {
    cache = {};

    // classes must have constructors
    constructor () {};

    // methods
    has = (key) => this.cache.hasOwnProperty(key);
    get = (key) => this.cache[key];
    set = (key, value) => this.cache[key] = value;
};

// create & export a new instance of CacheManager
const cache = new CacheManager();
export default cache;