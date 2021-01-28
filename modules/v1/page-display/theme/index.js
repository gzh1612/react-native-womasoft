import {Dimensions, StatusBar, NativeModules, Platform} from 'react-native';
import redux from '../../data-storage/redux';
import storage from '../../data-storage/storage';
import Theme from "../../../v2/Theme";

const {width, height} = Dimensions.get('window');
const deviceHeight = Dimensions.get('screen').height;
const {StatusBarManager} = NativeModules;

const defaultName = 'AppTheme';
const defaultType = 'AppThemeType';

let css = {
    main: '',//主色调
    line: '',//线条颜色
    //背景颜色
    bg: '#fff',
    btnBg: '',//按钮背景
    listBg: '',//列表背景
    //字体
    fontSize: 14,
    fontColor: '',
    border: '#ccc',
    //header导航颜色
    headerBgColor: '',
    headerTitleColor: '',
    headerBarHeight: StatusBar.currentHeight ?? 48,//header导航栏高度
    headerHeight: 50,//header高度
    //导航
    navColor: '#eee',
    navCheckColor: '#666',

    width: width,
    height: height,
    deviceHeight: deviceHeight,
    footerHeight: deviceHeight - height,


};

//获取ios刘海高度
if (Platform['OS'] === 'ios') StatusBarManager.getHeight(res => {
    css.headerBarHeight = res.height
});

css.rowBetween = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // flexWrap: 'wrap',
};
css.rowBetweenCenter = {
    ...css.rowBetween,
    alignItems: 'center'
};
css.rowStart = {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
};
css.rowStartCenter = {
    ...css.rowStart,
    alignItems: 'center'
};

css.rowAround = {
    flexDirection: 'row',
    justifyContent: 'space-around',
};

css.rowAroundCenter = {
    ...css.rowAround,
    alignItems: 'center'
};

css.rowEnd = {
    flexDirection: 'row',
    justifyContent: 'flex-end'
};
css.rowEndCenter = {
    ...css.rowEnd,
    alignItems: 'center'
};
css.colBetween = {
    flexDirection: 'column',
    justifyContent: 'space-between',
};
css.colBetweenCenter = {
    ...css.colBetween,
    alignItems: 'center'
};
css.colStart = {
    flexDirection: 'column',
    justifyContent: 'flex-start'
};
css.colStartCenter = {
    ...css.colStart,
    alignItems: 'center'
};

css.colAround = {
    flexDirection: 'column',
    justifyContent: 'space-around',
};
css.colAroundCenter = {
    ...css.colAround,
    alignItems: 'center'
};

css.colEnd = {
    flexDirection: 'column',
    justifyContent: 'flex-end'
};

css.colEndCenter = {
    ...css.colEnd,
    alignItems: 'center'
};

//listSingle
css.listHeight = 42;

//写入css 并合并
const writeCss = (params) => {
    if (!params) return;
    for (let item in params) {
        css[item] = params[item];
    }
    return css;
};

//设置项目主题色
const set = (classType, classStyleList) => {
    if (!classType || !classStyleList) return console.error('classType 或 classStyleList 参数有 undefined');
    let styles = writeCss(classStyleList[classType]);
    redux.update(defaultType, classType);
    redux.update(defaultName, styles);
    storage.set(defaultType, classType);
};

const get = () => new Theme().get();

const getType = () => redux.get(defaultType);

const init = (classType, classStyleList) => new Theme().init(classStyleList, classType);


export default {
    defaultConfigName: 'default',
    defaultName: defaultName,
    defaultType: defaultType,
    css,
    set,
    init,
    get,
    getType,
}
