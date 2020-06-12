import React, {Component} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, TouchableHighlight, View} from 'react-native';

import theme from '../theme';
import {page} from "../../index";

export default class PageRender extends Component {
    constructor(props) {
        super(props);
        this.css = theme.get() ?? {};
        this.style = styles(this.css);
        this.state = {
            statusBarBackgroundColor: props.statusBarBackgroundColor,
            background: props.background,
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
        const {statusBarBackgroundColor} = this.state;
        let statusBar = <View/>;
        if (statusBarBackgroundColor) statusBar =
            <StatusBar animated={true} backgroundColor={css.header.bg}/>;
        return <TouchableHighlight activeOpacity={1} style={{flex: 1}} onPress={() => {
            if (typeof this.state.onPress === "function") this.state.onPress();
        }}>
            <SafeAreaView style={[style.container, {
                flex: 1,
                backgroundColor: statusBarBackgroundColor ?? css.page.bg ?? '#fff'
            }]}>
                {statusBar}
                <View style={[stateStyle, {flex: 1}]}>{this.state.children}</View>
            </SafeAreaView>
        </TouchableHighlight>
    }
}
const styles = (css) => StyleSheet.create({
    container: {
        backgroundColor: css.page.bg ?? '#fff',
        flex: 1,
    },
});
