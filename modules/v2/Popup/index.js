import React from "react";
import {View} from "react-native";
import init from './init';
import Redux from "../Redux";
import Page from "../Page";
import Theme from "../Theme";
import Language from "../Language";

export default class Popup {
    #css = new Theme().get();
    #lang = new Language().all('framework') ?? {};
    #type = init.type;                  // 缓存的数据类型
    #data = init.data;                  // 数据

    //根据名称获取配置
    #getName = (name) => {
        const res = new Redux().get(this.#type);
        return res.find(m => m.name === name);
    }
    //获取data
    #getData = (data, params) => {
        if (!data) data = <View/>;
        if (!params) params = {};
        console.log(params);
        const style = {
            backgroundColor: '#fff', flex: 1, position: 'absolute',
        };
        if (params.width) style.width = this.#css.width * params.width;
        if (params.height) style.height = this.#css.height * params.height;
        if (params.style) {
            if (params.style.height) style.height = params.style.height;
        }
        // if (params.bg) style.backgroundColor = params.bg;
        if (params.type === Popup.type.bottom) {
            style.left = 0;
            style.right = 0;
            style.bottom = 0;
        } else if (params.type === Popup.type.top) {
            style.left = 0;
            style.right = 0;
            style.top = 0;
        } else if (params.type === Popup.type.left) {
            style.left = 0;
            style.bottom = 0;
            style.top = this.#css.headerBarHeight;
        } else if (params.type === Popup.type.right) {
            style.bottom = 0;
            style.right = 0;
            style.top = this.#css.headerBarHeight;
        }
        return <View style={{flex: 1}}>
            <Page.Text style={{
                width: this.#css.width,
                height: this.#css.deviceHeight,
            }} onPress={() => {
                const isHide = typeof params.isHide === "boolean" ? params.isHide : true;
                console.log(isHide);
                if (isHide) this.hide()
            }}/>
            <View style={[style, params.style ?? {}]}>
                {data}
            </View>
        </View>
    };

    static InitView = init;
    //名称
    static names = {
        view: 'view',                   // view 显示
        select: 'select',               // select 选择
        tips: 'tips',                   // tips 提示框
        headerTips: 'headerTips',       // headerTips 提示框
    }
    //出现方向
    static type = {
        left: 'left',
        right: 'right',
        top: 'top',
        bottom: 'bottom',
    }
    //宽度比例
    static width = {
        30: 0.30,
        40: 0.4,
        50: 0.5,
        75: 0.75,
        100: 1,
    }
    //高度比例
    static height = {
        30: 0.30,
        40: 0.4,
        50: 0.5,
        75: 0.75,
        100: 1,
    }

    //设置headerTips 文字颜色
    static headerTipsColor = 'framework_popup_headerTips';

    /**
     *
     * @param name
     */
    constructor(name) {
        if (name) this.nameData = name;
    }

    /**
     * 初始化
     * @param params        [name|type|width|height|style]
     */
    init(params) {
        if (!params || (typeof params === "object" && params.length <= 0)) params = [];
        const view = params.find(m => m.name === Popup.names.view);
        const select = params.find(m => m.name === Popup.names.select);
        const tips = params.find(m => m.name === Popup.names.tips);
        const headerTips = params.find(m => m.name === Popup.names.headerTips);
        if (!view) params.push({
            name: Popup.names.view, type: Popup.type.bottom,
            width: Popup.width["100"], height: Popup.height["100"]
        });
        if (!select) params.push({
            name: Popup.names.select, type: Popup.type.bottom,
            width: Popup.width["100"], height: Popup.height["50"]
        });
        if (!tips) params.push({
            name: Popup.names.tips, type: Popup.type.bottom,
            width: Popup.width["100"], height: Popup.height["30"]
        });
        if (!headerTips) params.push({
            name: Popup.names.headerTips, type: Popup.type.top,
            width: Popup.width["100"], height: Popup.height["30"],
            isHide: false, hideTimer: 1500, style: {
                backgroundColor: this.#css.default.main,
                height: this.#css.header.height + this.#css.headerBarHeight
            }
        });

        new Redux().add(this.#type, params ?? {});
        new Redux().add(this.#data, {});
    }

    show(data) {
        const names = this.nameData ?? Popup.names.view;
        const nameData = this.#getName(names);
        return new Redux().update(this.#data, {
            type: 1,
            direction: nameData.type ?? Popup.type.bottom,
            data: this.#getData(data, nameData),
        })
    }

    hide() {
        return new Redux().update(this.#data, {
            type: 0,
        })
    }

    view(data) {
        const nameData = this.#getName(Popup.names.view);
        return new Redux().update(this.#data, {
            type: 1,
            direction: nameData.type ?? Popup.type.bottom,
            data: this.#getData(data, nameData),
        })
    }

    select(arr, func, params) {
        if (!params) params = {};
        const nameData = this.#getName(Popup.names.select);
        const styleBorder = {borderWidth: 0.5, borderColor: '#ccc', borderRadius: 15, overflow: 'hidden'};
        const styleLine = {borderBottomWidth: 0.5, borderBottomColor: '#ccc'};
        const itemView = () => {
            return arr.map((item, key) => {
                let itemStyle = key + 1 < arr.length ? styleLine : {};
                return <Page.Text key={key} text={item[params.text] ?? item.text} color={'#666'} lineHeight={49}
                                  style={[itemStyle, {textAlign: 'center'}]} onPress={() => {
                    if (typeof func === "function") func(key);
                    return this.hide();
                }}/>
            });
        }
        //标题
        let titleView = <Page.Text text={params.title ?? ''} lineHeight={30} color={'#666'}
                                   style={{textAlign: 'center', marginBottom: 15}}/>;
        //取消按钮
        let cancelView = <Page.Text text={this.#lang['btn_cancel'] ?? '取消'} lineHeight={49} color={'#666'}
                                    style={[styleBorder, {marginTop: 15, textAlign: 'center'}]}
                                    onPress={() => this.hide()}/>;
        if (!params.title) titleView = <View/>;
        if (typeof params.isCancel === "boolean") if (!params.isCancel) cancelView = <View/>;
        //计算滑动框高度
        let slideHeight = this.#css.height * nameData.height - 50 - 60;
        if (params.title) slideHeight = slideHeight - 40;
        if (slideHeight > arr.length * 50) slideHeight = arr.length * 50;
        const dataView = <View style={[this.#css.colBetween, {flex: 1, padding: 15}]}>
            <View style={{flex: 1, flexGrow: 1}}>
                {titleView}
                <View style={[styleBorder, {height: slideHeight}]}>
                    <Page.Slide style={[]}>
                        {itemView()}
                    </Page.Slide>
                </View>
            </View>
            {cancelView}
        </View>
        return new Redux().update(this.#data, {
            type: 1,
            direction: nameData.type ?? Popup.type.bottom,
            data: this.#getData(dataView, nameData),
        })
    }

    headerTips(data) {
        const color = new Redux().get(Popup.headerTipsColor);
        const nameData = this.#getName(Popup.names.headerTips);
        if (nameData.hideTimer) {
            setTimeout(() => {
                this.hide();
            }, nameData.hideTimer);
        }
        let dataView;
        if (typeof data === "string") dataView =
            <View style={[this.#css.rowAroundCenter, {
                marginTop: this.#css.headerBarHeight,
                height: this.#css.header.height,
                paddingHorizontal: 15,
            }]}>
                <Page.Text text={data.toString()} lineHeight={24} color={color}/>
            </View>;
        else dataView = data;
        return new Redux().update(this.#data, {
            type: 1,
            direction: nameData.type ?? Popup.type.top,
            data: this.#getData(dataView, nameData),
        })
    }

    tips(data) {
        const nameData = this.#getName(Popup.names.tips);
        return new Redux().update(this.#data, {
            type: 1,
            direction: nameData.type ?? Popup.type.bottom,
            data: this.#getData(data, nameData),
        })
    }

}
