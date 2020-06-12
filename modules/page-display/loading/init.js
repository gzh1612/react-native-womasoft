import React, {Component} from "react";
import {View, ActivityIndicator} from 'react-native';

let _this;
export default class Loading extends Component {
    constructor(props) {
        super(props);
        _this = this;
        this.state = {
            display: false
        };
    }

    static show() {
        _this.setState({
            display: true
        })
    }

    static hide() {
        _this.setState({
            display: false
        }, function () {
        })
    }

    render() {
        if (!this.state.display) return <View/>;
        return <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.1)',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <View style={{
                width: 100,
                height: 100,
                backgroundColor: 'rgba(0,0,0,0.6)',
                opacity: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8
            }}>
                <ActivityIndicator size={'large'} color={'#fff'}/>
            </View>
        </View>
    }
}

