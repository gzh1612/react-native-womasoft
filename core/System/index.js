import React from 'react'
import {Platform} from 'react-native'
import DeviceInfo from 'react-native-device-info';
import Tools from "../Tools";

export default class System {

    static version = DeviceInfo.getVersion();
    static build = DeviceInfo.getBuildNumber();

    static BrowserUrl = 'framework_system_browserUrl';              //浏览器网址
    static DownloadUrl = 'framework_system_downloadUrl';            //下载网址
    static AppDownloadLink = 'framework_system_appDownloadLink';    //App下载链接


    constructor() {

    }

    /**
     * 是否版本更新
     * @param serveV
     * @param serveB
     * @param isAndroid
     * @param isIos
     * @returns {boolean}
     */
    isVersionToUpdate(serveV, serveB, isAndroid = true, isIos = true) {
        if (!Tools.versionContrast(serveV, serveB, System.version, System.build)) return false;
        if (Platform['OS'] === 'ios' && isIos === false) return false;
        else if (Platform['OS'] === 'android' && isAndroid === false) return false;
        return true;
    }

};
