import React from 'react';
import {} from 'react-native';

import Popups from './init_popup';
import redux from "../../data-storage/redux";

//显示
const show = (data, style) => {
    redux.update(Popups.reduxName, {
        type: 1,
        display: true,
        style: style,
        data: data,
    });
};

//隐藏
const hide = () => {
    redux.update(Popups.reduxName, {
        type: 2,
        display: false,
        style: {},
        data: null,
        onPress: null,
    })
};

//显示
const refresh = (data, style) => {
    redux.update(Popups.reduxName, {
        type: 3,
        display: true,
        style: style,
        data: data,
    });
};


module.exports = {
    init: Popups,
    show,
    hide,
    refresh,
};
