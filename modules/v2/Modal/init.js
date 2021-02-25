import React, {Component} from "react";
import {View, Animated, StyleSheet} from 'react-native';
import Theme from "../Theme";
import Redux from "../Redux";

export default class ModalInit extends Component {
    #css = new Theme().get();
    #styles = styles(this.#css);

    static data = 'framework_modal_data';
    static type = 'framework_modal_type';
    static widthRatio = 0.7;   //modal宽度比例

    constructor(props) {
        super(props);
        this.state = {
            isDisplay: false,           //是否显示
        };
    }

    componentDidMount() {
        new Redux().listen(ModalInit.data, res => {
            if (res.type === 0) {
                /**
                 * 隐藏 modal
                 */
                this.setState({
                    type: res.type,
                    isDisplay: false,
                    title: undefined,
                    content: undefined,
                    btn: undefined,
                })
            } else if (res.type === 1) {
                /**
                 * 显示 modal
                 */
                let state = {
                    type: res.type, title: res.title, direction: res.direction,
                    content: res.content, btn: res.btn
                };
                if (this.state.type !== 1) {
                    state['isDisplay'] = true;
                }
                this.setState(state);
            } else if (res.type === 2) {
                /**
                 * 只改变文字
                 */
                this.setState({
                    content: res.content
                });
            }
        });
    }

    render() {
        const css = this.#css,
            styles = this.#styles;
        const state = this.state;
        if (!state.isDisplay) return <View/>;
        //mask
        const styleMask = {};
        if (css.page.maskBg) styleMask.backgroundColor = css.page.maskBg;
        //modal View
        const styleModal = {width: ModalInit.widthRatio * css.width};
        if (!css.modal) css.modal = {};

        const titleView = state.title ?? <View/>;
        const contentView = state.content ?? <View/>;
        const btnView = state.btn ?? <View/>;

        return <View style={[styles.container, styleMask]}>
            <Animated.View style={[styles.modal, styleModal]}>
                {titleView}
                {contentView}
                {btnView}
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
        backgroundColor: 'rgba(255,255,255,.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: '#ccc',
    },
})
