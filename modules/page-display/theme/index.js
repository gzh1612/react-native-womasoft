import {Dimensions, StatusBar, NativeModules, Platform} from 'react-native';
import redux from '../../data-storage/redux';
// import storage from '../../data-storage/storage';

const {width, height} = Dimensions.get('window');
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
    headerBarHeight: StatusBar.currentHeight ?? 0,//header导航栏高度
    headerHeight: 50,//header高度
    //导航
    navColor: '#eee',
    navCheckColor: '#666',

    width: width,
    height: height,


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
css.columnBetween = {
    flexDirection: 'column',
    justifyContent: 'space-between',
};
css.columnBetweenCenter = {
    ...css.columnBetween,
    alignItems: 'center'
};
css.columnStart = {
    flexDirection: 'column',
    justifyContent: 'flex-start'
};
css.columnStartCenter = {
    ...css.columnStart,
    alignItems: 'center'
};

css.columnAround = {
    flexDirection: 'column',
    justifyContent: 'space-around',
};
css.columnAroundCenter = {
    ...css.columnAround,
    alignItems: 'center'
};

css.columnEnd = {
    flexDirection: 'column',
    justifyContent: 'flex-end'
};

css.columnEndCenter = {
    ...css.columnEnd,
    alignItems: 'center'
};

//listSingle
css.listHeight = 42;


//设置项目主题色
const set = (params) => {
    if (!params) return;
    for (let item in params) {
        css[item] = params[item];
    }
    return css;
};

const get = () => redux.get(defaultName);

const init = (defaultTypeName, cssJson) => {
    if (!defaultTypeName || !cssJson) return console.error('defaultTypeName 或 cssJson 参数有 undefined');
    redux.add(defaultType, defaultTypeName);
    redux.add(defaultName, cssJson);
    // storage.get(defaultType).then(res => {
    //     console.log(res);
    // });
};


export default {
    defaultConfigName: 'default',
    defaultName: defaultName,
    defaultType: defaultType,
    css,
    set,
    init,
    get,
}
