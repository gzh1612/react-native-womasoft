import redux from '../../data-storage/redux';
import storage from '../../data-storage/storage';

const timeout = 'timeout';              //超时时间
const requestStatus = 'requestStatus';  //错误状态处理
const requestType = 'requestType';      //默认类型，用于可切换式API
const authStorage = 'authStorage';      //权限存储
const authType = 'authType';            //权限类型

const requestLog = 'requestLog';        //log

//权限
const auth = {
    token: 'token',
    session: 'session',
};

/**
 * 初始化
 * @param params
 * timeout      错误时间
 * type         初始化类型
 * authType     权限类型
 * authStorage  权限存储
 * log          显示 log
 */
const init = (params) => {
    if (!params || typeof params !== 'object') params = {};
    redux.add(requestStatus, {});                   //初始化错误状态
    redux.add(timeout, params.timeout ?? 60000);    //初始化超时时间
    redux.add(requestType, params.type ?? '');      //初始化类型
    //权限
    redux.add(authType, params['authType'] ?? auth.token);
    redux.add(authStorage, params['authStorage'] ?? '');
    storage.get(authStorage).then(res => {
        if (res) redux.update(authStorage, res);
    });

    redux.add(requestLog, params['log'] ?? false);  //log
};

//获取权限类型
const getAuthType = () => redux.get(authType);
//获取权限存储
const getAuthStorage = () => redux.get(authStorage);
//获取默认类型
const getType = () => redux.get(requestType);
//获取超时时间
const getTimeout = () => redux.get(timeout);

const getLog = () => redux.get(requestLog);

//写入权限类型
const setAuthType = (val) => {
    redux.update(authType, val);
};
//写入权限存储
const setAuthStorage = (val) => {
    redux.update(authStorage, val);
    storage.set(authStorage, val);
};
//写入类型
const setType = (val) => {
    redux.update(requestType, val);
};
//写入权限存储
const setTimeout = (val) => {
    redux.update(timeout, val);
};

/**
 * 初始化 请求状态处理
 * @param code 请求返回status
 * @param func
 * @constructor
 */
const setStatus = (code, func) => {
    if (typeof code !== 'number' && typeof code !== 'string') return console.warn('StatusInit 中 code 不是number | string 类型');
    let status = redux.get(requestStatus);
    if (!status) return;
    if (status[code] === code) return console.warn(`StatusInit 已初始化请求状态 ${code}`);
    status[code] = func;
    redux.update(requestStatus, status);
};

const getStatus = () => redux.get(requestStatus);

export default {
    //基础配置
    timeout,
    requestStatus,
    requestType,
    // authVerify,
    authStorage,
    auth,

    //方法
    init,
    getAuthType,
    setAuthType,
    getAuthStorage,
    setAuthStorage,
    getType,
    setType,
    getTimeout,
    setTimeout,
    getLog,

    getStatus,
    setStatus,

}
