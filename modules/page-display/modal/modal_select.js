import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
// import language from '../language';
import theme from '../theme';

import Modals from './init_modal';
import redux from "../../data-storage/redux";

const show = (style, data) => {
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

/**
 * 初始化
 * @param arr   数据数组 [{text:'显示值',其他参数随意}]
 * @param resolve   选中返回方法，带参数
 * @param isCancel  是否显示取消按钮
 * @param params
 * @returns {*}
 * @constructor
 */
const SelectInit = (arr, params, resolve, isCancel = false) => {
    const css = theme.get();
    const style = styles(css);
    let cancelView = <View/>;
    if (!isCancel) cancelView = <TouchableOpacity activeOpacity={.5} onPress={() => hide()}>
        <Text style={style.selectItem}>取消</Text>
    </TouchableOpacity>;
    return <View style={style.selectView}>
        {itemView(arr, params, resolve)}
        {cancelView}
    </View>
};
//循环item
const itemView = (arr, params, resolve) => {
    if (arr.length <= 0) return <View/>;
    const css = theme.get();
    const style = styles(css);
    return arr.map((item, key) => {
        let text = item.text;
        if (params.text) text = item[params.text];
        return <TouchableOpacity activeOpacity={.5} key={key} onPress={() => {
            if (typeof resolve === 'function') resolve(item);
            hide();
        }}>
            <Text style={style.selectItem}>{text}</Text>
        </TouchableOpacity>
    });
};

/**
 *
 * @param arr   数据数组 [{text:'显示值',其他参数随意}]
 * @param isCancel  是否显示取消按钮
 * @param params  [text:显示字段名称]
 * @returns {Promise<>}
 */
const select = (arr, isCancel, params = {}) => {
    const css = theme.get();
    const style = styles(css);
    return new Promise((resolve, reject) => {
        if (!arr) return reject(false);
        const select = SelectInit(arr, params, res => resolve(res), isCancel);
        // Modals.show({data: select, style: style.select});
        show(style.select, select);
    });

};

//显示多
const selectMore = () => {

};


const styles = (css) => StyleSheet.create({
    select: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    selectView: {
        width: css.width - 15,
        paddingBottom: 20,
    },
    selectItem: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: css.page.border,
        borderRadius: 5,
        backgroundColor: '#fff',
        height: 50,
        lineHeight: 50,
        textAlign: 'center',
        overflow: 'hidden',
        // elevation: 5,
    },
});

export {
    select,
}
