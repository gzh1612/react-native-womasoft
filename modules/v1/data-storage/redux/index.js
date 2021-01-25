import Redux from "../../../v2/Redux";

const redux = new Redux();
redux.init();

const init = () => {
    redux.init();
};

//监听
const listen = (name, func) => redux.listen(name, func);

const add = (name, value) => redux.add(name, value);

const update = (name, value) => redux.update(name, value);

const remove = (name) => redux.remove(name);

const get = (name) => redux.get(name);

const log = () => console.log();
export default {
    init,
    log,
    add,
    update,
    remove,
    get,
    listen,
}
