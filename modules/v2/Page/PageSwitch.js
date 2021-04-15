import React, {Component} from 'react';
import {View, StyleSheet, TouchableHighlight, Animated} from 'react-native';

import Theme from "../Theme";

export default class PageSwitch extends Component {
    #css = new Theme().get();
    #styles = styles(this.#css);

    /**
     * log
     * this
     * color
     * bgColor
     * style
     * width
     * value
     * onPress
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.width = 50;        //  默认宽度
        this.color = this.#css.font.color ?? '#f00'; //  默认选中色
        this.bgColor = '#808080';      //  默认背景色
        console.log(props.value);
        this.state = {
            page_switch_isSelect: typeof props.value === 'undefined' ? false : props.value,//是否选中
            page_switch_an_opacity: props.value ? new Animated.Value(1) : new Animated.Value(0),//背景 动画
            page_switch_an_selectXY: props.value ? new Animated.ValueXY({
                x: (props.width ?? this.width) - 24, y: 0
            }) : new Animated.ValueXY({x: 0, y: 0}),//滑动 动画
        }

    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (this.props.log) {
            console.log('nextProps', nextProps);
            console.log('nextState', nextState);
        }
        if (!nextProps) nextProps = {};
        if (!nextState) nextState = {};
        const props = {};
        if (nextProps.this !== nextState.this) props['this'] = nextProps.this;
        if (nextProps.color !== nextState.color) props['color'] = nextProps.color;
        if (nextProps.bgColor !== nextState.bgColor) props['bgColor'] = nextProps.bgColor;
        if (nextProps.value !== nextState.value) props['value'] = nextProps.value;
        let i = 0;
        for (let item in props) {
            if (props.hasOwnProperty(item)) i++;
        }
        return i > 0
    }

    show() {
        const {page_switch_an_opacity, page_switch_an_selectXY} = this.state;
        Animated.parallel([
            Animated.timing(page_switch_an_selectXY, {
                toValue: {x: (this.props.width ?? this.width) - 24, y: 0},
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(page_switch_an_opacity, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true
            })
        ]).start();
    }

    hide(func) {
        const {page_switch_an_opacity, page_switch_an_selectXY} = this.state;
        Animated.parallel([
            Animated.timing(page_switch_an_selectXY, {
                toValue: {x: 0, y: 0},
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(page_switch_an_opacity, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true
            })
        ]).start(() => {
            if (typeof func === "function") func();
        });
    }

    render() {
        const css = this.#css,
            styles = this.#styles,
            props = this.props ?? {};

        const {page_switch_an_opacity, page_switch_an_selectXY, page_switch_isSelect} = this.state;
        console.log('state', this.state);
        const x = page_switch_an_selectXY.x;
        const y = page_switch_an_selectXY.y;

        console.log(page_switch_isSelect);
        return <View style={{width: props.width ?? this.width, height: 40}}>
            <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={() => {
                if (page_switch_isSelect) {
                    this.setState({page_switch_isSelect: false}, () => this.hide());
                } else {
                    this.setState({page_switch_isSelect: true}, () => this.show());
                }
                if (typeof props.onPress === 'function') return props.onPress(!page_switch_isSelect);
            }}>
                <View style={[styles.outView, {
                    width: props.width ?? this.width,
                    backgroundColor: props.bgColor ?? this.bgColor,

                }]}>
                    <Animated.View
                        style={{
                            ...styles.innerView,
                            backgroundColor: props.color ?? this.color,
                            opacity: page_switch_an_opacity,
                            borderColor: props.color ?? this.color,
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
        height: 8,
        marginVertical: 16,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0)',
        // overflow: 'hidden',
        position: 'relative',
    },
    innerView: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 6,
    },
    roundView: {
        width: 24,
        height: 24,
        borderRadius: 22,
        borderWidth: .5,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        position: 'absolute',
        top: -10,
    }
});
