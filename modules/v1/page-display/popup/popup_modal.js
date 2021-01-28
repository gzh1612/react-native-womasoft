import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, TextInput} from 'react-native';
import language from '../language';
import theme from '../theme';
import redux from '../../data-storage/redux';

import Modals from './init_modal';

const timer = 200;

const show = (style, data) => {
    redux.update(Modals.reduxName, {
        type: 1,
        display: true,
        style: style,
        data: data,
    });
};

const hide = () => {
    redux.update(Modals.reduxName, {
        type: 1,
        display: false,
        style: {},
        data: null,
        onPress: null
    });
};

const goOn = (func) => {
    redux.listen(Modals.reduxName, res => {
        if (res.continue && typeof func === "function") func();
    })
};

/**
 *  初始化样式
 * @param modal         模态框整体样式
 * @param title         header样式
 * @param titleText     标题样式
 * @param content       content样式
 * @param contentText   内容样式
 * @param btn           按钮总样式
 * @param btn1          按钮1样式
 * @param btn2          按钮2样式
 */
const initStyle = ({modal = {}, title = {}, titleText = {}, content = {}, contentText = {}, btns = {}, btn1 = {}, btn2 = {}}) => {
    let styles = {modal, title, titleText, content, contentText, btns, btn1, btn2};
    redux.add(`${Modals.reduxName}_style`, styles);
};

/**
 * 初始化
 * @param title
 */
const init = ({title = true}) => {
    let params = {title};
    redux.add(`${Modals.reduxName}_params`, params);
};


//初始化
const PromptInit = ({title, content, btns, isTitleShow}) => {
    const css = theme.get();
    const style = styles(css);
    const initParams = redux.get(`${Modals.reduxName}_params`) ?? {};
    const initStyle = redux.get(`${Modals.reduxName}_style`) ?? {};

    const styleModal = [style.modals, initStyle.modal],
        styleTitle = [style.title, initStyle.title],
        styleTitleText = [style.titleText, initStyle.titleText],
        styleContent = [style.content, initStyle.content],
        styleContentText = [style.contentText, initStyle.contentText],
        styleBtns = [style.btns, initStyle.btns],
        styleBtnItems = [initStyle.btn1, initStyle.btn2];

    //title 显示
    let titleView = <View/>;
    if (initParams.title || isTitleShow) {
        if (typeof title === 'string' && title) titleView = <Text style={[styleTitleText]}>{title}</Text>;
        else if (typeof title === 'object') titleView = title;
    }
    //content 显示
    let contentView = <View/>;
    if (typeof content === 'string') contentView = <Text style={[styleContentText]}>{content}</Text>;
    else if (typeof content === 'object') contentView = content;


    return <View style={styleModal}>
        <View style={[css.colAroundCenter, {minHeight: 80}]}>
            <View style={styleTitle}>{titleView}</View>
            <View style={styleContent}>{contentView}</View>
        </View>
        <View style={styleBtns}>{btnsView(btns, styleBtnItems, styleBtns)}</View>
    </View>
};

//按钮
const btnsView = (btnsArr, styleItems, styleBtn) => {
    const css = theme.get();
    const style = styles(css);
    return btnsArr.map((item, key) => {
        let border = {};
        if (key > 0) border = item.border ?? style.btnsViewBorder;
        let color = styleItems[key].color ?? styleBtn.color ?? '#666';
        return <TouchableOpacity key={key} style={[style.btnsView, border, styleItems[key]]} onPress={() => {
            if (typeof item.onPress === 'function') item.onPress();
            hide();
        }}>
            <Text style={[item.styles, {textAlign: 'center', color: color}]}>{item.text}</Text>
        </TouchableOpacity>
    });
};

