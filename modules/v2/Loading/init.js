import React, {Component} from "react";
import {View, ActivityIndicator, Animated, Text, StyleSheet} from 'react-native';
import Theme from "../Theme";
import Redux from "../Redux";

export default class LoadingInit extends Component {
    #css = new Theme().get();
    #styles = styles(this.#css);

    static data = 'framework_loading_data';
    static type = 'framework_loading_type';

    constructor(props) {
        super(props);
        this.state = {
            isDisplay: false,           //是否显示
            anOpacity: new Animated.Value(0),
            textStartOpacity: new Animated.Value(0),
            textEndOpacity: new Animated.Value(1),
            textStartXY: new Animated.ValueXY({x: 0, y: 10}),
            textEndXY: new Animated.ValueXY({x: 0, y: 0}),
        };
    }

    componentDidMount() {
        new Redux().listen(LoadingInit.data, res => {
            // console.log(res);
            if (res.type === 0) {
                /**
                 * 隐藏loading
                 */
                this.hide(() => {
                    this.setState({
                        type: res.type,
                        isDisplay: false,
                        content: [],
                        image: undefined,
                    })
                })
            } else if (res.type === 1) {
                /**
                 * 显示loading
                 */
                let data = [];
                if (res.content) data = [res.content];
                let state = {type: res.type, content: data, image: res.image};
                if (this.state.type !== 1) {
                    state['isDisplay'] = true;
                }
                this.setState(state, () => {
                    this.show();
                    if (data.length > 0) this.textShow();
                });
            } else if (res.type === 2) {
                /**
                 * 只改变文字
                 */
                let data = this.state.content;
                data.push(res.content);
                this.setState({content: data}, () => {
                    this.textShow();
                    this.textHide();
                });
            }
        });
    }

    show() {
        const {anOpacity} = this.state;
        Animated.timing(anOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start();
    }

    hide(func) {
        const {anOpacity} = this.state;
        Animated.timing(anOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true
        }).start(() => {
            if (typeof func === "function") func();
        });
    }


    textShow() {
        const {textStartOpacity, textStartXY} = this.state;
        Animated.parallel([
            Animated.timing(textStartXY, {
                toValue: {x: 0, y: 0},
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(textStartOpacity, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true
            })
        ]).start();
    }

    textHide() {
        const {textEndOpacity, textEndXY} = this.state;
        Animated.parallel([
            Animated.timing(textEndXY, {
                toValue: {x: 0, y: 10},
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(textEndOpacity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true
            })
        ]).start();
    }

    contentView(width) {
        const styles = this.#styles;
        const {textStartOpacity, textEndOpacity, textStartXY, textEndXY, content} = this.state;
        return content.map((item, key) => {
            console.log(item);
            if (content.length - 2 === key) return <Animated.View key={key} style={[styles.item, {
                opacity: textEndOpacity,
                transform: [
                    {translateX: textEndXY.x},
                    {translateY: textEndXY.y}
                ]
            }]}>
                <Text style={styles.contentText}>{item[content.length - 1]}</Text>
            </Animated.View>
            if (content.length - 1 === key) return <Animated.View key={key} style={[styles.item, {
                opacity: textStartOpacity,
                transform: [
                    {translateX: textStartXY.x},
                    {translateY: textStartXY.y}
                ]
            }]}>
                <Text style={styles.contentText}>{item ?? ''}</Text>
            </Animated.View>
        });
    }

    render() {
        const css = this.#css,
            styles = this.#styles;
        const state = this.state;
        const {anOpacity} = this.state;
        if (!state.isDisplay) return <View/>;
        //mask
        const styleMask = {};
        if (css.page.maskBg) styleMask.backgroundColor = css.page.maskBg;
        //loading View
        const styleLoading = {width: 170, height: 175};
        if (!css.loading) css.loading = {};
        if (css.loading.width) styleLoading.width = css.loading.width;
        if (css.loading.height) styleLoading.height = css.loading.height;

        //显示图片
        const imageView = typeof state.image === "undefined" ?
            <ActivityIndicator size={'large'} color={'#fff'}/> : state.image;

        return <View style={[styles.container, styleMask]}>
            <Animated.View style={[styles.loading, styleLoading, {opacity: anOpacity}]}>
                {imageView}
                <View style={[styles.content, {width: styleLoading.width,}]}>
                    {this.contentView(styleLoading.width)}
                </View>
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
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    content: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    contentText: {
        color: '#fff',
        textAlign: 'center',
        lineHeight: 40,
        fontSize: 12,
    },
    item: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
})
