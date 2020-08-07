import React, {Component} from 'react';
import {View, StyleSheet, Dimensions, Animated} from 'react-native';
import theme from '../theme';
import redux from '../../data-storage/redux';


const {width} = Dimensions.get('window');
const reduxName = 'framework_popup';

export default class modal_popup extends Component {
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
            if (this.type === 1) {  //show
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
            } else if (this.type === 2) {   //hide
                this.hide(() => {
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
                            continue: true,
                        });
                    })
                });
            } else if (this.type === 3) {   //refresh
                this.setState({
                    style: res.style,
                    data: res.data,
                    onPress: res.onPress,
                }, () => {
                    this.render();
                    // this.show(res.type);
                });
            }
        });

    }

    show() {
        const {anOpacity, anXY, anSelectXY} = this.state;
        Animated.parallel([
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

    hide(func) {
        const {anOpacity, anXY, anSelectXY} = this.state;
        Animated.parallel([
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
        const x = anSelectXY.x;
        const y = anSelectXY.y;

        return <View style={[styles.container, state.style, {backgroundColor: 'rgba(0,0,0,.1)'}]}>
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
        zIndex: 10,
        width: width,
    }
});
