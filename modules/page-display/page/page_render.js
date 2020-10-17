import React, {Component} from 'react';
import {SafeAreaView, Platform, StyleSheet, TouchableHighlight, StatusBar, View} from 'react-native';

import theme from '../theme';
import tools from './tools';
import redux from '../../data-storage/redux';

export default class PageRender extends Component {
    constructor(props) {
        super(props);
        this.css = theme.get() ?? {};
        this.style = styles(this.css);
        this.state = {
            full: props.full ?? false,//是否全面屏
            bg: props.bg,
            barBg: props.barBg,
            barStyle: props.barStyle ?? 'light-content',
            children: props.children,
            style: props.style,
            onPress: props.onPress,
            article: props.article ?? false,//是否是文章
            onBlur: props.onBlur ?? undefined,
        }
    }


    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.children === this.state.children &&
            nextProps.full === this.state.full &&
            nextProps.bg === this.state.bg &&
            nextProps.barBg === this.state.barBg &&
            nextProps.barStyle === this.state.barStyle &&
            JSON.stringify(nextProps.style ?? {}) === JSON.stringify(this.state.style ?? {})) return false;
        // console.log('children', nextProps.children === this.state.children);
        // console.log('--nextProps', nextProps.children);
        // console.log('--state', this.state.children);
        // console.log('');
        // console.log('full', nextProps.full === this.state.full);
        // console.log('--nextProps', nextProps.full);
        // console.log('--state', this.state.full);
        // console.log('');
        // console.log('bg', nextProps.bg === this.state.bg);
        // console.log('--nextProps', nextProps.bg);
        // console.log('--state', this.state.bg);
        // console.log('');
        // console.log('barBg', nextProps.barBg === this.state.barBg);
        // console.log('--nextProps', nextProps.barBg);
        // console.log('--state', this.state.barBg);
        // console.log('');
        // console.log('barStyle', nextProps.barStyle === this.state.barStyle);
        // console.log('--nextProps', nextProps.barStyle);
        // console.log('--state', this.state.barStyle);
        // console.log('');
        // console.log('style', JSON.stringify(nextProps.style ?? {}) === JSON.stringify(this.state.style ?? {}));
        // console.log('--nextProps', JSON.stringify(nextProps.style ?? {}));
        // console.log('--state', JSON.stringify(this.state.style ?? {}));
        // console.log('');
        // console.log('--------------------------------------------------------------');
        this.setState({
            children: nextProps.children,
            style: nextProps.style,
            full: nextProps.full,
            bg: nextProps.bg,
            barBg: nextProps.barBg,
            barStyle: nextProps.barStyle,
        });
        return true;
    }

    render() {
        const css = this.css;
        const state = this.state;
        let barBg = state.barBg ?? css.page.bg;
        let barView;
        if (!state.full) {
            barView = <View style={{
                width: css.width,
                height: css.headerBarHeight,
                backgroundColor: barBg,
            }}/>;
        }

        //设置 statusBar
        let statusBarView = <StatusBar translucent backgroundColor={'rgba(0,0,0,0)'}
                                       barStyle={state.barStyle ?? tools.getBarStyle()}/>;
        // redux.listen('navBar', res => {
        //     console.log(res);
        // });
        //内容页
        let innerView = <View style={{flex: 1}}>
            {state.children}
        </View>;
        if (Platform.OS === 'ios') {
            let children = state.children;
            if (!state.full) children = <SafeAreaView style={{flex: 1}}>
                {state.children}
            </SafeAreaView>;
            innerView = <View style={{flex: 1}}>
                {children}
            </View>;
        }

        //如果是文章不用 TouchableHighlight
        if (state.article) return <View style={[{flex: 1, backgroundColor: '#000'}, state.style]}>
            {statusBarView}
            {barView}
            {innerView}
        </View>;

        return <TouchableHighlight style={{flex: 1, backgroundColor: '#000'}} activeOpacity={1} onPress={() => {
            if (typeof this.state.onBlur !== 'undefined') tools.blur(this.state.onBlur);
            if (typeof state.onPress === "function") state.onPress();
        }}>
            <View style={[{flex: 1, backgroundColor: state.bg ?? css.page.bg}, state.style]}>
                {statusBarView}
                {barView}
                {innerView}
            </View>
        </TouchableHighlight>;
    }
}
const styles = (css) => StyleSheet.create({
    container: {
        backgroundColor: css.page.bg ?? '#fff',
        flex: 1,
    },
});
