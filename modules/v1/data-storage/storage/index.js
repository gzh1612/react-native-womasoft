import Storage from "../../../v2/Storage";

const storage = new Storage();
const set = (key, value) => storage.set(key, value);

const setJson = (key, value) => storage.setJson(key, value);

const get = (key) => storage.get(key);

const getJson = (key) => storage.getJson(key);

const remove = (key) => storage.remove(key);


export default {
    set,
    setJson,
    get,
    getJson,
    remove
}
