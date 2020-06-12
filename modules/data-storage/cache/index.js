import redux from '../redux';
import storage from '../storage';

let defaultName = 'AppCache';

//初始化
const init = (name = defaultName) => {
    redux.remove(name);
    redux.add(name, {});
};

//写入
const set = (pageName, paramName, value) => {
    let data = redux.get(defaultName);
    if (!data) return console.warn('数据缓存未初始化');
    if (!data[pageName]) data[pageName] = {};
    if (!pageName || !paramName) return console.warn('数据缓存参数 pageName 或 paramName 没有值');
    if (!data[pageName][paramName]) data[pageName][paramName] = {};
    data[pageName][paramName] = value;
    redux.update(defaultName, data);
    storage.setJson(defaultName, data);
};

//获取
const get = (pageName, paramName) => {
    const data = redux.get(defaultName);
    if (!data) return console.warn('数据缓存未初始化');
    if (!pageName) return console.warn('数据缓存参数 pageName 没有值');
    if (pageName && !paramName) return data[pageName];
    if (!data[pageName]) return;
    return data[pageName][paramName];
};

//自动绑定
const bind = (that, pageName) => {
    const data = get(pageName);
    if (!data) return;
    that.setState(data);
};

export default {
    init, get, set, bind,
}
