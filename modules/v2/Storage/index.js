import AsyncStorage from '@react-native-community/async-storage';
import Redux from '../Redux';

export default class Storage {
    constructor() {
    }

    static type = {
        get: 'get',
        getJson: 'getJson',
    }

    /**
     * 初始化持久存储  {name|type|value}
     * @param params
     */
    init(params) {
        if (typeof params === "undefined") params = [];
        if (typeof params === 'object' && params.length > 0) {
            params.map((item) => {
                if (!item.name) return;
                if (!item.type) return;
                const redux = new Redux();
                redux.add(item.name, item.value);
                this[item.type](item.name).then(res => {
                    if (!res) return;
                    new Redux().update(item.name, res);
                })
            });
        }
    }

    set(key, value) {
        AsyncStorage.setItem(key, value);
    }

    setJson(key, value) {
        const res = JSON.stringify(value);
        AsyncStorage.setItem(key, res)
    }

    get(key) {
        return AsyncStorage.getItem(key);
    }

    getJson(key) {
        return AsyncStorage.getItem(key).then(res => {
            return JSON.parse(res)
        });
    }

    remove(key) {
        AsyncStorage.removeItem(key);
    }
}
