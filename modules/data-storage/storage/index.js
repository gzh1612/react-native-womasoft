import AsyncStorage from '@react-native-community/async-storage';

const set = (key, value) => {
    AsyncStorage.setItem(key, value);
};

const setJson = (key, value, isLog) => {
    const v = JSON.stringify(value);
    if (isLog) console.log(v);
    AsyncStorage.setItem(key, v)
};

const get = (key) => {
    return AsyncStorage.getItem(key);
};

const getJson = (key) => {
    return AsyncStorage.getItem(key).then(res => {
        return JSON.parse(res)
    });
};

const remove = (key) => {
    AsyncStorage.removeItem(key);
};


export default {
    set,
    setJson,
    get,
    getJson,
    remove
}
