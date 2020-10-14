import React, {Component} from 'react';
import {Platform, Text, TouchableOpacity, View} from 'react-native';

import theme from '../theme';
import popup from '../popup';

export default class PageA extends Component {
    constructor(props) {
        super(props);
        this.css = theme.get();
        this.state = {
            onPress: props.onPress,
            isPress: props.isPress ?? true,
            noPressColor: props.noPressColor,
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
            marginTop: props['t'] ?? props['mTop'],
            marginBottom: props['b'] ?? props['mBottom'],
            marginLeft: props['l'] ?? props['mLeft'],
            marginRight: props['r'] ?? props['mRight'],
            width: props.width,
        };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        let isPress = nextProps.isPress === undefined ? true : nextProps.isPress;
        if (nextProps.children === this.state.children &&
            nextProps.color === this.state.color &&
            nextProps.bgColor === this.state.bgColor &&
            (JSON.stringify(nextProps.style ?? {}) === JSON.stringify(this.state.style ?? {})) &&
            nextProps.text === this.state.text &&
            nextProps.alert === this.state.alert &&
            isPress === this.state.isPress &&
            nextProps.noPressColor === this.state.noPressColor &&
            nextProps.onPress === this.state.onPress
        ) return false;
        // console.log('children', nextProps.children === this.state.children);
        // console.log('--nextProps', nextProps.children);
        // console.log('--state', this.state.children);
        // console.log('');
        // console.log('color', nextProps.color === this.state.color);
        // console.log('--nextProps', nextProps.color);
        // console.log('--state', this.state.color);
        // console.log('');
        // console.log('bgColor', nextProps.bgColor === this.state.bgColor);
        // console.log('--nextProps', nextProps.bgColor);
        // console.log('--state', this.state.bgColor);
        // console.log('');
        // console.log('style', JSON.stringify(nextProps.style ?? {}) === JSON.stringify(this.state.style ?? {}));
        // console.log('--nextProps', JSON.stringify(nextProps.style ?? {}));
        // console.log('--state', JSON.stringify(this.state.style ?? {}));
        // console.log('');
        // console.log('text', nextProps.text === this.state.text);
        // console.log('--nextProps', nextProps.text);
        // console.log('--state', this.state.text);
        // console.log('');
        // console.log('alert', nextProps.alert === this.state.alert);
        // console.log('--nextProps', nextProps.alert);
        // console.log('--state', this.state.alert);
        // console.log('');
        // console.log('isPress', isPress === this.state.isPress);
        // console.log('--nextProps', isPress);
        // console.log('--state', this.state.isPress);
        // console.log('');
        // console.log('noPressColor', nextProps.noPressColor === this.state.noPressColor);
        // console.log('--nextProps', nextProps.noPressColor);
        // console.log('--state', this.state.noPressColor);
        // console.log('');
        // console.log('onPress', nextProps.onPress === this.state.onPress);
        // console.log('--nextProps', nextProps.onPress);
        // console.log('--state', this.state.onPress);
        // console.log('');
        // console.log('--------------------------------------------------------------');
        this.setState({
            children: nextProps.children,
            color: nextProps.color,
            bgColor: nextProps.bgColor,
            text: nextProps.text,
            alert: nextProps.alert,
            style: nextProps.style,
            onPress: nextProps.onPress,
            isPress: isPress,
            noPressColor: nextProps.noPressColor,
        });
        return true;
    }


    render() {
        const css = this.css;
        const state = this.state;
        let styles = [];
        if (Platform.OS === 'android') styles.push({fontFamily: 'lucida grande'});
        else styles.push({});
        if (state.style) styles = styles.concat(state.style);
        else styles.push(state.style);
        let style = {};
        if (state.size) style.fontSize = state.size ?? css.font.size ?? 14;
        else style.fontSize = css.font.size ?? 14;
        if (state.weight) style.fontWeight = state.weight ?? 'normal';

        if (state.color) style.color = state.color ?? css.font.color ?? '#808080';
        else {
            for (let i = 0, len = styles.length; i < len; i++) {
                if (styles[i].color) style.color = styles[i].color;
            }
            if (!style.color) style.color = css.font.color ?? '#808080';
        }

        if (state.lineHeight) style.lineHeight = state.lineHeight;
        if (state.marginTop) style.marginTop = state.marginTop;
        if (state.marginBottom) style.marginBottom = state.marginBottom;
        if (state.marginRight) style.marginRight = state.marginRight;
        if (state.marginLeft) style.marginLeft = state.marginLeft;
        if (state.width) style.width = state.width;
        if (state.bgColor) {
            style.backgroundColor = state.bgColor;
            style.borderColor = state.bgColor;
        }

        styles.push(style);

        if (!this.state.isPress) {
            styles.push({
                backgroundColor: this.state.noPressColor,
                borderColor: this.state.noPressColor,
            })
        }

        //children有值
        if (state.children) {
            //是否省略
            if (state.line) return <TouchableOpacity activeOpacity={.9} onPress={() => {
                if (!this.state.isPress) return;
                if (state.alert) popup.modal.alert(state.alert);
                if (typeof state.onPress === "function") state.onPress();
            }}>
                <Text style={styles} numberOfLines={state.line}>{state.children}</Text>
            </TouchableOpacity>;
            return <TouchableOpacity activeOpacity={.9} onPress={() => {
                if (!this.state.isPress) return;
                if (state.alert) popup.modal.alert(state.alert);
                if (typeof state.onPress === "function") state.onPress();
            }}>
                <View style={styles}>{state.children}</View>
            </TouchableOpacity>
        } else {
            if (state.line) return <TouchableOpacity activeOpacity={.9} onPress={() => {
                if (!this.state.isPress) return;
                if (state.alert) popup.modal.alert(state.alert);
                if (typeof state.onPress === "function") state.onPress();
            }}>
                <Text style={styles} numberOfLines={state.line}>{`${state.text ?? ''}`}</Text>
            </TouchableOpacity>;
            return <TouchableOpacity activeOpacity={.9} onPress={() => {
                if (!this.state.isPress) return;
                if (state.alert) popup.modal.alert(state.alert);
                if (typeof state.onPress === "function") state.onPress();
            }}>
                <Text style={styles}>{`${state.text ?? ''}`}</Text>
            </TouchableOpacity>
        }
    }
}
