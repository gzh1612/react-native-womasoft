import React, {Component} from 'react';
import {View, StyleSheet, TouchableHighlight, Animated} from 'react-native';

import theme from '../theme';

export default class PageSwitch extends Component {
    constructor(props) {
        super(props);
        this.css = theme.get();
        this.styles = styles(this.css);
        this.width = 70;        //  默认宽度
        this.color = this.css.default.main ?? '#f00'; //  默认选中色
        this.bgColor = '#808080';      //  默认背景色

        this.state = {
            color: props.color,
            bgColor: props.bgColor,
            style: props.style ?? {},
            width: props.width,
            value: props.value,
            onPress: props.onPress,
            log: props.log ?? false,

            anOpacity: props.value ? new Animated.Value(1) : new Animated.Value(0),//背景 动画
            anSelectXY: props.value ? new Animated.ValueXY({
                x: (props.width ?? this.width) - 40, y: 0
            }) : new Animated.ValueXY({x: 0, y: 0}),//滑动 动画
            isSelect: props.value ?? false,//是否选中
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.color === this.state.color &&
            nextProps.bgColor === this.state.bgColor &&
            JSON.stringify(nextProps.style ?? {}) === JSON.stringify(this.state.style ?? {})) return false;
        this.setState({
            color: nextProps.color ?? this.state.color,
            bgColor: nextProps.bgColor ?? this.state.bgColor,
            style: nextProps.style ?? this.state.style,
        });
        return true;
    }

    show() {
        const {anOpacity, anSelectXY} = this.state;
        Animated.parallel([
            Animated.timing(anSelectXY, {
                toValue: {x: (this.state.width ?? this.width) - 40, y: 0},
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(anOpacity, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true
            })
        ]).start();
    }

    hide(func) {
        const {anOpacity, anSelectXY} = this.state;
        Animated.parallel([
            Animated.timing(anSelectXY, {
                toValue: {x: 0, y: 0},
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(anOpacity, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true
            })
        ]).start(() => {
            if (typeof func === "function") func();
        });
    }

    render() {
        const css = this.css,
            styles = this.styles;

        const {anOpacity, anSelectXY} = this.state;
        const x = anSelectXY.x;
        const y = anSelectXY.y;

        return <View style={{width: this.state.width ?? this.width}}>
            <TouchableHighlight onPress={() => {
                if (this.state.isSelect) {
                    this.setState({isSelect: false}, () => this.hide());
                } else {
                    this.setState({isSelect: true}, () => this.show());
                }
                if (typeof this.state.onPress === 'function') this.state.onPress(!this.state.isSelect);
            }}>
                <View style={[styles.outView, {
                    width: this.state.width ?? this.width,
                    backgroundColor: this.state.bgColor ?? this.bgColor,
                    borderColor: this.state.bgColor ?? this.bgColor,
                }]}>
                    <Animated.View
                        style={{
                            ...styles.innerView,
                            backgroundColor: this.state.color ?? this.color,
                            opacity: anOpacity,
                        }}/>
                    <Animated.View
                        style={{
                            ...styles.roundView,
                            transform: [
                                {translateX: x},
                                {translateY: y}
                            ]
                        }}/>
                </View>
            </TouchableHighlight>
        </View>
    }
}


const styles = () => StyleSheet.create({
    outView: {
        height: 40,
        borderRadius: 38,
        borderWidth: 1,
        overflow: 'hidden',
        position: 'relative',
    },
    innerView: {
        flex: 1,
    },
    roundView: {
        width: 36,
        height: 36,
        borderRadius: 34,
        borderColor: '#fff',
        backgroundColor: '#fff',
        borderWidth: 1,
        margin: 1,
        position: 'absolute',
    }
});
