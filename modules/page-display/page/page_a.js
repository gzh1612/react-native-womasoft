import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import theme from '../theme';
import modal from '../modal';

export default class PageA extends Component {
    constructor(props) {
        super(props);
        this.css = theme.get();
        this.state = {
            onPress: props.onPress,
            children: props.children,
            alert: props.alert,//弹出显示值 string类型
            size: props.size,
            color: props.color,
            bgColor: props.bgColor,
            weight: props.weight,
            lineHeight: props.lineHeight,
            style: props.style ?? {},
            text: props.text,
            line: props.line ?? false,
            mTop: props.mTop ?? 0,
            mBottom: props.mBottom ?? 0,
            mLeft: props.mLeft ?? 0,
            mRight: props.mRight ?? 0,
            log: props.log ?? false,
        };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.children === this.state.children &&
            nextProps.color === this.state.color &&
            nextProps.bgColor === this.state.bgColor &&
            (JSON.stringify(nextProps.style ?? {}) === JSON.stringify(this.state.style ?? {})) &&
            nextProps.text === this.state.text &&
            nextProps.alert === this.state.alert &&
            nextProps.onPress === this.state.onPress) return false;
        this.setState({
            children: nextProps.children ?? this.state.children,
            color: nextProps.color ?? this.state.color,
            bgColor: nextProps.bgColor ?? this.state.bgColor,
            text: nextProps.text ?? this.state.text,
            alert: nextProps.alert ?? this.state.alert,
            style: nextProps.style ?? this.state.style,
            onPress: nextProps.onPress ?? this.state.onPress,
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
        if (!styles[0].fontSize) style.fontSize = state.size ?? css.font.size ?? 14;
        if (!styles[0].fontWeight) style.fontWeight = state.weight ?? 'normal';
        if (!styles[0].color) style.color = state.color ?? css.font.color ?? '#808080';
        if (state.lineHeight) style.lineHeight = state.lineHeight;
        if (state.mTop) style.marginTop = state.mTop;
        if (state.mBottom) style.marginBottom = state.mBottom;
        if (state.mRight) style.marginRight = state.mRight;
        if (state.marginRight) style.marginLeft = state.marginRight;
        if (state.bgColor) {
            style.backgroundColor = state.bgColor;
            style.borderColor = state.bgColor;
        }

        styles.push(style);
        if (state.log) {
            console.log(styles);
        }
        //children有值
        if (state.children) {
            //是否省略
            if (state.line) return <TouchableOpacity activeOpacity={.5} onPress={() => {
                if (state.alert) modal.alert(state.alert);
                if (typeof state.onPress === "function") state.onPress();
            }}>
                <Text style={styles} numberOfLines={state.line}>{state.children}</Text>
            </TouchableOpacity>;
            return <TouchableOpacity activeOpacity={.5} onPress={() => {
                if (state.alert) modal.alert(state.alert);
                if (typeof state.onPress === "function") state.onPress();
            }}>
                <View style={styles}>{state.children}</View>
            </TouchableOpacity>
        } else {
            if (state.line) return <TouchableOpacity activeOpacity={.5} onPress={() => {
                if (state.alert) modal.alert(state.alert);
                if (typeof state.onPress === "function") state.onPress();
            }}>
                <Text style={styles} numberOfLines={state.line}>{state.text}</Text>
            </TouchableOpacity>;
            return <TouchableOpacity activeOpacity={.5} onPress={() => {
                if (state.alert) modal.alert(state.alert);
                if (typeof state.onPress === "function") state.onPress();
            }}>
                <Text style={styles}>{state.text}</Text>
            </TouchableOpacity>
        }
    }
}
