import Redux from "../Redux";

export default class Unmount {
    #name = 'framework_unmount_name';

    #get = () => new Redux().get(this.#name);

    constructor(name) {
        if (!name) return console.warn('unmount name 为空');
        this.pageName = name;
    }

    start(name) {
        const redux = new Redux();
        let unmount = this.#get();
        if (!unmount) {
            unmount = {};
            redux.add(this.#name, unmount);
        }
        if (name) this.pageName = name;
        unmount[this.pageName] = true;
        redux.update(this.#name, unmount);
    }

    end(name) {
        const unmount = this.#get();
        if (!unmount) return console.warn('unmount end 方法错误，原因是没有执行start方法');
        if (name) this.pageName = name;
        unmount[this.pageName] = false;
        new Redux().update(this.#name, unmount);
    }

    confirm(name) {
        const unmount = this.#get();
        if (!unmount) return console.warn('unmount confirm 方法错误，未执行start方法');
        if (name) this.pageName = name;
        return unmount[this.pageName];
    }

}
