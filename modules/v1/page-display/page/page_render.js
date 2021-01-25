import React, {PureComponent} from 'react';
import {Platform, StyleSheet, TouchableHighlight, View, Text} from 'react-native';
// import {SafeAreaProvider} from 'react-native-safe-area-context';

import theme from '../theme';
import tools from './tools';

export default class Page_render extends PureComponent {
    constructor(props) {
        super(props);
        this.css = theme.get() ?? {};
        this.style = styles(this.css);
        this.state = {
            count: 0,
            full: props.full ?? false,//是否全面屏
            bg: props.bg,
            // barBg: props.barBg,
            // children: props.children,
            style: props.style,
            onPress: props.onPress,
            article: props.article ?? false,//是否是文章
            onBlur: props.onBlur ?? undefined,
        }
    }

    render() {
        const css = this.css;
        const styles = this.style;
        const state = this.state;
        // let barBg = state.barBg ?? css.page.bg;

        //内容页
        let innerView = <View style={{flex: 1}}>{this.props.children}</View>;
        if (Platform.OS === 'ios') {
            let children = this.props.children;
            // if (!state['full']) children = <SafeAreaProvider style={{flex: 1, flexGrow: 1}}>
            //     {this.props.children}
            // </SafeAreaProvider>;
            innerView = <View style={{flex: 1}}>
                {/*<View style={{height: css.headerBarHeight, backgroundColor: css.page.barBg}}/>*/}
                {children}
            </View>;
        }

        //如果是文章不用 TouchableHighlight
        if (state.article) return <View style={[state.style, styles.container,
            {backgroundColor: state.bg ?? css.page.bg ?? '#fff'}]}>
            {innerView}
        </View>;

        return <TouchableHighlight style={{
            flex: 1,
            backgroundColor: state.bg ?? css.page.bg
        }} activeOpacity={1} onPress={() => {
            if (typeof this.state.onBlur !== 'undefined') tools.blur(this.state.onBlur);
            if (typeof state.onPress === "function") state.onPress();
        }}>
            <View style={{flex: 1}}>
                <View style={[state['style'], styles.container, {
                    backgroundColor: state['bg'] ?? css.page.bg
                }]}>
                    {innerView}
                </View>
            </View>
        </TouchableHighlight>;
    }
}
const styles = (css) => StyleSheet.create({
    container: {
        flex: 1,
    },
});
