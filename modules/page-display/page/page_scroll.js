import React, {Component} from 'react';
import {StyleSheet, TouchableHighlight, View, ScrollView} from 'react-native';

import theme from '../theme';

export default class PageScroll extends Component {
    constructor(props) {
        super(props);
        this.css = theme.get() ?? {};
        this.style = styles(this.css);
        this.state = {
            children: props.children,
            style: props.style,
            refreshControl: props.refreshControl,
        }
    }


    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.children === this.state.children &&
            nextProps.refreshControl === this.state.refreshControl &&
            JSON.stringify(nextProps.style) === JSON.stringify(this.state.style)) return false;
        this.setState({
            children: nextProps.children,
            style: nextProps.style,
            refreshControl: nextProps.refreshControl,
        });
        return true;
    }

    render() {
        const stateStyle = this.state.style ?? {};
        return <ScrollView refreshControl={this.state.refreshControl}>
            <TouchableHighlight activeOpacity={1}>
                <View style={stateStyle}>
                    {this.state.children}
                </View>
            </TouchableHighlight>
        </ScrollView>
    }
}
const styles = (css) => StyleSheet.create({});
