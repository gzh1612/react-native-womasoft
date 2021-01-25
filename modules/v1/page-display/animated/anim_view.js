// import React, {Component} from 'react';
// import {Text, TouchableOpacity, View} from 'react-native';
//
// import theme from '../theme';
// import modal from '../modal';
//
// export default class anim_view extends Component {
//     constructor(props) {
//         super(props);
//         this.css = theme.get();
//         this.state = {
//             onPress: props.onPress,
//             children: props.children,
//             alert: props.alert,//弹出显示值 string类型
//             size: props.size,
//             color: props.color,
//             bgColor: props.bgColor,
//             weight: props.weight,
//             lineHeight: props.lineHeight,
//             style: props.style ?? {},
//             text: props.text,
//             line: props.line ?? false,
//             marginTop: props.t ?? props['mTop'] ?? 0,
//             marginBottom: props.b ?? props['mBottom'] ?? 0,
//             marginLeft: props['l'] ?? props['mLeft'] ?? 0,
//             marginRight: props.r ?? props['mRight'] ?? 0,
//             width: props.width,
//             log: props.log ?? false,
//         };
//     }
//
//     shouldComponentUpdate(nextProps, nextState, nextContext) {
//         if (nextProps.children === this.state.children &&
//             nextProps.color === this.state.color &&
//             nextProps.bgColor === this.state.bgColor &&
//             (JSON.stringify(nextProps.style ?? {}) === JSON.stringify(this.state.style ?? {})) &&
//             nextProps.text === this.state.text &&
//             nextProps.alert === this.state.alert &&
//             nextProps.onPress === this.state.onPress) return false;
//         this.setState({
//             children: nextProps.children ?? this.state.children,
//             color: nextProps.color ?? this.state.color,
//             bgColor: nextProps.bgColor ?? this.state.bgColor,
//             text: nextProps.text ?? this.state.text,
//             alert: nextProps.alert ?? this.state.alert,
//             style: nextProps.style ?? this.state.style,
//             onPress: nextProps.onPress ?? this.state.onPress,
//         });
//         return true;
//     }
//
//
//     render() {
//         const css = this.css;
//         const state = this.state;
//         let styles = [{
//             borderWidth: 1,
//             borderColor: 'rgba(0,0,0,0)'
//         }];
//         if (state.style.length > 0) styles = styles.concat(state.style);
//         else styles.push(state.style);
//         if (state.log) {
//             console.log(styles);
//             console.log(state);
//         }
//         let style = {};
//         if (!styles[1].fontSize) style.fontSize = state.size ?? css.font.size ?? 14;
//         if (!styles[1].fontWeight) style.fontWeight = state.weight ?? 'normal';
//         if (!styles[1].color) style.color = state.color ?? css.font.color ?? '#808080';
//         if (state.lineHeight) style.lineHeight = state.lineHeight;
//         if (state.marginTop) style.marginTop = state.marginTop;
//         if (state.marginBottom) style.marginBottom = state.marginBottom;
//         if (state.marginRight) style.marginRight = state.marginRight;
//         if (state.marginLeft) style.marginLeft = state.marginLeft;
//         if (state.width) style.width = state.width;
//         if (state.bgColor) {
//             style.backgroundColor = state.bgColor;
//             style.borderColor = state.bgColor;
//         }
//
//         styles.push(style);
//         if (state.log) {
//             console.log(styles);
//         }
//
//
//         //适配小米u 12 判断是否是中文,不是给后面加个空格
//         let reg = /^[\u4E00-\u9FA5]+$/;
//         let mi12 = '';
//         if (!reg.test(state.text)) mi12 = ' ';
//
//         //children有值
//         if (state.children) {
//             //是否省略
//             if (state.line) return <TouchableOpacity activeOpacity={.5} onPress={() => {
//                 if (state.alert) modal.alert(state.alert);
//                 if (typeof state.onPress === "function") state.onPress();
//             }}>
//                 <Text style={styles} numberOfLines={state.line}>{state.children}</Text>
//             </TouchableOpacity>;
//             return <TouchableOpacity activeOpacity={.5} onPress={() => {
//                 if (state.alert) modal.alert(state.alert);
//                 if (typeof state.onPress === "function") state.onPress();
//             }}>
//                 <View style={styles}>{state.children}</View>
//             </TouchableOpacity>
//         } else {
//             if (state.line) return <TouchableOpacity activeOpacity={.5} onPress={() => {
//                 if (state.alert) modal.alert(state.alert);
//                 if (typeof state.onPress === "function") state.onPress();
//             }}>
//                 <Text style={styles} numberOfLines={state.line}>{`${state.text ?? ''}${mi12}`}</Text>
//             </TouchableOpacity>;
//             return <TouchableOpacity activeOpacity={.5} onPress={() => {
//                 if (state.alert) modal.alert(state.alert);
//                 if (typeof state.onPress === "function") state.onPress();
//             }}>
//                 <Text style={styles}>{`${state.text ?? ''}${mi12}`}</Text>
//             </TouchableOpacity>
//         }
//     }
// }
