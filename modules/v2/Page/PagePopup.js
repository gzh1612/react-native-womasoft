import React, {Component} from 'react';
import {View, Animated, StyleSheet} from 'react-native';
import Theme from "../Theme";
import Popup from "../Popup";
import Page from "./index";
import Navigation from "../Navigation";

export default class PagePopup extends Component {
    #css = new Theme().get();
    #styles = styles(this.#css);

    //获取data
    #getData = (data, params) => {
        if (!data) data = <View/>;
        if (!params) params = {};
        const style = {
            flex: 1, position: 'absolute', backgroundColor: '#fff'
        };
        if (params.bg) style.backgroundColor = params.bg;
        if (params.width) style.width = this.#css.width * params.width;
        if (params.height) style.height = this.#css.height * params.height;
        if (params.type === Popup.type.bottom) {
            style.left = 0;
            style.right = 0;
            style.bottom = 0;
        } else if (params.type === Popup.type.top) {
            style.left = 0;
            style.right = 0;
            style.top = 0;
        } else if (params.type === Popup.type.left) {
            style.left = 0;
            style.bottom = 0;
            style.top = this.#css.headerBarHeight;
        } else if (params.type === Popup.type.right) {
            style.bottom = 0;
            style.right = 0;
            style.top = this.#css.headerBarHeight;
        }
        return <View style={{flex: 1}}>
            <Page.Text style={{
                width: this.#css.width,
                height: this.#css.deviceHeight,
            }} onPress={() => {
                if (typeof this.props.isHide === "boolean" && this.props.isHide === false) return;
                this.hide();
            }}/>
            <View style={[style, params.style ?? {}]}>
                {data}
            </View>
        </View>
    };

    //出现方向
    static type = {
        left: 'left',
        right: 'right',
        top: 'top',
        bottom: 'bottom',
    }
    //宽度比例
    static width = {
        '30': 0.30,
        '40': 0.4,
        '50': 0.5,
        '75': 0.75,
        '100': 1,
    }
    //高度比例
    static height = {
        '30': 0.30,
        '40': 0.4,
        '50': 0.5,
        '75': 0.75,
        '100': 1,
    }

    /**
     *  log
     *  this
     *  id          //  唯一编号
     *  width       //  宽度 默认 100
     *  height      //  高度 默认 100
     *  isHide      //  是否点击隐藏
     *  bg          //  背景色
     */
    constructor(props) {
        super(props);
        if (props.this) this._this = props.this;
        if (props.id) this._id = props.id;

        //方向
        const direction = props.type ?? PagePopup.type.bottom;
        const popupThis = props.this;
        popupThis.setState({
            framework_page_popup_animated_opacity: new Animated.Value(0),
            framework_page_popup_animated_xy: new Animated.ValueXY(this.getDirectionParams(direction)),
            framework_page_popup_direction: direction,
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.log) {
            console.log('nextProps', nextProps);
            console.log('nextState', nextState);
        }
        if (!nextProps) nextProps = {};
        if (!nextState) nextState = {};
        const props = {};
        if (nextProps.this !== nextState.this) props['this'] = nextProps.this;
        if (this.props.log) console.log('PageIcon', props);
        let i = 0;
        for (let item in props) {
            if (props.hasOwnProperty(item)) i++;
        }
        return i > 0
    }

    //显示
    show() {
        const props = this.props ?? {};
        const popupThis = props.this;
        let state = {};
        if (!this._id) return console.warn(`Page.Popup.show id:${this._id}`);
        state[`framework_popup_${this._id}`] = true;
        popupThis.setState(state, () => this.animatedShow());
        new Navigation().show();
    };

    //隐藏
    hide() {
        const props = this.props ?? {};
        const popupThis = props.this;
        let state = {};
        if (!this._id) return console.warn(`Page.Popup.hide id:${this._id}`);
        state[`framework_popup_${this._id}`] = false;
        this.animatedHide(() => {
            popupThis.setState(state);
            new Navigation().hide();
        })
    }

    //获取方向动画参数
    getDirectionParams(direction) {
        let params = {};
        if (direction === 'top') params = {x: 0, y: -50};
        else if (direction === 'bottom') params = {x: 0, y: 50};
        else if (direction === 'left') params = {x: -50, y: 0};
        else if (direction === 'right') params = {x: 50, y: 0};
        console.log(params);
        return params;
    }

    animatedShow() {
        const props = this.props ?? {};
        const popupThis = props.this;
        const {framework_page_popup_animated_opacity, framework_page_popup_animated_xy} = popupThis.state;
        Animated.parallel([
            Animated.timing(framework_page_popup_animated_xy, {
                toValue: {x: 0, y: 0},
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(framework_page_popup_animated_opacity, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start();
    }


    animatedHide(func) {
        const props = this.props ?? {};
        const popupThis = props.this;
        const {
            framework_page_popup_animated_opacity,
            framework_page_popup_animated_xy,
            framework_page_popup_direction
        } = popupThis.state;
        Animated.parallel([
            Animated.timing(framework_page_popup_animated_xy, {
                toValue: this.getDirectionParams(framework_page_popup_direction),
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(framework_page_popup_animated_opacity, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start(() => func());
    }


    render() {
        const css = this.#css,
            styles = this.#styles,
            props = this.props ?? {};
        const popupThis = props.this;
        const {framework_page_popup_animated_opacity, framework_page_popup_animated_xy} = popupThis.state;
        const id = props.id;
        if (!id) console.warn(`Page.Popup id:${id}`);
        let isDisplay = popupThis.state[`framework_popup_${id}`];
        if (typeof isDisplay !== "boolean") isDisplay = false;
        if (!isDisplay) return <View/>;
        const styleMask = {};
        if (css.page.maskBg) styleMask.backgroundColor = css.page.maskBg;
        if (!css.popup) css.popup = {};
        if (css.popup.maskBg) styleMask.backgroundColor = css.popup.maskBg;
        //popup View
        const stylePopup = {flex: 1};

        let children = this.#getData(props.children ?? <View/>, {
            width: props.width ?? PagePopup.width["100"],
            height: props.height ?? PagePopup.height["100"],
            type: props.type ?? PagePopup.type.bottom,
            bg: props.bg ?? '#fff',
        });

        let animatedStyle = {};
        console.log('framework_page_popup_animated_opacity', framework_page_popup_animated_opacity);
        if (framework_page_popup_animated_opacity) animatedStyle = {
            opacity: framework_page_popup_animated_opacity,
            transform: [
                {translateX: framework_page_popup_animated_xy.x},
                {translateY: framework_page_popup_animated_xy.y}
            ]
        };
        console.log(animatedStyle);
        return <View style={[styles.container, styleMask]}>
            <Animated.View style={[stylePopup, animatedStyle]}>
                {children}
            </Animated.View>
        </View>
    }

}

const styles = (css) => StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        width: css.width,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
    },
})
