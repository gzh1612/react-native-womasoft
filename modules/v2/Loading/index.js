import React from "react";
import {ActivityIndicator, Image, View} from "react-native";
import init from "./init";
import Redux from "../Redux";
import Page from "../Page";
import Theme from "../Theme";

export default class Loading {
    #css = new Theme().get();

    #type = init.type;          //缓存的数据类型
    #data = init.data;          //数据

    //获取图片
    #getImageChoose = (type, data, style) => {
        let resultView = undefined;
        if (Loading.type.system === type) {
            if (!style) style = {};
            resultView = <ActivityIndicator size={'large'} color={style.color ?? '#fff'}/>;
        } else if (Loading.type.icon === type) {
            if (!style) style = {};
            resultView = <Page.Icon name={data} size={style.fontSize ?? 40}
                                    color={style.color ?? '#fff'} style={style ?? {}}/>;
        } else if (Loading.type.image === type) {
            resultView = <Image source={data} style={style ?? {width: 70, height: 70}}/>;
        } else if (Loading.type.gif === type) {
            resultView = <ActivityIndicator size={'large'} color={'#fff'}/>;
        }
        return resultView;
    }

    //获取进度
    #getName = (name) => {
        const res = new Redux().get(this.#type);
        return res.find(m => m.name === name);
    }

    //类型
    static type = {
        system: 'system',       //系统默认类型
        icon: 'icon',           //icon 图标
        image: 'image',         //image 图片
        gif: 'gif',             //gif 图片
    }

    //进度 名称
    static names = {
        start: 'start',         //开始
        complete: 'complete',   //完成
        cancel: 'cancel',       //取消
        error: 'error',         //错误
    }

    constructor(name) {
        if (typeof name === 'string') this.nameData = name;
    }

    /**
     * 初始化 Loading
     *      params []
     *          name：名称
     *          type：类型
     *          value：值
     *          style：样式    不必须
     * @param params
     */
    init(params) {
        if (!params || (typeof params === "object" && params.length <= 0)) params = [];
        const start = params.find(m => m.name === Loading.names.start);
        const complete = params.find(m => m.name === Loading.names.complete);
        const cancel = params.find(m => m.name === Loading.names.cancel);
        const error = params.find(m => m.name === Loading.names.error);
        if (!start) params.push({name: Loading.names.start, type: Loading.type.system});
        if (!complete) params.push({name: Loading.names.complete, type: Loading.type.system});
        if (!cancel) params.push({name: Loading.names.cancel, type: Loading.type.system});
        if (!error) params.push({name: Loading.names.error, type: Loading.type.system});

        new Redux().add(this.#type, params ?? {});
        new Redux().add(this.#data, {});
    }

    //判断loading是否打开
    isLoading() {
        const res = new Redux().get(this.#data);
        console.log('loading-isLoading', res);
        return res.type !== 0
    }

    show(content) {
        const progressName = this.nameData ?? Loading.names.start;
        const showData = this.#getName(progressName);
        if (!showData) return console.warn(`Loading.show 方法，未找到配置名称为：${progressName} 的自定义Loading`);
        console.log('showData', showData);
        new Redux().update(this.#data, {
            type: 1,
            content: content,
            image: this.#getImageChoose(showData.type, showData.value, showData.style),
        })
    }

    hide() {
        new Redux().update(this.#data, {
            type: 0,
        })
    }

    //只更改文字
    next(content) {
        new Redux().update(this.#data, {
            type: 2,
            content: content,
        })
    }

    //框架 start
    start(content) {
        const nameData = this.#getName(Loading.names.start);
        new Redux().update(this.#data, {
            type: 1,
            content: content,
            image: this.#getImageChoose(nameData.type, nameData.value, nameData.style),
        })
    }

    //框架 cancel
    cancel(content) {
        const nameData = this.#getName(Loading.names.cancel);
        new Redux().update(this.#data, {
            type: 1,
            content: content,
            image: this.#getImageChoose(nameData.type, nameData.value, nameData.style),
        })
    }

    //框架 complete
    complete(content, func) {
        const nameData = this.#getName(Loading.names.complete);
        new Redux().update(this.#data, {
            type: 1,
            content: content,
            image: this.#getImageChoose(nameData.type, nameData.value, nameData.style),
        })
        if (typeof func === 'function') setTimeout(() => {
            this.hide();
            console.log(111);
            func();
        }, 1000);
    }

    //框架 error
    error(content) {
        const nameData = this.#getName(Loading.names.error);
        new Redux().update(this.#data, {
            type: 1,
            content: content,
            image: this.#getImageChoose(nameData.type, nameData.value, nameData.style),
        })
    }

    small(params) {
        if (!params) params = {};
        if (!params.color) params.color = '#808080';
        return <View style={[this.#css.colAroundCenter, params.style ?? {paddingVertical: 20}]}>
            <View/>
            <ActivityIndicator size={'small'} color={params.color}/>
            <View/>
        </View>
    }
}


