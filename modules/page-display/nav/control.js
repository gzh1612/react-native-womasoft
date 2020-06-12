import {CommonActions} from '@react-navigation/native';

let timer = 1;
let _this;
let lastThis = () => _this;

//跳转
const go = (that, routeName, params, isDefer = false) => {
    if (!that) return console.warn('nav go方法 that 参数为 undefined');
    _this = that;
    const {navigation} = that.props;
    params = params ?? {};
    if (!isDefer) return navigation.navigate(routeName, params);
    const goTimeout = setTimeout(() => {
        clearTimeout(goTimeout);
        navigation.navigate(routeName, params);
    }, timer);
};

//替换
const replace = (that, routeName, params) => {
    if (!that) return console.warn('nav go方法 that 参数为 undefined');
    const {navigation} = that.props;
    _this = that;
    params = params ?? {};
    return navigation.replace(routeName, params);
};

//返回
const back = (that, routeName = null, isDefer = false) => {
    if (!that) return console.warn('nav go方法 that 参数为 undefined');
    const {navigation} = that.props;
    _this = that;
    if (!isDefer) return navigation.goBack(routeName);
    const backTimeout = setTimeout(() => {
        clearTimeout(backTimeout);
        return navigation.goBack();
    }, timer);
};

//清空缓存,跳转页默认为第一页
const empty = (that, routeName, isDefer = false) => {
    if (!that) return console.warn('nav go方法 that 参数为 undefined');
    const {navigation} = that.props;
    _this = that;
    let resetAction = CommonActions.reset({
        index: 0,
        routes: [{name: routeName}],
    });
    if (!isDefer) return navigation.dispatch(resetAction);
    const emptyTimeout = setTimeout(() => {
        clearTimeout(emptyTimeout);
        return navigation.dispatch(resetAction);
    }, timer);
};

//返回到最顶端
const popToTop = (that) => {
    if (!that) return console.warn('nav popToTop方法 that 参数为 undefined');
    const {navigation} = that.props;
    _this = that;
    return navigation.popToTop();
};

export default {
    go, replace, back, empty, popToTop,
    lastThis,
}
