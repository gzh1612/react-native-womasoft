import React, {Component} from "react";
import {View, ActivityIndicator, Animated, Text, StyleSheet} from 'react-native';
import Theme from "../Theme";

export default class LoadingInit extends Component {
    #css = new Theme().get();
    #styles = styles(this.#css);

    static name = 'framework_loading';

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    render() {
        const css = this.#css,
            styles = this.#styles;
        const style = {};
        // if (css.page.maskBg) style.backgroundColor = css.page.maskBg;
        return <View style={[styles.container, style]}>
            <Animated.View>

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
        zIndex: 30,
    },
    loading: {
        width: 190,
        height: 200,
    }
})
