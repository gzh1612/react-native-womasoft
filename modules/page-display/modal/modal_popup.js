import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
// import language from '../language';
import theme from '../theme';

import Modals from './init_modal';
import redux from "../../data-storage/redux";

const show = (data, style) => {
    redux.update(Modals.reduxName, {
        type: 2,
        display: true,
        style: style,
        data: data,
    });
};

const hide = () => {
    redux.update(Modals.reduxName, {
        type: 2,
        display: false,
        style: {},
        data: null,
        onPress: null,
    })
};

const getPopupName = () => {
    return Modals.reduxName;
};

export default {
    getPopupName,
    show,
    hide,
}
