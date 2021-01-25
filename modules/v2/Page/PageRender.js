import React, {Component} from 'react';
import {TouchableHighlight, View, Platform, StatusBar} from 'react-native';
import Header from "./PageHeader";
import Theme from "../Theme";
import Navigation from "../Navigation";
import Redux from "../Redux";

export default class PageRender extends Component {
    #css = new Theme().get();

    constructor(props) {
        /**
         *  log             查看log
         *  this            获取当前页面this
         *  style           render附加样式
         *  isPress         是否可以点击，用于展示文章
         *  onBlur          点击失去焦点
         *  onPress         点击操作
         *  isBar           是否显示barView
         *  isHeader        是否显示headerView
         *  headerStyle     header 样式
         *  headerLeft      header 左侧图标
         *  headerRight     header 右侧图标
         */
        super(props);
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor('rgba(0,0,0,0)');
            StatusBar.setTranslucent(true);
        }
        //获取当前设置 header bar 样式
        const headerBar = new Navigation().getHeaderBar();
        if (this.props.log) console.log(headerBar);
        if (headerBar) StatusBar.setBarStyle(headerBar);
        //redux 监听
        new Redux().listen(Navigation.headerBar, res => {
            StatusBar.setBarStyle(res);
        });
    }

    shouldComponentUpdate(nextProps, nextState): boolean {
        if (this.props.log) {
            console.log('nextProps', nextProps);
            console.log('nextState', nextState);
        }
        if (!nextProps) nextProps = {};
        if (!nextState) nextState = {};
        const props = {};
        if (nextProps.this !== nextState.this) props['this'] = nextProps.this;
        if (nextProps.bg !== nextState.bg) props['bg'] = nextProps.bg;
        if (nextProps.children !== nextState.children) props['children'] = nextProps.children;
        if (nextProps.isBar !== nextState.isBar) props['isBar'] = nextProps.isBar;
        if (nextProps.isHeader !== nextState.isHeader) props['isHeader'] = nextProps.isHeader;
        if (this.props.log) console.log('PageRender', props);
        let i = 0;
        for (let item in props) {
            if (props.hasOwnProperty(item)) i++;
        }
        return i > 0;
    }

    onBlur(that) {
        if (!that) return console.warn('page.blur(this); 方法this为undefined');
        let refs = that['refs'];
        if (!refs) return;
        for (let item in refs) {
            if (refs.hasOwnProperty(item)) {
                refs[item].blur();
            }
        }
    }

    render() {
        const css = this.#css;
        const props = this.props ?? {};
        const pageThis = props.this ?? {};
        const style = {backgroundColor: css.page.bg, ...props.style ?? {}};
        if (props.bg) style.backgroundColor = props.bg;

        const isBar = typeof props.isBar === 'boolean' ? props.isBar : true,
            isHeader = typeof props.isHeader === 'boolean' ? props.isHeader : true;
        //bar
        const barView = isBar ? <View style={{width: css.width, height: css.headerBarHeight}}/> : <View/>;
        //header
        const headerView = isHeader ? <Header title={pageThis.title}
                                              style={props.headerStyle ?? {}}
                                              left={props.headerLeft}
                                              right={props.headerRight}/> : <View/>;
        //内容
        let contentView = <View style={[{flex: 1}, style]}>
            {barView}
            {headerView}
            <View style={{flex: 1, flexGrow: 1}}>
                {props.children}
            </View>
        </View>;

        if (props.isPress) return contentView;
        return <TouchableHighlight style={{flex: 1}} activeOpacity={1} onPress={() => {
            this.onBlur(typeof props.onBlur !== "undefined" ? props.onBlur : pageThis);
            if (typeof props.onPress === "function") props.onPress();
        }}>
            {contentView}
        </TouchableHighlight>
    }
}

