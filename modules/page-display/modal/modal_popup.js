import React from 'react';

import init_popup from './init_popup';
import redux from "../../data-storage/redux";

//显示
const show = (data, direction = 'bottom') => {
    let dir = 4;
    console.log(direction);
    if (direction === 'left') dir = 1;
    else if (direction === 'right') dir = 2;
    else if (direction === 'top') dir = 3;
    else if (direction === 'bottom') dir = 4;
    redux.update(init_popup.reduxName, {
        type: 1,
        display: true,
        style: {},
        data: data,
        direction: dir
    });
};

//隐藏
const hide = () => {
    redux.update(init_popup.reduxName, {
        type: 2,
        display: false,
        style: {},
        data: null,
        onPress: null,
    })
};

//显示
const refresh = (data, style) => {
    redux.update(init_popup.reduxName, {
        type: 3,
        display: true,
        style: style,
        data: data,
    });
};


module.exports = {
    init: init_popup,
    show,
    hide,
    refresh,
};
