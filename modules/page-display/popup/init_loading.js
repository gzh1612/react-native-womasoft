import React, {Component} from "react";
import {View, ActivityIndicator, Animated, Text, StyleSheet} from 'react-native';

import redux from '../../data-storage/redux';
import theme from "../theme";

const reduxName = 'framework_popup_loading';


export default class popup_loading extends Component {
    constructor(props) {
        super(props);
        this.css = theme.get();
        this.styles = styles(this.css);
        this.state = {
            display: false,
            data: [],
            icon: <ActivityIndicator size={'large'} color={'#fff'}/>,
            anOpacity: new Animated.Value(0),
            textStartOpacity: new Animated.Value(0),
            textEndOpacity: new Animated.Value(1),
            textStartXY: new Animated.ValueXY({x: 0, y: 10}),
            textEndXY: new Animated.ValueXY({x: 0, y: 0}),
        };

        redux.add(reduxName, {display: false});
    }

    static reduxName = reduxName;

    componentDidMount() {
        redux.listen(reduxName, res => {
            //写入
            if (res.write) {
                let data = this.state.data;
                data.push(res.content);
                let state = {data};
                if (res.icon) state.icon = res.icon;
                return this.setState(state, () => {
                    this.textShow();
                    this.textHide();
                })
            }
            if (res.display) {
                let data = [];
                if (res.content) data = [res.content];
                this.setState({
                    display: res.display,
                    data: data,
                    icon: <ActivityIndicator size={'large'} color={'#fff'}/>,
                    anOpacity: new Animated.Value(0),
                }, () => {
                    this.render();
                    this.show();
                });
            } else {
                this.hide(() => {
                    this.setState({
                        display: res.display,
                        data: [],
                        icon: <ActivityIndicator size={'large'} color={'#fff'}/>,
                        anOpacity: new Animated.Value(0),
                    })
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

    contentView() {
        const styles = this.styles;
        const {textStartOpacity, textEndOpacity, textStartXY, textEndXY, data} = this.state;
        return data.map((item, key) => {
            if (data.length - 2 === key) return <Animated.View key={key} style={[styles.item, {
                opacity: textEndOpacity, transform: [
                    {translateX: textEndXY.x},
                    {translateY: textEndXY.y}
                ]
            }]}>
                <Text style={{
                    color: '#fff',
                    textAlign: 'center',
                }}>{item[data.length - 1]}</Text>
            </Animated.View>;
            if (data.length - 1 === key) return <Animated.View key={key} style={[styles.item, {
                opacity: textStartOpacity, transform: [
                    {translateX: textStartXY.x},
                    {translateY: textStartXY.y}
                ]
            }]}>
                <Text style={{
                    color: '#fff',
                    textAlign: 'center',
                }}>{item}</Text>
            </Animated.View>;

        });
    }

    render() {
        const styles = this.styles;
        const {anOpacity, data} = this.state;
        if (!this.state.display) return <View/>;

        let contentView = <View/>;
        if (data.length > 0) contentView = <Animated.View style={[styles.content, {opacity: anOpacity}]}>
            <Text style={{color: '#fff'}}>{data[data.length - 1]}</Text></Animated.View>;
        return <View style={styles.container}>
            <Animated.View
                style={{
                    ...styles.loading,
                    opacity: anOpacity,
                }}>
                {this.state.icon}
                <View style={styles.content}>{this.contentView()}</View>
            </Animated.View>
        </View>
    }
}


const styles = () => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loading: {
        width: 150,
        height: 150,
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
        width: 150,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    item: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

