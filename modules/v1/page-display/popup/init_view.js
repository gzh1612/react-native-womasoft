import React, {Component} from 'react';
import {View, StyleSheet, Animated} from 'react-native';

import redux from '../../data-storage/redux';
import theme from "../theme";

const reduxName = 'framework_popup_view';

export default class popup_view extends Component {
    constructor(props) {
        super(props);
        //初始化写入css
        const {css} = props;
        this.css = css ?? theme.get();
        this.styles = styles(this.css);
        this.state = {
            // 1:left,2:right,3:top,4:bottom
            direction: 4,//方向
            display: false,//是否显示
            style: {},//临时样式
            onPress: undefined,//点击空白处
            data: undefined,//显示数据
            anOpacity: new Animated.Value(0),
            anXY: new Animated.ValueXY({x: 0, y: 0}),
            anSelectXY: new Animated.ValueXY({x: 0, y: 500}),
        };
        this.type = 0;//类别 1:popup , 2:select

        redux.add(reduxName, {display: false});
    }

    static reduxName = reduxName;

    componentDidMount() {
        redux.listen(reduxName, res => {
            // console.log(res);
            this.type = res.type;
            let xy = {x: 0, y: 500};
            let dir = res.direction;
            if (!dir) dir = this.state.direction;
            if (dir === 1) xy = {x: -200, y: 0};//left
            else if (dir === 2) xy = {x: 200, y: 0};//right
            else if (dir === 3) xy = {x: 0, y: -500};//top
            else if (dir === 4) xy = {x: 0, y: 500};//bottom

            if (this.type === 1) {  //show
                this.setState({
                    that: res.that,
                    display: res.display,
                    style: res.style,
                    data: res.data,
                    direction: dir,
                    onPress: res.onPress ?? undefined,
                    anOpacity: new Animated.Value(0),
                    anSelectXY: new Animated.ValueXY(xy),
                }, () => {
                    this.render();
                    this.show(res.type);
                });
            } else if (this.type === 2) {   //hide
                this.hide(() => {
                    this.setState({
                        that: {},
                        display: res.display,
                        style: res.style,
                        data: res.data,
                        onPress: res.onPress,
                        anOpacity: new Animated.Value(0),
                        anSelectXY: new Animated.ValueXY(xy),
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
        const {anOpacity, anSelectXY} = this.state;
        Animated.parallel([
            Animated.timing(anSelectXY, {
                toValue: {x: 0, y: 0},
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(anOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            })
        ]).start();
    }

    hide(func) {
        const {anOpacity, anSelectXY, direction} = this.state;
        let xy = {x: 0, y: 500};
        if (direction === 1) xy = {x: -200, y: 0};//left
        else if (direction === 2) xy = {x: 200, y: 0};//right
        else if (direction === 3) xy = {x: 0, y: -500};//top
        else if (direction === 4) xy = {x: 0, y: 500};//bottom

        Animated.parallel([
            Animated.timing(anSelectXY, {
                toValue: xy,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(anOpacity, {
                toValue: 0,
                duration: 200,
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
        const {anOpacity, anSelectXY} = this.state;
        const x = anSelectXY.x;
        const y = anSelectXY.y;

        // console.log(typeof state.data);
        // console.log(state.data);

        let children = <View/>;
        if (typeof state.data === 'function') children = state.data(this.state.that, this);
        else if (typeof state.data === 'object') children = state.data;


        return <View style={[styles.container, state.style, {backgroundColor: 'rgba(0,0,0,.2)'}]}>
            <Animated.View
                style={{
                    ...styles.container, ...state.style,
                    opacity: anOpacity,
                    transform: [
                        {translateX: x},
                        {translateY: y}
                    ]
                }}>
                {children}
            </Animated.View>
        </View>
    }
}


const styles = (css) => StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        width: css.width,
    }
});

