import tools from '../tools';
import redux from '../../data-storage/redux';
import storage from '../../data-storage/storage';


const fetchStatus = 'fetchStatus';//错误状态处理
const authToken = 'authToken';//权限 token
const fetchType = 'fetchType';//默认类型，用于可切换式API
const timeout = 'timeout'; //超时时间

//初始化
const init = (params) => {
    if (!params || typeof params !== 'object') params = {};
    redux.add(fetchStatus, {});
    redux.add(timeout, params.timeout ?? 60000);
    redux.add(authToken, params.token ?? '');
    redux.add(fetchType, params.type ?? '');
    storage.get(authToken).then(res => {
        if (res) redux.update(authToken, res);
    });
    storage.get(fetchType).then(res => {
        if (res) redux.update(fetchType, res);
    })
};


/**
 * 获取token
 */
const getToken = () => redux.get(authToken);

const getType = () => redux.get(fetchType);
const getTimeout = () => redux.get(timeout);

/**
 * 写入token
 * @param token
 */
const setToken = (token) => {
    redux.update(authToken, token);
    storage.set(authToken, token);
};

const setType = (type) => {
    redux.update(fetchType, type);
    storage.set(fetchType, type);
};

const setTime = (time) => {
    redux.update(timeout, time);
};


/**
 * 初始化 请求状态处理
 * @param code 请求返回status
 * @param func
 * @constructor
 */
const initStatus = (code, func) => {
    if (typeof code !== 'number' && typeof code !== 'string') return console.warn('StatusInit 中 code 不是number | string 类型');
    let status = redux.get(fetchStatus);
    if (!status) return;
    if (status[code] === code) return console.warn(`StatusInit 已初始化请求状态 ${code}`);
    status[code] = func;
    redux.update(fetchStatus, status);
};

const verifyToken = (isToken) => {
    return new Promise((resolve) => {
        if (typeof isToken === 'function') return resolve(isToken());
        if (!isToken) return resolve(undefined);
        const timerOut = setTimeout(() => {
            clearInterval(authInterval);
            console.warn('无法获取token');
            return resolve('');
        }, 10000);
        const authInterval = setInterval(() => {
            // console.log('我执行了 getToken');
            const token = redux.get(authToken);
            if (token === undefined || token === null) return;
            clearInterval(authInterval);
            clearTimeout(timerOut);
            return resolve(token)
        }, 500);
    });
};

const Get = (url, body, contentType, isToken = false) => {
    return verifyToken(isToken).then(token => {
        return dataRequestParams('get', url, body, contentType, token)
    });
};

const Post = (url, body, contentType, isToken = false) => {
    return verifyToken(isToken).then(token => {
        return dataRequestParams('post', url, body, contentType, token)
    });
};

const Put = () => {

};

const Delete = () => {

};


/**
 * 请求 / 数据处理
 * @param method 请求方法 【 get | post | put | delete 】
 * @param url   请求地址
 * @param body  请求参数
 * @param contentType   请求类型
 * @param token
 * @returns {Promise<unknown>}
 */
const dataRequestParams = (method, url, body, contentType, token) => {
    method = method.toLocaleUpperCase();
    contentType = contentType ?? 'application/json';
    switch (method) {
        case 'GET':
            url = tools.replaceUrl(url, body);
            body = undefined;
            break;
        case 'POST':
            url = tools.replaceUrl(url, body, false);
            if (contentType.indexOf('application/json') >= 0) {
                body = JSON.stringify(body);
            } else if (contentType.indexOf('application/x-www-form-urlencoded') >= 0) {
                body = tools.jsonToSearch(body);
            } else if (contentType.indexOf('text/html') >= 0) {

            }
            break;
        case 'PUT':

            break;
        case 'DELETE':

            break;
        default:
            break;
    }

    console.log(`数据请求：${url}`);

    let headerJson = {
        'content-type': contentType,
    };
    if (token) headerJson['Authorization'] = `Bearer ${token}`;
    const headers = new Headers(headerJson);
    const init = {
        method: method,
        body: body,
        headers: headers,
    };
    return dataRequest(url, init);
};

/**
 * 数据请求
 * @param url 请求地址
 * @param init 请求初始化参数
 * @returns {Promise<unknown>}
 */
const dataRequest = (url, init) => {
    const statusManage = redux.get(fetchStatus);

    const backJson = {
        request: dataRequest,
        url: url,
        init: init,
    };

    let timerPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve({
                code: 'SERVE_TIMEOUT',
                url: url
            });
        }, getTimeout());
    });

    let fetchPromise = new Promise((resolve, reject) => {
        fetch(url, init).then(res => {
            const status = res.status;
            if (status !== 200) {
                if (statusManage && typeof statusManage[status] === 'function') {
                    console.warn(`数据请求 ${status} url:${url}`, res);
                    statusManage[status](backJson);
                }
                return reject({code: status});
            }
            return res.json();
        }).catch(err => {
            console.warn(`请求出错: ${url}`);
            console.warn(err);
            return reject({
                code: 'SERVE_ERROR',
                message: err,
                url: url
            });
        }).then(res => resolve(res));
    });

    //开始数据请求
    return new Promise((resolve, reject) => {
        Promise.race([fetchPromise, timerPromise]).then(res => {
            if (res.code === 'SERVE_TIMEOUT' || //网络超时
                res.code === 'SERVE_ERROR') {   //请求错误
                if (statusManage && typeof statusManage[res.code] === 'function') {
                    console.warn(`数据请求 ${res.code} url:${url}`, res);
                    statusManage[res.code](backJson);
                }
                return reject(res);
            } else return resolve(res);
        })
    })
};

export default {
    token: authToken,
    setToken, getToken,
    type: fetchType,
    setTime,
    getType, setType,
    init, initStatus,
    Get, Post, Put, Delete,
}
