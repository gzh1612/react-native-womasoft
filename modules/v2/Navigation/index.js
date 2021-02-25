import React from "react";
import {CommonActions, NavigationContainer} from '@react-navigation/native';
import Theme from "../Theme";
import Page from "../Page";
import Redux from "../Redux";
import Emitter from "../Emitter";

export default class Navigation {
    #timer = 1;                                         //默认延时时间
    static navLast = 'framework_nav_last';                    //最后一次导航操作
    #getLastThis = () => new Redux().get(Navigation.navLast);
    /**
     * 私有方法
     *  导航跳转统一处理
     * @param result    跳转处理
     * @param timer     延时跳转时间
     * @returns {*}
     */
    #navResult = (result, timer) => {
        if (!timer) return result;
        const timeout = setTimeout(() => {
            clearTimeout(timeout);
            return result;
        }, timer ?? this.#timer);
    }
    static headerBar = 'framework_nav_headerBar';   //导航 bar 颜色
    static barBlack = 'dark-content';   //黑色
    static barWhite = 'light-content';  //白色

    static headerLeftIconName = 'framework_nav_iconName';   //左侧返回图标

    static footerName = 'framework_nav_footerName';         //底部导航名称

    //页面渐隐
    static fade = ({current, closing}) => ({
        cardStyle: {
            opacity: current.progress,
        },
    });


    constructor() {
        this.that = this.#getLastThis();
    }

    init(params = {}) {
        const redux = new Redux();
        if (params.headerLeftIconName) redux.add(Navigation.headerLeftIconName, params.headerLeftIconName ?? '');
        redux.add(Navigation.navLast, {});
    }

    //写入this
    setThis(that) {
        new Redux().update(Navigation.navLast, that);
    }

    /**
     * 头部左侧箭头显示
     * @param params       [color|name|onPress]
     *           color
     *           name
     *           onPress
     * @returns
     */
    headerLeft(params) {
        if (!params) params = {};
        const css = new Theme().get();
        let icon = new Redux().get(Navigation.headerLeftIconName);
        let leftColor = css.header.leftColor;
        if (params.color) leftColor = params.color;
        if (params.name) icon = params.name;
        return <Page.Text style={{paddingHorizontal: 15}} onPress={() => {
            if (typeof params.onPress === "function") params.onPress();
            else this.back();
        }}>
            <Page.Icon name={icon} size={18} color={leftColor} style={{lineHeight: css.header.height}}/>
        </Page.Text>
    }

    //获取最后一次操作的this
    getLastThis() {
        return this.#getLastThis()
    }

    /**
     *  跳转
     * @param routeName     页面名称
     * @param params        参数
     * @param timer         延时跳转时间
     * @returns {*}
     */
    go(routeName, params, timer) {
        if (!this.that) return;
        const {navigation, route} = this.that.props;
        params = params ?? {};
        return this.#navResult(navigation.navigate(routeName, params), timer);
    }

    /**
     * 返回
     * @returns {*}
     */
    back(timer) {
        if (!this.that) return;
        const {navigation, route} = this.that.props;
        return this.#navResult(navigation.goBack(), timer);
    }

    /**
     * 清空缓存
     * @param routeName     页面名称
     * @param timer         延时跳转时间
     * @returns {*}
     */
    empty(routeName, timer) {
        if (!this.that) return;
        const {navigation} = this.that.props;
        let resetAction = CommonActions.reset({
            index: 0,
            routes: [{name: routeName}],
        });
        return this.#navResult(navigation.dispatch(resetAction), timer);
    }

    /**
     * 返回到最顶端
     * @param timer
     * @returns {*}
     */
    popTpTop(timer) {
        if (!this.that) return;
        const {navigation} = this.that.props;
        return this.#navResult(navigation.popToTop(), timer);
    }

    //替换
    replace(routeName, params, timer) {
        if (!this.that) return;
        const {navigation} = this.that.props;
        params = params ?? {};
        return this.#navResult(navigation.replace(routeName, params), timer);
    }


    getHeaderBar() {
        return new Redux().get(Navigation.headerBar);
    }

    setHeaderBar(value) {
        new Redux().update(Navigation.headerBar, value);
    }

    hide() {
        return new Emitter().set(Navigation.footerName, false);
    }

    show() {
        return new Emitter().set(Navigation.footerName, true);
    }

    // isDisplay() {
    //     return this.that.state.isDisplay ?? true
    // }
    //
    // emitterNavigation() {
    //     return new Emitter();
    // }

}
