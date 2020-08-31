import React, {Component} from 'react';
import {Text, Platform} from 'react-native';

import theme from '../theme';

export default class PageText extends Component {
    constructor(props) {
        super(props);
        this.css = theme.get();
        this.state = {
            size: props.size,
            color: props.color,
            bgColor: props.bgColor,
            weight: props.weight,
            lineHeight: props.lineHeight,
            style: props.style ?? {},
            text: props.text,
            line: props.line ?? false,
            marginTop: props['t'] ?? props['mTop'],
            marginBottom: props['b'] ?? props['mBottom'],
            marginLeft: props['l'] ?? props['mLeft'],
            marginRight: props['r'] ?? props['mRight'],
            width: props.width,
            log: props.log ?? false,
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.color === this.state.color &&
            nextProps.bgColor === this.state.bgColor &&
            JSON.stringify(nextProps.style ?? {}) === JSON.stringify(this.state.style ?? {}) &&
            nextProps.text === this.state.text) return false;
        this.setState({
            color: nextProps.color ?? this.state.color,
            bgColor: nextProps.bgColor ?? this.state.bgColor,
            style: nextProps.style ?? this.state.style,
            text: nextProps.text ?? this.state.text,
        });
        return true;
    }

    render() {
        const css = this.css;
        const state = this.state;
        let styles = [];
        if (Platform.OS === 'android') styles.push({fontFamily: 'lucida grande'});
        else styles.push({});

        if (state.style.length > 0) styles = styles.concat(state.style);
        else styles.push(state.style);
        if (state.log) {
            console.log(styles);
            console.log(state);
        }
        let style = {};
        if (!styles[1].fontSize) style.fontSize = state.size ?? css.font.size;
        if (!styles[1].fontWeight) style.fontWeight = state.weight ?? 'normal';
        if (!styles[1].color) style.color = state.color ?? css.font.color;

        if (state.lineHeight) style.lineHeight = state.lineHeight;
        if (state.marginTop) style.marginTop = state.marginTop;
        if (state.marginBottom) style.marginBottom = state.marginBottom;
        if (state.marginRight) style.marginRight = state.marginRight;
        if (state.marginLeft) style.marginLeft = state.marginLeft;
        if (state.width) style.marginLeft = state.width;

        styles.push(style);
        if (state.log) {
            console.log(styles);
        }

        if (state.line) return <Text style={styles} numberOfLines={state.line}>{`${state.text}`}</Text>;
        return <Text style={styles}>{state.text}</Text>
    }
}
