import {createStore} from 'redux'
import todoApp from './reducers'
import {addData, updateData, removeData} from "./actions"

let store = createStore(todoApp);
let defaultLog = false;
let lastName = '';

store.subscribe(() => {
    if (defaultLog) console.log(store.getState())
});

const init = (isLog) => {
    // defaultLog = isLog;
};

const log = (isLog) => {
    if (typeof isLog === 'boolean') defaultLog = isLog;
};

//监听
const listen = (name, func) => {
    store.subscribe(() => {
        if (get(name) && lastName === name) {
            return func(get(name));
        }
    });
};

const add = (name, value) => {
    store.dispatch(addData(name, value));
};

const update = (name, value) => {
    lastName = name;
    if (defaultLog) console.log(name);
    store.dispatch(updateData(name, value));
};

const remove = (name) => {
    store.dispatch(removeData(name, undefined));
};

const get = (name) => {
    return store.getState().params[name];
};


export default {
    init,
    log,
    add,
    update,
    remove,
    get,
    listen,
}
