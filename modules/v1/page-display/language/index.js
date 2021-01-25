import * as RNLocalize from 'react-native-localize';
import redux from '../../data-storage/redux';
import storage from '../../data-storage/storage';

let defaultName = 'AppLanguage';
let defaultType = 'AppLanguageType';
let languageType = '';

/**
 * 初始化语言
 * @param languageJsonTree 语言json 如：{zh:{},en:{}}
 * @param noLanguageDefaultType 当language没有值时，默认匹配的语言类型
 */
const init = (languageJsonTree = {}, noLanguageDefaultType) => {
    languageType = getType();
    console.log(`当前语言类型为：${languageType}`);
    //初始化语言
    redux.add(defaultType, noLanguageDefaultType);
    redux.add(defaultName, languageJsonTree[noLanguageDefaultType]);
    //获取缓存语言类型
    storage.get(defaultType).then(res => {
        console.log(`当前缓存语言类型为：${res}`);
        //覆盖默认值
        if (res) languageType = res;
        //获取当前语言
        let language = languageJsonTree[languageType];
        //没有语言加载默认语言
        if (!language && !noLanguageDefaultType) language = languageJsonTree[noLanguageDefaultType];

        redux.update(defaultType, languageType);
        storage.set(defaultType, languageType);
        if (language) redux.update(defaultName, language);
    })
};

//获取系统语言,地区类型
const getType = () => {
    const locales = RNLocalize.getLocales();
    return locales[0].languageCode;
};

const getSetType = () => {
    return redux.get(defaultType);
};

const all = (name) => {
    const language = redux.get(defaultName);
    if (!language || !name) return language;
    return language[name];
};

const get = (name) => {
    let language = all();
    if (!language) return;
    if (!name) return console.warn('获取语言时出错，请填写name值');
    const nameArr = name.split('.');
    nameArr.map(item => {
        if (!language[item]) return console.warn(`获取语言时出错，有未获取到的名称：${item}`);
        language = language[item];
    });
    return language;
};

const set = (type, json) => {
    redux.update(defaultType, type);
    storage.set(defaultType, type);
    redux.update(defaultName, json);
};

export default {
    init, getType, getSetType, all, get, set,
}
