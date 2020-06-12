import React, {Component} from 'react';
import {Text} from 'react-native';

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
            mTop: props.mTop,
            mBottom: props.mBottom,
            mLeft: props.mLeft,
            mRight: props.mRight,
            log: props.log ?? false,
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.color === this.state.color &&
            nextProps.bgColor === this.state.bgColor &&
            nextProps.text === this.state.text) return false;
        this.setState({
            color: nextProps.color ?? this.state.color,
            bgColor: nextProps.bgColor ?? this.state.bgColor,
            text: nextProps.text ?? this.state.text,
        });
        return true;
    }

    render() {
        const css = this.css;
        const state = this.state;
        let styles = [];
        if (state.style.length > 0) styles = styles.concat(state.style);
        else styles.push(state.style);
        if (state.log) {
            console.log(styles);
            console.log(state);
        }
        let style = {};
        if (!styles[0].fontSize) style.fontSize = state.size ?? css.font.size;
        if (!styles[0].fontWeight) style.fontWeight = state.weight ?? 'normal';
        if (!styles[0].color) style.color = state.color ?? css.font.color;

        if (state.lineHeight) style.lineHeight = state.lineHeight;
        if (state.mTop) style.marginTop = state.mTop;
        if (state.mBottom) style.marginBottom = state.mBottom;
        if (state.mRight) style.marginRight = state.mRight;
        if (state.mLeft) style.marginLeft = state.mLeft;

        styles.push(style);
        if (state.log) {
            console.log(styles);
        }
        if (state.line) return <Text style={styles} numberOfLines={state.line}>{state.text}</Text>;
        return <Text style={styles}>{state.text}</Text>
    }
}
