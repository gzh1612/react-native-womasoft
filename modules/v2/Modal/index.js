import React from "react";
import {View, TextInput} from "react-native";
import init from './init';
import Redux from "../Redux";
import Page from "../Page";
import Theme from "../Theme";
import Tools from "../Tools";
import Language from "../Language";

export default class Modal {
    #css = new Theme().get();
    #lang = new Language().all('framework') ?? {};
    #type = init.type;                  // 缓存的数据类型
    #data = init.data;                  // 数据

    #btnLineColor = `#e1e1e1`;          //线条颜色

    #widthRatio = init.widthRatio;      //modal 宽度比例

    //根据名称获取配置
    #getName = (name) => {
        const res = new Redux().get(this.#type);
        return res.find(m => m.name === name);
    }

    //获取配置title
    #getTitle = (value, style) => {
        if (!style) style = {};
        let titleView = <View style={{height: 15}}/>;
        if (typeof value === "number") value = value.toString();
        if (typeof value === "string")
            titleView = <Page.Text text={value} size={16} lineHeight={30} color={style.color ?? '#666'}
                                   style={{textAlign: 'center', fontWeight: 'bold', marginTop: 15}}/>;
        else if (typeof value === "object") titleView = value;
        return <View style={[{
            width: this.#css.width * this.#widthRatio,
        }, style]}>{titleView}</View>
    };
    //获取配置content
    #getContent = (value, style, textStyle) => {
        if (!textStyle) textStyle = {};
        let contentView = <View/>;
        if (typeof value === "string")
            contentView = <Page.Text text={value} lineHeight={textStyle.lineHeight ?? 24}
                                     color={textStyle.color ?? '#666'}/>;
        else if (typeof value === "object") contentView = value;
        return <View style={[
            this.#css.colStartCenter,
            {maxHeight: this.#css.height - 200, padding: 15},
            style ?? {},
        ]}>{contentView}</View>
    }
    //获取配置btn
    #getBtn = (data, direction) => {
        if (!data) return <View/>;
        const itemView = (arr) => {
            const width = direction === Modal.type.row ? (this.#css.width * this.#widthRatio) / arr.length : (this.#css.width * this.#widthRatio);
            return arr.map((item, key) => {
                let params = {};
                if (key > 0) {
                    if (direction === Modal.type.row) params.btn = {
                        borderLeftWidth: 0.5,
                        borderLeftColor: this.#btnLineColor
                    };
                    else params.btn = {borderTopWidth: 0.5, borderTopColor: this.#btnLineColor};
                }
                return <Page.Text key={key} text={item.text ?? ''} width={width}
                                  lineHeight={48} color={item.color ?? '#666'}
                                  style={[{backgroundColor: item.bg ?? '#fff', textAlign: 'center'}, params.btn ?? {}]}
                                  onPress={() => {
                                      this.hide();
                                      setTimeout(() => {
                                          if (typeof item.onPress === "function") item.onPress();
                                      }, 1);
                                  }}/>
            })
        };
        let btnStyle = {
            borderWidth: 1,
            borderColor: '#fff',
            borderTopColor: this.#btnLineColor,
            overflow: 'hidden',
            borderBottomStartRadius: 8,
            borderBottomEndRadius: 8
        };
        if (direction === Modal.type.row) btnStyle = {...btnStyle, ...this.#css.rowAroundCenter};
        else btnStyle = {...btnStyle, ...this.#css.colAroundCenter};

        return <View style={[btnStyle]}>{itemView(data)}</View>
    }

    //名称
    static names = {
        alert: 'alert',
        confirm: 'confirm',
        confirmPwd: 'confirmPwd',
    }

    //方向
    static type = {
        row: 'row',     //行
        col: 'col',     //列
    };
    //按钮id
    static id = {
        one: 'one',
        two: 'two',
        three: 'three',
        four: 'four',
        five: 'five',
    }

    /**
     * name 配置文件的name
     * btn  按钮 [{id|text|color|bg}]     id和text 必须
     * @param params
     */
    constructor(params) {
        if (!params) params = {};
        if (params.name) this.nameData = params.name;
        if (params.btn) this.btn = params.btn;
    }

    init(params) {
        if (!params || (typeof params === "object" && params.length <= 0)) params = [];
        const alert = params.find(m => m.name === Modal.names.alert);
        const confirm = params.find(m => m.name === Modal.names.confirm);
        const confirmPwd = params.find(m => m.name === Modal.names.confirmPwd);
        if (!alert) params.push({
            name: Modal.names.alert, type: Modal.type.row,
            btn: [{id: Modal.id.one, text: this.#lang['btn_sure'] ?? '确定'}]
        });
        if (!confirm) params.push({
            name: Modal.names.confirm, type: Modal.type.row,
            btn: [
                {id: Modal.id.one, text: this.#lang['btn_sure'] ?? '确定'},
                {id: Modal.id.two, text: this.#lang['btn_cancel'] ?? '取消'},
            ]
        });
        if (!confirmPwd) params.push({
            name: Modal.names.confirmPwd, type: Modal.type.row,
            btn: [
                {id: Modal.id.one, text: this.#lang['btn_sure'] ?? '确定'},
                {id: Modal.id.two, text: this.#lang['btn_cancel'] ?? '取消'},
            ]
        });

        new Redux().add(this.#type, params ?? {});
        new Redux().add(this.#data, {});
    }

    show(content, func) {
        const names = this.nameData ?? Modal.names.start;
        const nameData = this.#getName(names);
        if (!nameData) return console.warn(`Modal show 自定义方法:${this.nameData}，未找到`);
        const btn = this.btn ?? nameData.btn ?? [];
        btn.map(item => item.onPress = () => typeof func === "function" ? func(Tools.copy(item)) : undefined);
        new Redux().update(this.#data, {
            type: 1,
            title: this.#getTitle(nameData.title, nameData.titleStyle),
            content: this.#getContent(content, nameData.contentStyle, nameData['contentTextStyle']),
            btn: this.#getBtn(btn, nameData.type),
        })
    }

    hide() {
        new Redux().update(this.#data, {
            type: 0,
        })
    }

    alert(content, func) {
        const nameData = this.#getName(Modal.names.alert);
        const btn = nameData.btn ?? [];
        btn.map(item => item.onPress = () => typeof func === "function" ? func(Tools.copy(item)) : undefined);
        new Redux().update(this.#data, {
            type: 1,
            title: this.#getTitle(nameData.title, nameData.titleStyle),
            content: this.#getContent(content, nameData.contentStyle, nameData['contentTextStyle']),
            btn: this.#getBtn(btn, nameData.type),
        })
    }

    confirm(content, func) {
        const nameData = this.#getName(Modal.names.confirm);
        const btn = nameData.btn ?? [];
        btn.map(item => item.onPress = () => typeof func === "function" ? func(Tools.copy(item)) : undefined);
        new Redux().update(this.#data, {
            type: 1,
            title: this.#getTitle(nameData.title, nameData.titleStyle),
            content: this.#getContent(content, nameData.contentStyle, nameData['contentTextStyle']),
            btn: this.#getBtn(btn, nameData.type),
        })
    }

    confirmPwd(func) {
        const nameData = this.#getName(Modal.names.confirmPwd);
        const btn = nameData.btn ?? [];
        let password = '';
        const content = <TextInput style={{
            width: this.#css.width - 15 * 10, height: 40,
            paddingHorizontal: 15, color: '#808080',
            borderWidth: 1, borderColor: '#e1e1e1',
            borderRadius: 5, backgroundColor: '#fff',
        }} password={true} secureTextEntry={true} autoFocus={true} onChangeText={pwd => password = pwd.toString()}/>;
        btn.map(item => item.onPress = () => typeof func === "function" ? func(Tools.copy({
            ...item, password
        })) : undefined);
        new Redux().update(this.#data, {
            type: 1,
            title: this.#getTitle(nameData.title, nameData.titleStyle),
            content: this.#getContent(content, nameData.contentStyle, nameData['contentTextStyle']),
            btn: this.#getBtn(btn, nameData.type),
        })
    }

    isOne(res) {
        return res.id && res.id === Modal.id.one
    }

    isTwo(res) {
        return res.id && res.id === Modal.id.two
    }

    isThree(res) {
        return res.id && res.id === Modal.id.three
    }

    isFour(res) {
        return res.id && res.id === Modal.id.four
    }

    isFive(res) {
        return res.id && res.id === Modal.id.five
    }
}
