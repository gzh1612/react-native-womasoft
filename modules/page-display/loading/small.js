import React from 'react'
import {ActivityIndicator, View} from "react-native";

const small = (style = {}) => {
    if (!style.color) style.color = '#808080';
    if (!style.marginTop) style.marginTop = 20;
    if (!style.marginBottom) style.marginBottom = 20;
    return <View style={style}>
        <ActivityIndicator size={'small'} color={style.color}/>
    </View>
};

module.exports = small;
