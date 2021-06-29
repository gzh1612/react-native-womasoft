import React, {Component} from 'react';
import {View, Text} from 'react-native';
import Theme from "../Theme";
import Nav from "../Navigation";

export default class PageHeader extends Component {
    #css = new Theme().get();

    constructor(props) {
        /**
         *  this
         *  log             查看log
         *  title           名称
         *  left            左侧view
         *  right           右侧view
         *  center          中间view
         *  style           header 样式
         *  bg              header 背景样式
         *  titleStyle      title 样式
         *  titleColor      title 颜色
         *  titleSize       title 大小
         *  leftColor       左侧图标样式
         *  t               marginTop
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
        if (nextProps.this !== nextState.this) props['this'] = nextProps.this;
        if (nextProps.title !== nextState.title) props['title'] = nextProps.title;
        if (nextProps.left !== nextState.left) props['left'] = nextProps.left;
        if (nextProps.right !== nextState.right) props['right'] = nextProps.right;
        if (nextProps.center !== nextState.center) props['center'] = nextProps.center;
        if (nextProps.style !== nextState.style) props['style'] = nextProps.style;
        if (nextProps.titleStyle !== nextState.titleStyle) props['titleStyle'] = nextProps.titleStyle;
        if (this.props.log) console.log('PageIcon', props);
        let i = 0;
        for (let item in props) {
            if (props.hasOwnProperty(item)) i++;
        }
        return i > 0
    }


    render() {
        const css = this.#css;
        const props = this.props ?? {};
        const pageThis = props.this ?? {};

        //header样式
        const style = {width: css.width, height: css.header.height};
        //底部线条
        if (css.header.line) {
            style.borderBottomWidth = 0.5;
            style.borderBottomColor = css.header.line;
        }
        if (css.header.bg) style.backgroundColor = css.header.bg;
        if (props.bg) style.backgroundColor = props.bg;
        if (props.t) style.marginTop = props.t;

        //title
        let title = pageThis.title;
        if (props.title) title = props.title;
        //title样式
        const titleStyle = {color: '#000', fontSize: 16, fontWeight: 'bold', ...props.titleStyle ?? {}};
        if (css.header.color) titleStyle.color = css.header.color;
        if (props.titleColor) titleStyle.color = props.titleColor;
        if (props['titleSize']) titleStyle.fontSize = props['titleSize'];

        //left
        let leftView = new Nav().headerLeft({color: props.leftColor});
        if (typeof props.left === "object") leftView = props.left;
        //right
        let rightView = <View/>;
        if (typeof props.right === "object") rightView = props.right;
        //center
        let centerView = <View/>;
        if (typeof props.center === "object") centerView = props.center;

        if (props.log) {
            console.log('PageHeader-style', style);
            console.log('PageHeader-titleStyle', titleStyle);
        }


        return <View style={[css.rowBetweenCenter, style, props.style ?? {}]}>
            <View style={{width: (css.width * 0.25)}}>
                {leftView}
            </View>
            <View style={[{flexGrow: 1, width: css.width / 2}, css.colBetweenCenter]}>
                {props.center ? centerView : <Text style={[titleStyle]}>{title}</Text>}
            </View>
            <View style={[{width: (css.width * 0.25)}, css.rowEndCenter]}>
                {rightView}
            </View>
        </View>
    }

}
