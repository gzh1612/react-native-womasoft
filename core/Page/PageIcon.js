import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {createIconSet} from "react-native-vector-icons";
import Theme from "../Theme";
import Redux from "../Redux";
import Tools from "../Tools";

export default class PageIcon extends Component {
    #css = new Theme().get();
    static Name = 'framework_page_icon_name';
    static Init = (iconJson) => {
        if (!iconJson) return console.error('iconJson 没有值');
        let result = {};
        iconJson['glyphs'].map(function (item) {
            result[item['font_class']] = item['unicode_decimal'];
        });
        return result
    }

    constructor(props) {
        /**
         * log
         * name
         * size
         * color
         * style
         * t
         * l
         * r
         * b
         * onPress
         */
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
        if (nextProps.name !== nextState.name) props['name'] = nextProps.name;
        if (nextProps.size !== nextState.size) props['size'] = nextProps.size;
        if (nextProps.color !== nextState.color) props['color'] = nextProps.color;
        if (nextProps.t !== nextState.t) props['t'] = nextProps.t;
        if (nextProps.l !== nextState.l) props['l'] = nextProps.l;
        if (nextProps.r !== nextState.r) props['r'] = nextProps.r;
        if (nextProps.b !== nextState.b) props['b'] = nextProps.b;
        if (this.props.log) console.log('PageIcon', props);
        let i = 0;
        for (let item in props) {
            if (props.hasOwnProperty(item)) i++;
        }
        return i > 0
    }


    render() {
        const css = this.#css,
            props = this.props ?? {},
            iconJson = new Redux().get(PageIcon.Name);
        if (!iconJson) return <View/>;
        const IconsView = createIconSet(iconJson, 'iconfont', 'iconfont.ttf');
        const style = {
            color: css.font.color, fontSize: 18,
            ...props.style ?? {}
        };
        if (props.color) style.color = props.color;
        if (props.size) style.fontSize = props.size;
        if (props.t) style.marginTop = props.t;
        if (props.l) style.marginLeft = props.l;
        if (props.r) style.marginRight = props.r;
        if (props.b) style.marginBottom = props.b;
        if (props.log) console.log('PageIcon-style', style);
        if (typeof props.onPress === "function")
            return <TouchableOpacity onPress={() => props.onPress()}>
                <IconsView name={props.name} color={style.color} size={style.fontSize} style={style}/>
            </TouchableOpacity>;
        return <IconsView name={props.name} color={style.color} size={style.fontSize} style={style}/>
    }

}
