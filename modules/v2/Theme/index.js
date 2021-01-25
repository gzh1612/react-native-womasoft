import {Dimensions, StatusBar, NativeModules, Platform} from 'react-native';

import Redux from "../Redux";
import Storage from "../Storage";

export default class Theme {
    #type = 'framework_theme_type';         //主题类型
    #data = 'framework_theme_data';         //主题样式

    //写入flex 样式
    #setFlex = (direction, justifyContent, isAlign = false, params) => {
        let directionValue = direction,
            justifyContentValue = justifyContent,
            alignItems = '';
        if (isAlign) alignItems = 'center';
        if (direction === 'row') directionValue = 'row';
        else if (direction === 'col') directionValue = 'column';
        if (justifyContent === 'between') justifyContentValue = 'space-between';
        else if (justifyContent === 'start') justifyContentValue = 'flex-start';
        else if (justifyContent === 'around') justifyContentValue = 'space-around';
        else if (justifyContent === 'end') justifyContentValue = 'flex-end';
        let result = {
            flexDirection: directionValue,
            justifyContent: justifyContentValue,
            ...params ?? {},
        };
        if (isAlign) result = {
            ...result,
            alignItems: alignItems
        };
        return result;
    };

    //合并css
    #writeCss = (params) => {
        if (!params) return;
        let css = this.css;
        for (let item in params) {
            if (params.hasOwnProperty(item)) {
                css[item] = params[item];
            }
        }
        return css;
    };

    constructor() {
        const {width, height} = Dimensions.get('window');
        const deviceHeight = Dimensions.get('screen').height;
        const {StatusBarManager} = NativeModules;

        const css = {
            main: '#fff',
            width: width,
            height: height,
            deviceHeight: deviceHeight,
            footerHeight: deviceHeight - height,
            headerBarHeight: StatusBar.currentHeight ?? 48,//header导航栏高度
            listHeight: 42,
        };
        //获取ios刘海高度
        if (Platform['OS'] === 'ios') StatusBarManager.getHeight(res => {
            css.headerBarHeight = res.height
        });
        css.rowBetween = this.#setFlex('row', 'between');
        css.rowBetweenCenter = this.#setFlex('row', 'between', true);

        css.rowStart = this.#setFlex('row', 'start', false, {flexWrap: 'wrap'});
        css.rowStartCenter = this.#setFlex('row', 'start', true);

        css.rowAround = this.#setFlex('row', 'around');
        css.rowAroundCenter = this.#setFlex('row', 'around', true);

        css.rowEnd = this.#setFlex('row', 'end');
        css.rowEndCenter = this.#setFlex('row', 'end', true);

        css.colBetween = this.#setFlex('col', 'between');
        css.colBetweenCenter = this.#setFlex('col', 'between', true);

        css.colStart = this.#setFlex('col', 'start');
        css.colStartCenter = this.#setFlex('col', 'start', true);

        css.colAround = this.#setFlex('col', 'around');
        css.colAroundCenter = this.#setFlex('col', 'around', true);

        css.colEnd = this.#setFlex('col', 'end');
        css.colEndCenter = this.#setFlex('col', 'end', true);

        this.css = css;
    }

    /**
     * 初始化主题样式
     * @param themeAll          所有主题样式json
     * @param defaultName       默认主题样式名称
     */
    init(themeAll, defaultName) {
        console.log('defaultName', defaultName);
        if (typeof themeAll !== "object") return console.warn('初始化主题失败');
        let themeType = defaultName;
        const redux = new Redux(), storage = new Storage();
        redux.add(this.#type, themeType);
        const w = this.#writeCss(themeAll[themeType]);
        redux.add(this.#data, this.#writeCss(themeAll[themeType]));
        storage.get(this.#type).then(res => {
            if (res) {
                themeType = res;
                console.log(`当前缓存主题类型为：${res}`);
                redux.update(this.#type, themeType);
                redux.update(this.#data, this.#writeCss(themeAll[themeType]));
            }
            storage.set(this.#type, themeType);
        });
    }

    getType() {
        return new Redux().get(this.#type);
    }

    get() {
        return new Redux().get(this.#data);
    }

    set(themeAll, type) {
        if (typeof themeAll !== "object") return console.warn('set Theme themeAll 不为 object，请检查');
        if (!type) return console.warn('set Theme type 为空，请检查');
        const redux = new Redux();
        redux.update(this.#type, type);
        redux.update(this.#data, this.#writeCss(themeAll[type]));
        new Storage().set(this.#type, type);
    }
}
