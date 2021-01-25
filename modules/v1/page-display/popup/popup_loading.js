import React from 'react';
import {View, ActivityIndicator} from 'react-native';

import Loading from './init_loading';
import redux from "../../data-storage/redux";

//显示
const show = (content) => {
    redux.update(Loading.reduxName, {
        display: true,
        content: content ?? ''
    });
};

//隐藏
const hide = () => {
    redux.update(Loading.reduxName, {
        display: false,
    });
};

//写入文字
const write = (shortContent = '', icon) => {
    redux.update(Loading.reduxName, {
        write: true,
        content: shortContent,
        icon: icon,
    });
};

//小loading
const small = (style = {}) => {
    if (!style.color) style.color = '#808080';
    if (!style.marginTop && style.marginTop !== 0) style.marginTop = 20;
    if (!style.marginBottom && style.marginBottom !== 0) style.marginBottom = 20;
    return <View style={style}>
        <ActivityIndicator size={'small'} color={style.color}/>
    </View>
};

export default {
    show,
    hide,
    write,
    small,
};
