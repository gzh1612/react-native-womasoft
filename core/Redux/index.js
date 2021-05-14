import {createStore} from 'redux'
import todoApp from './reducers'
import {addData, updateData, removeData} from "./actions"

let store = createStore(todoApp);
let listenName = '';

export default class Redux {
    #name = 'framework_redux_listen_name';      //监听


    /**
     *  Redux [log]
     * @param params
     */
    constructor(params) {
        if (typeof params === "undefined") params = {};
        this.log = typeof params.log === "boolean" ? params.log : false;
    }

    /**
     * 初始化 [name|value]
     * @param params
     */
    init(params) {
        this.add(this.#name, 'redux');
        this.adds(params);
        store.subscribe(() => {
            if (this.log) console.log(store.getState())
        });
    }

    listen(name, func) {
        store.subscribe(() => {
            if (listenName === name) {
                return func(this.get(name));
            }
        });
    }

    add(name, value) {
        store.dispatch(addData(name, value));
    }

    adds(params) {
        if (typeof params === "undefined") params = [];
        if (typeof params === 'object' && params.length > 0) {
            params.map((item) => {
                if (!item.name) return;
                this.add(item.name, item.value);
            });
        }
    }

    update(name, value) {
        listenName = name;
        if (this.log) console.log(name);
        store.dispatch(updateData(name, value));
    }

    remove(name) {
        store.dispatch(removeData(name, undefined));
    }

    get(name) {
        return store.getState().params[name];
    }

}

