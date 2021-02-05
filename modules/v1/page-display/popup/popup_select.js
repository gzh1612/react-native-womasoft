import React from 'react';
import {View, ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import language from '../language';
import theme from '../theme';

import Modals from './init_modal';
import redux from "../../data-storage/redux";

//执行显示
const perform_show = (data, style) => {
    redux.update(Modals.reduxName, {
        type: 2,
        display: true,
        style: style,
        data: data,
    });
};

//执行隐藏
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
 * @param arr   数据数组
 * @param params    [text:显示字段名称,isCancel:是否显示取消按钮]
 * @param resolve   选中返回方法，带参数
 * @returns {*}
 * @constructor
 */
const SelectInit = (arr, params, resolve) => {
    const css = theme.get();
    const style = styles(css);
    const lang = language.all('modal');
    let cancelText = '取消';
    if (lang) cancelText = lang['btn_cancel'];
    let cancelView = <View/>;
    if (typeof params.isCancel !== "boolean") params.isCancel = true;
    if (params.isCancel) cancelView = <TouchableOpacity activeOpacity={.5} onPress={() => hide()}>
        <Text style={style.selectItem}>{cancelText}</Text>
    </TouchableOpacity>;
    let height = css.height * 0.7;
    let arrCount = arr.length;
    if (params.isCancel) arrCount = arrCount + 1;
    if (arrCount * 60 < height) height = arrCount * 60;

    return <View style={style.selectView}>
        <TouchableOpacity style={{width: css.width, height: css.height - height}} onPress={() => hide()}/>
        <ScrollView style={{height: height}}>
            {itemView(arr, params, resolve)}
            {cancelView}
        </ScrollView>
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
            if (typeof resolve === 'function') resolve(item, key);
            hide();
        }}>
            <Text style={style.selectItem}>{text}</Text>
        </TouchableOpacity>
    });
};

/**
 *
 * @param arr   数据数组 [{text:'显示值',其他参数随意}]
 * @param params  [text:显示字段名称, isCancel:是否显示取消按钮]
 * @returns {Promise<>}
 */
const show = (arr, params = {}) => {
    const css = theme.get();
    const style = styles(css);
    return new Promise((resolve, reject) => {
        if (!arr) return reject(false);
        const select = SelectInit(arr, params, (res, key) => resolve(res, key));
        // Modal.show({data: select, style: style.select});
        perform_show(select, style.select);
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

export default {
    show,
    hide,
}
