import React, {Component} from 'react';
import {SafeAreaView, Platform, StyleSheet, TouchableHighlight, View} from 'react-native';

import theme from '../theme';
import {page} from "../../index";

export default class PageRender extends Component {
    constructor(props) {
        super(props);
        this.css = theme.get() ?? {};
        this.style = styles(this.css);
        this.state = {
            full: props.full ?? false,//是否全面屏
            bg: props.bg,
            children: props.children,
            style: props.style,
            onPress: props.onPress,
        }
    }


    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.children === this.state.children &&
            JSON.stringify(nextProps.style) === JSON.stringify(this.state.style)) return false;
        this.setState({
            children: nextProps.children,
            style: nextProps.style,
        });
        return true;
    }

    render() {
        const css = this.css;
        const style = this.style;
        const stateStyle = this.state.style ?? {};
        const {full, children, onPress, bg} = this.state;

        let fullStyle = {paddingTop: css.headerBarHeight};
        if (full) fullStyle = {};

        let childrenView = <View style={[stateStyle, fullStyle, {
            backgroundColor: bg ?? css.page.bg,
            flex: 1
        }]}>{children}</View>;
        let innerView = childrenView;
        if (Platform.OS === 'ios' && !full) innerView = <SafeAreaView style={[style.container, {flex: 1}]}>
            {childrenView}
        </SafeAreaView>;
        return <TouchableHighlight activeOpacity={1} style={{flex: 1}} onPress={() => {
            if (typeof onPress === "function") onPress();
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
