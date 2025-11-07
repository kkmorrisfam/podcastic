import NodeCache from 'node-cache';


type JSONValue = unknown;

// create one cache that is shared
const myCache = new NodeCache({
    stdTTL: Number(20), //how long the data lives
    checkperiod: 30  //how often expired data is cleaned up
});

//getter from cache
export async function cacheGetJSON<T>(key: string): Promise<T | null> {
    const v = myCache.get<JSONValue>(key);
    return (v ?? null) as T | null;
}

//setter to cache
export async function cacheSetJSON(key: string, value: JSONValue, ttlSec = Number(20)) {
    myCache.set(key, value, ttlSec);
}

//helper function to create consistent cache keys
//'pi' is short for podcast index, but can be anything.
export function makeKey(...parts: string[]) {
    return ['pi', ...parts].join(':');
}