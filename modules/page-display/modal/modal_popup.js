import React from 'react';
import {} from 'react-native';

import Modals from './init_popup';
import redux from "../../data-storage/redux";

//显示
const show = (data, style) => {
    redux.update(Modals.reduxName, {
        type: 2,
        display: true,
        style: style,
        data: data,
    });
};

//隐藏
const hide = () => {
    redux.update(Modals.reduxName, {
        type: 2,
        display: false,
        style: {},
        data: null,
        onPress: null,
    })
};


module.exports = {
    show,
    hide,
};
