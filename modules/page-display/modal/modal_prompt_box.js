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
 * 初始化 alert 样式
 * @param title
 * @param content
 * @param btns
 * @param btn
 */
const initAlert = ({title, content, btn}) => {
    let style = {};
    if (title) style.title = title;
    if (content) style.content = content;
    if (btn) style.btn = btn;
    redux.add(`${Modals.reduxName}_alert`, style);
};

//初始化
const PromptInit = ({title, content, btns}) => {
    const css = theme.get();
    const style = styles(css);
    const initAlertStyle = redux.get(`${Modals.reduxName}_alert`);

    //内容
    let contentView = <View/>;
    if (typeof content === 'string')
        contentView = <Text style={style.popupContentText}>{content}</Text>;
    else contentView = content;

    let titleStyle = style.popupTitle;
    let contentStyle = style.popupContent;
    let btnStyle = style.popupBtns;
    let color = '#000';
    if (initAlertStyle && btns.length < 2) {
        if (initAlertStyle.title) titleStyle = initAlertStyle.title;
        if (initAlertStyle.content) contentStyle = initAlertStyle.content;
        if (initAlertStyle.btn) {
            btnStyle = initAlertStyle.btn;
            if (initAlertStyle.btn.color) color = initAlertStyle.btn.color;
        }
    }

    return <View style={style.popupView}>
        <Text style={titleStyle}>{title}</Text>
        <View style={contentStyle}>{contentView}</View>
        <View style={btnStyle}>{btnsView(btns, color)}</View>
    </View>
};
//按钮
const btnsView = (btnsArr, color) => {
    const css = theme.get();
    const style = styles(css);
    return btnsArr.map((item, key) => {
        let border = {};
        if (key > 0) border = item.border ?? style.btnsViewBorder;
        return <TouchableOpacity key={key} style={[style.btnsView, border]} onPress={() => {
            if (typeof item.onPress === 'function') item.onPress();
            hide();
        }}>
            <Text style={[item.styles, {textAlign: 'center', color: color}]}>{item.text}</Text>
        </TouchableOpacity>
    });
};

//alert弹出框
const alert = (content = '', params = {title: undefined, btnText: undefined}) => {
    const css = theme.get();
    const style = styles(css);
    return new Promise((resolve => {
        let title, btnText;
        if (!params.title) title = '提示';
        else title = params.title;
        let contentData = content;
        if (typeof contentData === "number") contentData = contentData.toString();
        if (!params.btnText) btnText = '确定';
        else btnText = params.btnText;

        const lang = language.all('modal');
        if (lang) {
            if (!params.title) title = lang['title_tips'];
            if (!params.btnText) btnText = lang['btn_sure'];
        }
        let btns = [{
            text: btnText,
            onPress: () => {
                goOn(() => resolve(true));
            }
        }];
        const popup = PromptInit({title, content: contentData, btns});
        show(style.popup, popup);
    }))
};

const confirm = (content = '', params = {title: undefined, btns: [{}, {}]}) => {
    const css = theme.get();
    const style = styles(css);
    return new Promise((resolve, reject) => {
        let title;
        if (!params.title) title = '提示';
        else title = params.title;
        if (!params.btns) params.btns = [{}, {}];
        let contentData = content;
        let btnDefs = [{
            text: '确定', onPress: () => {
                goOn(() => resolve());
            }
        }, {
            text: '取消', onPress: () => {
                goOn(() => reject());
            }
        }];

        params.btns.map((item, key) => {
            if (!btnDefs[key]) return;
            if (!item.text) item.text = btnDefs[key].text;
            if (typeof item.onPress !== "function") item.onPress = () => btnDefs[key].onPress();
        });

        //多语言
        const lang = language.all('modal');
        if (lang) {
            if (!params.title) title = lang['title_tips'];
            let btnTexts = [lang['btn_sure'], lang['btn_cancel']];
            params.btns.map((item, key) => {
                if (!btnDefs[key]) return;
                if (!item.text) item.text = btnTexts[key];
            });
        }

        const popup = PromptInit({title, content: contentData, btns: params.btns});
        show(style.popup, popup);
    });
};

const confirmPwd = (params = {title: null}) => {
    const css = theme.get();
    const style = styles(css);
    let valText = '';

    params.title = params.title ?? '密码';
    let contentData = <TextInput style={style.confirmPwd} password={true} secureTextEntry={true}
                                 autoFocus={true} onChangeText={text => valText = text.toString()}/>;

    return new Promise((resolve, reject) => {
        return confirm(contentData, {
            title: params.title, btns: [{onPress: () => goOn(() => resolve(valText))},
                {onPress: () => goOn(() => reject(valText))}]
        })
    });


};

const styles = (css) => StyleSheet.create({
    popup: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupView: {
        width: css.width - 15 * 7,
        backgroundColor: '#efefef',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        overflow: 'hidden',
        // elevation: 5,
    },
    popupTitle: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        height: 50,
        lineHeight: 50,
        color: '#000',
    },
    popupContent: {
        paddingBottom: 15,
        paddingHorizontal: 15,
        maxHeight: css.height - 200,
    },
    popupContentText: {
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0)',
    },
    popupBtns: {
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
        height: 40,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#e1e1e1',
        borderRadius: 5,
        backgroundColor: '#fff',
        color: '#808080',
    }
});

export {
    alert,
    confirm,
    confirmPwd,
    initAlert,
}