//alert弹出框
const alert = (content = '', params = {title: undefined, btns: [{}]}) => {
    const css = theme.get();
    const style = styles(css);
    return new Promise((resolve => {
        //判断是否显示title
        let isTitleShow = false;
        if (params.title) isTitleShow = true;
        //多语言
        let lang = language.all('modal');
        if (!lang) lang = language.all('popup');
        //标题
        let title = params.title;
        if (typeof title === 'undefined') {
            title = '提示';
            //多语言默认标题
            if (lang) title = lang['title_tips'];
        }
        //按钮
        let btns = [];
        if (!params.btns) params.btns = [{}];
        params.btns.map(({text, style}, key) => {
            let onPress;
            if (key === 0) onPress = () => goOn(() => resolve(true));       //确定
            //判断是否设置text
            if (typeof text === 'undefined') {
                if (key === 0) text = '确定';
                if (lang) {
                    if (key === 0) text = lang['btn_sure'];
                }
            }
            btns.push({text, style, onPress})
        });
        const popup = PromptInit({title, content, btns, isTitleShow});
        show(style.modal, popup);
    }))
};

/**
 * confirm 判断
 * @param content
 * @param params
 * @returns {Promise<unknown>}
 */
const confirm = (content = '', params = {title: undefined, btns: [{}, {}]}) => {
    const css = theme.get();
    const style = styles(css);
    return new Promise((resolve, reject) => {
        //判断是否显示title
        let isTitleShow = false;
        if (params.title) isTitleShow = true;
        //多语言
        let lang = language.all('modal');
        if (!lang) lang = language.all('popup');
        //标题
        let title = params.title;
        if (typeof title === 'undefined') {
            title = '提示';
            //多语言默认标题
            if (lang) title = lang['title_tips'];
        }
        //按钮
        let btns = [];
        if (!params.btns) params.btns = [{}];
        params.btns.map(({text, style, onPress}, key) => {
            let btnPress;
            if (typeof onPress === 'function') {
                btnPress = onPress;
            } else {
                if (key === 0) {  //确定
                    btnPress = () => goOn(() => resolve(true));
                } else if (key === 1) { //取消
                    btnPress = () => goOn(() => reject(false));
                }
            }
            //判断是否设置text
            if (typeof text === 'undefined') {
                if (key === 0) text = '确定';
                else if (key === 1) text = '取消';
                if (lang) {
                    if (key === 0) text = lang['btn_sure'];
                    else if (key === 1) text = lang['btn_cancel'];
                }
            }
            btns.push({text, style, onPress: btnPress})
        });

        console.log(btns);
        const popup = PromptInit({title, content, btns, isTitleShow});
        show(style.modal, popup);
    });
};

/**
 * 密码输入modal
 * @param params
 * @returns {Promise<unknown>}
 */
const confirmPwd = (params = {title: null}) => {
    const css = theme.get();
    const style = styles(css);
    let valText = '';
    let result = {};
    result.title = params.title ?? '密码';
    //多语言
    let lang = language.all('modal');
    if (!lang) lang = language.all('popup');
    if (lang) {
        if (!params.title) result.title = lang['title_pwd'];
    }
    let contentData = <TextInput style={style.confirmPwd} password={true} secureTextEntry={true}
                                 autoFocus={true} onChangeText={text => {
        valText = text.toString()
    }}/>;

    return new Promise((resolve, reject) => {
        return confirm(contentData, {
            title: result.title, btns: [{onPress: () => goOn(() => resolve(valText))},
                {onPress: null}]
        })
    });


};

const styles = (css) => StyleSheet.create({
    modal: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modals: {
        width: css.width - 15 * 7,
        backgroundColor: '#efefef',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        // overflow: 'hidden',
        // elevation: 5,
    },
    titleText: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        height: 50,
        paddingTop: 20,
        lineHeight: 30,
        color: '#000',
    },
    content: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        maxHeight: css.height - 200,
        lineHeight: 24,
    },
    contentText: {
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0)',
    },
    btns: {
        borderTopWidth: 1,
        borderTopColor: '#e1e1e1',
        height: 50,
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
    },
    btnsView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        flexGrow: 1,
    },
    btnsViewBorder: {
        borderRightColor: '#e1e1e1',
        borderRightWidth: 1,
    },
    confirmPwd: {
        width: css.width - 15 * 10,
        height: 40,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#e1e1e1',
        borderRadius: 5,
        backgroundColor: '#fff',
        color: '#808080',
    }
});

import popup_loading from "./popup_loading";
import popup_select from "./popup_select";

export default {
    loading: popup_loading,
    popup: popup_select,
    alert,
    confirm,
    confirmPwd,
    initStyle,
    init,
}
