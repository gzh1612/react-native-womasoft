import redux from '../../data-storage/redux';

let defaultName = 'AppUnmount';

//页面卸载
const load = (name) => {
    let unmount = redux.get(defaultName);
    if (!unmount) {
        unmount = {};
        redux.add(defaultName, unmount);
    }
    unmount[name] = true;
    redux.update(defaultName, unmount);
};

const remove = (name) => {
    let unmount = redux.get(defaultName);
    unmount[name] = false;
    redux.update(defaultName, unmount);
};

const confirm = (name) => {
    let unmount = redux.get(defaultName);
    return unmount[name];
};

export default {
    load,
    remove,
    confirm,
}
