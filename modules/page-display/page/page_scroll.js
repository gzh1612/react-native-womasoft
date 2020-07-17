import React, {Component} from 'react';
import {StyleSheet, TouchableHighlight, View, ScrollView, RefreshControl} from 'react-native';

import theme from '../theme';

export default class PageScroll extends Component {
    constructor(props) {
        super(props);
        this.css = theme.get() ?? {};
        this.style = styles(this.css);
        this.state = {
            children: props.children,
            style: props.style,
            onRefresh: props.onRefresh,
            refreshing: props.refreshing ?? false,
        }
    }


    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.children === this.state.children &&
            nextProps.refreshing === this.state.refreshing &&
            JSON.stringify(nextProps.style) === JSON.stringify(this.state.style)) return false;
        this.setState({
            children: nextProps.children,
            style: nextProps.style,
            refreshing: nextProps.refreshing,
        });
        return true;
    }

    render() {
        const stateStyle = this.state.style ?? {};
        return <ScrollView refreshControl={
            <RefreshControl refreshing={this.state.refreshing}
                            onRefresh={() => {
                                if (typeof this.state.onRefresh === 'function') this.state.onRefresh();
                            }}/>}>
            <TouchableHighlight activeOpacity={1}>
                <View style={stateStyle}>
                    {this.state.children}
                </View>
            </TouchableHighlight>
        </ScrollView>
    }
}
const styles = (css) => StyleSheet.create({});
