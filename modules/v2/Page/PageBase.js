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

    componentWillUnmount() {
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.log) {
            console.log('nextProps', nextProps);
            console.log('nextState', nextState);
        }
        if (!nextProps) nextProps = {};
        if (!nextState) nextState = {};
        const props = {};
        if (nextProps.this !== nextState.this) props['this'] = nextProps.this;
        if (nextProps.children !== nextState.children) props['children'] = nextProps.children;
        if (this.props.log) console.log('PageBase', props);
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
        //内容
        let contentView = <View style={[{flex: 1}]}>
            {props.children}
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

