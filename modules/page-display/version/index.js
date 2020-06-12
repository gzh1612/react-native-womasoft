import React from 'react'
import {Linking, Platform} from 'react-native'
import DeviceInfo from "react-native-device-info";
import modal from '../modal';

let downloadLink = '';

/**
 * 初始化
 * @param downloadLinkName  下载链接配置
 */
const init = (downloadLinkName = '') => {
    downloadLink = downloadLinkName;
};

//获取版本 号
const getVersion = () => DeviceInfo.getVersion();
//获取build 号
const getBuild = () => DeviceInfo.getBuildNumber();


/**
 * 判断版本信息是否有更新
 * @param serverVersion
 * @param serverBuild
 * @param appVersion
 * @param appBuild
 * @returns {boolean}
 */
const verify = (serverVersion, serverBuild, appVersion = null, appBuild = null) => {
    if (!appVersion) appVersion = getVersion();
    if (!appVersion || !serverVersion) return false;
    if (!appBuild) appBuild = getBuild();
    if (!appBuild || !serverBuild) return false;

    let appArr = appVersion.split('.'),
        serverArr = serverVersion.split('.'),
        result = false, isStop = false;
    appArr.map((item, key) => {
        const appValue = parseInt(item),
            serverValue = parseInt(serverArr[key]);
        // console.log(`开始对比 ${serverValue} : ${appValue}`);
        if (result || isStop) return;
        if (appValue > serverValue) return isStop = true;
        if (appValue < serverValue) return result = true;
    });

    if (parseInt(serverBuild) > parseInt(appBuild)) result = true;
    return result
};

/**
 * 下载
 * @param content   弹出框显示文字
 * @param isMust    是否必须更新
 * @param isLink    是否跳转链接
 * @returns {Promise<unknown>}
 */
const download = (content = '', isMust = false, isLink = false) => {
    return new Promise((resolve, reject) => {
        if (!downloadLink) console.warn('version 没有初始化 downloadLinkName 没有值');

        if (isMust) {
            modal.alert(content).then(() => {
                let isAndroid = true;
                if (Platform['OS'] === 'ios') isAndroid = false;
                if (isLink) return Linking['openURL'](downloadLink);
                return resolve(isAndroid);
            });
        } else {
            modal.confirm(content).then(() => {
                let isAndroid = true;
                if (Platform['OS'] === 'ios') isAndroid = false;
                if (isLink) return Linking['openURL'](downloadLink);
                return resolve(isAndroid);
            });
        }
    });

};

export default {
    getVersion,
    getBuild,

    init,
    verify,
    download,
}
