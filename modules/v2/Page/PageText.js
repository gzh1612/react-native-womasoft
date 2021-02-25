import React, {Component} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import Theme from "../Theme";

export default class PageText extends Component {
    #css = new Theme().get();

    constructor(props) {
        /**
         *  log
         *  isText      否是全部是文本 默认false
         *  text        内容
         *  children    多样内容
         *  color       颜色
         *  size        大小
         *  lineHeight  行高
         *  line        显示行数并且多余的文字小数点替换
         *  width       宽度
         *  weight      粗
         *  style       样式
         *  isPress     是否可以点击  默认true
         *  onPress     点击事件
         *  t           marginTop
         *  b           marginBottom
         *  l           marginLeft
         *  r           marginRight
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
        if (nextProps.isText !== nextState.isText) props['isText'] = nextProps.isText;
        if (nextProps.text !== nextState.text) props['text'] = nextProps.text;
        if (nextProps.children !== nextState.children) props['children'] = nextProps.children;
        if (nextProps.color !== nextState.color) props['color'] = nextProps.color;
        if (nextProps.size !== nextState.size) props['size'] = nextProps.size;
        if (nextProps.lineHeight !== nextState.lineHeight) props['lineHeight'] = nextProps.lineHeight;
        if (nextProps.width !== nextState.width) props['width'] = nextProps.width;
        if (nextProps.style !== nextState.style) props['style'] = nextProps.style;
        if (nextProps.isPress !== nextState.isPress) props['isPress'] = nextProps.isPress;
        if (this.props.log) console.log('PageIcon', props);
        let i = 0;
        for (let item in props) {
            if (props.hasOwnProperty(item)) i++;
        }
        return i > 0
    }


    render() {
        const css = this.#css,
            props = this.props ?? {};
        const isText = typeof props.isText === "boolean" ? props.isText : false;
        const style = {color: css.font.color, fontSize: 14};
        if (props.color) style.color = props.color;
        if (props.size) style.fontSize = props.size;
        if (props.width) style.width = props.width;
        if (props.weight) style.weight = props.weight;
        if (props.lineHeight) style.lineHeight = props.lineHeight;
        if (props.t) style.marginTop = props.t;
        if (props.b) style.marginBottom = props.b;
        if (props['l']) style.marginLeft = props['l'];
        if (props.r) style.marginRight = props.r;
        if (props.log) console.log('PageText-style', style);

        let text = props.children ? props.children : props.text ? props.text : '';
        let textView = <Text style={[style, props.style ?? {}]}>{text}</Text>;
        if (isText) return textView;//纯文本在这里输出
        if (props.line) {   //显示几行小数点替换
            if (!style.width) style.width = css.width - 30;
            textView = <Text style={[style, props.style ?? {}]} numberOfLines={props.line}>{text}</Text>;
        }
        if (props.children) textView = <View style={[style, props.style ?? {}]}>{text}</View>
        if (typeof props.onPress === "function") {
            const isPress = typeof props.isPress === "boolean" ? props.isPress : true;
            return <TouchableOpacity activeOpacity={0.9} onPress={() => {
                if (!isPress) return;
                props.onPress();
            }}>
                {textView}
            </TouchableOpacity>
        } else return textView
    }

}
