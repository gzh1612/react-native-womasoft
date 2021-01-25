import * as RNLocalize from 'react-native-localize';
import Redux from "../Redux";
import Storage from "../Storage";
import Tools from "../Tools";

export default class Language {

    #type = 'framework_language_type';  //多语言类型
    #data = 'framework_language_data';  //多语言数据存储

    constructor() {

    }

    /**
     * 初始化多语言
     * @param languageAll       语言json 如：{zh:{},en:{}}
     * @param defaultName       默认语言
     */
    init(languageAll, defaultName) {
        if (typeof languageAll !== "object") return console.warn('初始化多语言失败');
        let languageType = defaultName ?? this.getLocales();
        const redux = new Redux(), storage = new Storage();
        redux.add(this.#type, languageType);
        redux.add(this.#data, languageAll[languageType]);
        storage.get(this.#type).then(res => {
            if (res) {
                languageType = res;
                console.log(`当前缓存语言类型为：${res}`);
                redux.update(this.#type, languageType);
                redux.update(this.#data, languageAll[languageType]);
            }
            storage.set(this.#type, languageType);
        });
    }

    //获取系统语言,地区类型
    getLocales() {
        const locales = RNLocalize.getLocales();
        return locales[0].languageCode;
    }

    //获取类型
    getType() {
        return new Redux().get(this.#type);
    }

    //写入数据
    set(type, data) {
        const redux = new Redux(), storage = new Storage();
        redux.update(this.#type, type);
        redux.update(this.#data, data);
        storage.set(this.#type, type);
    }

    all(name) {
        const redux = new Redux();
        const languageData = redux.get(this.#data) ?? {};
        if (!languageData) return languageData;
        return languageData[name];
    }

    get(name) {
        let languageData = Tools.copy(this.all());
        if (!languageData) return;
        if (!name) return console.warn('获取语言时出错，请填写name值');
        const nameArr = name.split('.');
        nameArr.map(item => {
            if (!languageData[item]) return console.warn(`获取语言时出错，有未获取到的名称：${item}`);
            languageData = languageData[item];
        });
        return languageData;
    }
}
