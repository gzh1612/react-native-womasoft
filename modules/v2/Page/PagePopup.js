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
            backgroundColor: '#fff', flex: 1, position: 'absolute',
        };
        if (params.width) style.width = this.#css.width * params.width;
        if (params.height) style.height = this.#css.height * params.height;
        // if (params.bg) style.backgroundColor = params.bg;
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
                PagePopup.hide(this.props.this, this.props.id)
            }}/>
            <View style={[style, params.style ?? {}]}>
                {data}
            </View>
        </View>
    };
    //显示
    static show = (that, id) => {
        let state = {};
        if (!id) return console.warn(`Page.Popup.show id:${id}`);
        state[`framework_popup_${id}`] = true;
        that.setState(state);
        new Navigation().show();
    };
    //隐藏
    static hide = (that, id) => {
        let state = {};
        if (!id) return console.warn(`Page.Popup.hide id:${id}`);
        state[`framework_popup_${id}`] = false;
        that.setState(state);
        new Navigation().hide();
    }
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
     */
    constructor(props) {
        super(props);
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


    render() {
        const css = this.#css,
            styles = this.#styles,
            props = this.props ?? {};
        const popupThis = props.this;
        const name = props.name;
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
        });


        return <View style={[styles.container, styleMask]}>
            <Animated.View style={[stylePopup]}>
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
