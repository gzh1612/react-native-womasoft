import React, {Component} from 'react';
import {View, StyleSheet, Dimensions, Animated} from 'react-native';
import theme from '../theme';
import redux from '../../data-storage/redux';


const {width} = Dimensions.get('window');
const reduxName = 'framework_popup_modal';

export default class popup_modal extends Component {
    constructor(props) {
        super(props);
        //初始化写入css
        const {css} = props;
        this.css = css ?? theme.get();
        this.styles = styles(css);

        this.state = {
            display: false,//是否显示
            style: {},//临时样式
            onPress: undefined,//点击空白处
            data: undefined,//显示数据
            anOpacity: new Animated.Value(0),
            anXY: new Animated.ValueXY({x: 0, y: 0}),
            anSelectXY: new Animated.ValueXY({x: 0, y: 100}),
        };
        this.type = 0;//类别 1:popup , 2:select

        redux.add(reduxName, {display: false});
    }

    static reduxName = reduxName;

    componentDidMount() {
        redux.listen(reduxName, res => {
            this.type = res.type;
            if (res.display) {
                this.setState({
                    display: res.display,
                    style: res.style,
                    data: res.data,
                    onPress: res.onPress,
                    anOpacity: new Animated.Value(0),
                    anXY: new Animated.ValueXY({x: 0, y: 0}),
                    anSelectXY: new Animated.ValueXY({x: 0, y: 100}),
                }, () => {
                    this.render();
                    this.show(res.type);
                });
            } else {
                this.hide(res.type, () => {
                    this.setState({
                        display: res.display,
                        style: res.style,
                        data: res.data,
                        onPress: res.onPress,
                        anOpacity: new Animated.Value(0),
                        anXY: new Animated.ValueXY({x: 0, y: 0}),
                        anSelectXY: new Animated.ValueXY({x: 0, y: 100}),
                    }, () => {
                        redux.update(reduxName, {
                            display: false,
                            style: {},
                            data: null,
                            onPress: null,
                            continue: true,//动画结束，可以继续调用
                        });
                    })
                });
            }
        });

    }

    show(type) {
        const {anOpacity, anXY, anSelectXY} = this.state;
        if (type === 1) Animated.parallel([
            Animated.timing(anXY, {
                toValue: {x: 0, y: 5},
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(anOpacity, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true
            })
        ]).start();
        else if (type === 2) Animated.parallel([
            Animated.timing(anSelectXY, {
                toValue: {x: 0, y: 0},
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

    hide(type, func) {
        const {anOpacity, anXY, anSelectXY} = this.state;
        if (type === 1) Animated.parallel([
            Animated.timing(anXY, {
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
        else if (type === 2) Animated.parallel([
            Animated.timing(anSelectXY, {
                toValue: {x: 0, y: 100},
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
        if (!this.state.display) return <View/>;
        const state = this.state;
        const styles = this.styles;
        const {anOpacity, anXY, anSelectXY} = this.state;
        const x = this.type === 0 ? anXY.x : this.type === 1 ? anXY.x : anSelectXY.x;
        const y = this.type === 0 ? anXY.y : this.type === 1 ? anXY.y : anSelectXY.y;

        return <View style={[styles.container, state.style, {backgroundColor: 'rgba(0,0,0,.2)'}]}>
            <Animated.View
                style={{
                    ...styles.container, ...state.style,
                    opacity: anOpacity,
                    transform: [
                        {translateX: x},
                        {translateY: y}
                    ]
                }}
                onPress={() => {
                    if (typeof state.onPress === 'function') state.onPress();
                }}>
                {state.data}
            </Animated.View>
        </View>
    }
}


const styles = () => StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        width: width,
    }
});

