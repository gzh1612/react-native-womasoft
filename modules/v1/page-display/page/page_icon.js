import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {createIconSet} from "react-native-vector-icons";
import redux from '../../data-storage/redux';
import theme from '../theme';

let _this;
const iconName = 'iconJson';

class Icons extends Component {
    constructor(props) {
        super(props);
        _this = this;
        this.css = theme.get();
        this.state = {
            onPress: props.onPress,
            name: props.name,
            size: props.size,
            color: props.color,
            style: props.style,
        };
    }

    static init(iconJson) {
        if (!iconJson) return console.error('iconJson 没有值');
        let result = {};
        iconJson['glyphs'].map(function (item) {
            result[item['font_class']] = item['unicode_decimal'];
        });
        redux.add(iconName, result);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.name === this.state.name &&
            nextProps.size === this.state.size &&
            nextProps.color === this.state.color &&
            JSON.stringify(nextProps.style ?? {}) === JSON.stringify(this.state.style ?? {}) &&
            nextProps.onPress === this.state.onPress) return false;
        this.setState({
            name: nextProps.name,
            size: nextProps.size,
            color: nextProps.color,
            style: nextProps.style,
            onPress: nextProps.onPress,
        });
        return true
    }

    render() {
        const state = this.state,
            css = this.css;
        const iconJson = redux.get(iconName);
        if (!iconJson) return <View/>;

        let color = css.font.color;
        if (state.color) color = state.color;

        const IconsView = createIconSet(iconJson, 'iconfont', 'iconfont.ttf');

        if (typeof state.onPress === 'function') return <TouchableOpacity onPress={() => state.onPress()}>
            <IconsView name={state.name} size={state.size ?? 14} color={color} style={state.style ?? {}}/>
        </TouchableOpacity>;
        return <IconsView name={state.name} size={state.size ?? 14} color={color} style={state.style ?? {}}/>
    }
}

export default Icons;


