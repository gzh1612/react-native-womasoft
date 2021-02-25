import React, {Component} from "react";
import {View, Animated, StyleSheet} from 'react-native';
import Theme from "../Theme";
import Redux from "../Redux";

export default class PopupInit extends Component {
    #css = new Theme().get();
    #styles = styles(this.#css);

    static data = 'framework_popup_data';
    static type = 'framework_popup_type';

    constructor(props) {
        super(props);
        this.state = {
            isDisplay: false,           //是否显示
        };
    }

    componentDidMount() {
        new Redux().listen(PopupInit.data, res => {
            if (res.type === 0) {
                /**
                 * 隐藏 modal
                 */
                this.setState({
                    type: res.type,
                    isDisplay: false,
                    direction: undefined,
                    data: undefined,
                })
            } else if (res.type === 1) {
                /**
                 * 显示 modal
                 */
                let state = {
                    type: res.type,
                    title: res.title,
                    direction: res.direction,
                    data: res.data,
                };
                if (this.state.type !== 1) {
                    state['isDisplay'] = true;
                }
                this.setState(state);
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
        // if (css.page.maskBg) styleMask.backgroundColor = css.page.maskBg;

        const dataView = state.data ?? <View/>;

        return <View style={[styles.container, styleMask]}>
            <Animated.View style={[styles.popup,]}>
                {dataView}
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
        backgroundColor: 'rgba(0,0,0,0)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
    },
    popup: {
        flex: 1,
    },
})
