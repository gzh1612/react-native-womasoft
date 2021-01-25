import React, {Component} from 'react';
import {View, StyleSheet, Dimensions, Animated} from 'react-native';
import Theme from "../Theme";
import Redux from "../Redux";

export default class ModalView extends Component {
    #name = 'framework_modal';

    constructor(props) {
        super(props);
        this.css = new Theme().get();
        this.styles = styles(this.css);

        this.state = {
            isDisplay: false,     //是否显示
        }
    }

    componentDidMount() {
        const redux = new Redux();
        redux.listen(this.#name, res => {

        });
    }

    render() {
        const styles = this.styles;
        const state = this.state;
        if (!state.isDisplay) return <View/>;

        return <View style={[styles.constructor]}>

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
        zIndex: 20,
        width: css.width,
    }
});
