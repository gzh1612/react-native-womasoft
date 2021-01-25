import tools from '../tools';
import requestTools from './tools';


const Get = (url, body, isAuth = false, params = {}) => {
    let data = {method: 'get', url, body, isAuth};
    if (params.contentType) data.contentType = params.contentType;
    return dataRequestParams(data);
};

const Post = (url, body, isAuth = false, params = {}) => {
    let data = {method: 'post', url, body, isAuth};
    if (params.contentType) data.contentType = params.contentType;
    return dataRequestParams(data);
};

const Put = (url, body, isAuth = false, params = {}) => {
    let data = {method: 'put', url, body, isAuth};
    if (params.contentType) data.contentType = params.contentType;
    return dataRequestParams(data);
};

const Delete = (url, body, isAuth = false, params = {}) => {
    let data = {method: 'delete', url, body, isAuth};
    if (params.contentType) data.contentType = params.contentType;
    return dataRequestParams(data);
};


const dataRequestParams = ({method, url, body, contentType, isAuth}) => {
    method = method.toLocaleUpperCase();
    contentType = contentType ?? 'application/json';
    if (method === 'GET') {
        url = tools.replaceUrl(url, body);
        body = undefined;
    } else {
        url = tools.replaceUrl(url, body, false);
        if (contentType.indexOf('application/json') >= 0) {
            body = JSON.stringify(body);
        } else if (contentType.indexOf('application/x-www-form-urlencoded') >= 0) {
            body = tools.jsonToSearch(body);
        } else if (contentType.indexOf('text/html') >= 0) {

        } else if (contentType.indexOf('multipart/form-data') >= 0) {
            //传入的是formData
        }
    }

    console.log(`数据请求：${url}`);
    if (requestTools.getLog()) {
        console.log(`method：${method}`);
        console.log(`body：${body}`);
        console.log(`contentType：${contentType}`);
        console.log(`isAuth：${isAuth}`);
    }

    let headerJson = {'content-type': contentType};

    //判断是否执行权限
    if (isAuth) {
        const authType = requestTools.getAuthType();        //获取权限类型
        const authStorage = requestTools.getAuthStorage();  //获取权限存储
        //判断当前权限
        if (requestTools.auth.token === authType) {
            headerJson['Authorization'] = `Bearer ${authStorage}`;
        }
        if(requestTools.getLog()) console.log(headerJson);
    }
    const headers = new Headers(headerJson);
    const params = {
        method: method,
        body: body,
        headers: headers,
    };

    //获取请求状态
    const requestStatus = requestTools.getStatus();

    //网络超时返回
    const timeoutPromise = new Promise(resolve => {
        setTimeout(() => {
            return resolve({
                code: 'SERVE_TIMEOUT',
                url: url
            })
        }, requestTools.getTimeout());
    });

    //数据请求
    const fetchPromise = new Promise((resolve, reject) => {
        fetch(url, params).then(res => {
            const status = res.status;
            if (status !== 200) {
                if (requestStatus && typeof requestStatus[status] === 'function') {
                    console.warn(`数据请求：${status}; url：${url}`, res);
                    requestStatus[status]({url, params});
                }
                return reject({code: status});
            }
            return res.json();
        }).then(res => {
            return resolve(res);
        }).catch(err => {
            console.warn(`请求出错: ${url}`);
            if (requestTools.getLog()) console.warn(err);
            //网络请求失败
            if (err.message.indexOf('Network request failed') >= 0) return resolve({
                code: 'NETWORK_FAILED',
                url: url,
            });
            //请求错误
            return resolve({
                code: 'SERVE_ERROR',
                message: err,
                url: url
            });
        });
    });

    return new Promise((resolve, reject) => {
        Promise.race([timeoutPromise, fetchPromise]).then(res => {
            if (requestTools.getLog()) console.log('fetch', res);
            if (res.code === 'NETWORK_FAILED' ||
                res.code === 'SERVE_TIMEOUT' ||
                res.code === 'SERVE_ERROR') {
                if (requestStatus && typeof requestStatus[res.code] === 'function') {
                    console.warn(`数据请求：${res.code}; url：${url}`, res);
                    requestStatus[res.code]({url, params});
                }
            } else return resolve(res);
        });
    });
};

export default {
    Get, Post, Put, Delete
}
