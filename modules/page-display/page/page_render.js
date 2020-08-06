import React, {Component} from 'react';
import {SafeAreaView, Platform, StyleSheet, TouchableHighlight, StatusBar, View} from 'react-native';

import theme from '../theme';
import tools from './tools';

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
        }
    }


    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.children === this.state.children &&
            nextProps.full === this.state.full &&
            nextProps.bg === this.state.bg &&
            nextProps.barBg === this.state.barBg &&
            nextProps.barStyle === this.state.barStyle &&
            JSON.stringify(nextProps.style ?? {}) === JSON.stringify(this.state.style ?? {})) return false;
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
        const style = this.style;
        const stateStyle = this.state.style ?? {};
        const state = this.state;

        let fullStyle = {};
        if (Platform.OS === 'android' && !state.full) fullStyle = {paddingTop: css.headerBarHeight};

        let childrenView = <View style={[stateStyle, fullStyle, {
            backgroundColor: state.bg ?? css.page.bg,
            flex: 1
        }]}>
            <StatusBar backgroundColor={state.barBg ?? css.page.bg} translucent
                       barStyle={state.barStyle ?? tools.getBarStyle() ?? 'light-content'}/>
            {state.children}
        </View>;
        let innerView = childrenView;
        if (Platform.OS === 'ios' && !state.full) innerView = <View style={{flex: 1}}>
            <View style={{height: css.headerBarHeight, backgroundColor: state.barBg ?? css.page.bg}}/>
            <SafeAreaView style={[style.container, {
                backgroundColor: state.bg ?? css.page.bg,
                flex: 1
            }]}>
                {childrenView}
            </SafeAreaView>
        </View>;
        return <TouchableHighlight activeOpacity={1} style={{flex: 1}} onPress={() => {
            if (typeof state.onPress === "function") state.onPress();
        }}>
            {innerView}
        </TouchableHighlight>
    }
}
const styles = (css) => StyleSheet.create({
    container: {
        backgroundColor: css.page.bg ?? '#fff',
        flex: 1,
    },
});
