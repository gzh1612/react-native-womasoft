import React, {Component} from 'react';
import {TouchableHighlight, View, ScrollView, RefreshControl} from 'react-native';

import theme from '../theme';

export default class PageSlide extends Component {
    constructor(props) {
        super(props);
        this.css = theme.get() ?? {};
        this.state = {
            children: props.children,
            style: props.style,
            slideStyle: props.slideStyle,
            onRefresh: props.onRefresh,
            refreshing: props.refreshing ?? false,
            log: props.log ?? false,
        }
    }


    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.children === this.state.children &&
            nextProps.refreshing === this.state.refreshing &&
            JSON.stringify(nextProps.style) === JSON.stringify(this.state.style) &&
            JSON.stringify(nextProps.slideStyle) === JSON.stringify(this.state.slideStyle)) return false;
        if (this.state.log) {
            console.log('children', nextProps.children === this.state.children);
            console.log('refreshing', nextProps.refreshing === this.state.refreshing);
            console.log('style', JSON.stringify(nextProps.style) === JSON.stringify(this.state.style));
            console.log('slideStyle', JSON.stringify(nextProps.slideStyle) === JSON.stringify(this.state.slideStyle));
            console.log('==================================');
        }
        this.setState({
            children: nextProps.children,
            style: nextProps.style ?? this.state.style,
            slideStyle: nextProps.slideStyle ?? this.state.slideStyle,
            refreshing: nextProps.refreshing,
        });
        return true;
    }

    render() {
        return <ScrollView style={this.state.slideStyle ?? {}} refreshControl={
            <RefreshControl refreshing={this.state.refreshing}
                            onRefresh={() => {
                                if (typeof this.state.onRefresh === 'function') this.state.onRefresh();
                            }}/>}>
            <TouchableHighlight activeOpacity={1}>
                <View style={this.state.style ?? {}}>
                    {this.state.children}
                </View>
            </TouchableHighlight>
        </ScrollView>
    }
}
