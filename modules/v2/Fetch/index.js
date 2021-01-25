import Redux from "../Redux";
import Storage from "../Storage";
import Tools from "../Tools";


export default class Fetch {
    constructor() {
    }

    //默认权限名称
    static authDefaultName = 'authDefaultName';

    static params = {
        log: 'framework_fetch_log',
        timeout: 'framework_fetch_timeout',                     // 超时时间
        status: 'framework_fetch_status',                       // 错误状态处理
        type: 'framework_fetch_type',                           // 默认类型，用于可切换式API
        authValue: 'framework_fetch_authorization',             // 权限存储
    };

    //内容类型
    static contentType = {
        application_json: 'application/json',
        application_www: 'application/x-www-form-urlencoded',
        text_html: 'text/html',
        form_data: 'multipart/form-data',
    };

    //权限
    static auth = {
        token: 'token',
        session: 'session',
    };

    //错误
    static status = {
        SERVE_TIMEOUT: 'SERVE_TIMEOUT',     //网络超时
        SERVE_FAILED: 'SERVE_FAILED',   //网络请求失败
        SERVE_ERROR: 'SERVE_ERROR',        //请求错误

    }

    #dataRequest = ({method, url, body, contentType, isAuth, authValue}) => {
        method = method.toLocaleUpperCase();
        contentType = contentType ?? Fetch.contentType.application_json;
        if (method === 'GET') {
            url = url.replaceOrSpliceToUrl(body);
            body = undefined;
        } else if (method === 'POST') {
            url = url.replaceWithJson(body);
            if (contentType === Fetch.contentType.application_json) {
                body = JSON.stringify(body);
            } else if (contentType === Fetch.contentType.application_www) {
                body = Tools.jsonToSearch(body);
            } else if (contentType === Fetch.contentType.text_html) {

            } else if (contentType === Fetch.contentType.form_data) {
                //传入的是formData
            }
        }
        console.log(`数据请求：${url}`);
        if (this.getIsLog()) {
            console.log(`method：${method}`);
            console.log(`body：${body}`);
            console.log(`contentType：${contentType}`);
            console.log(`isAuth：${isAuth}`);
            console.log(`authValue：${authValue}`);
        }

        let headerJson = {'content-type': contentType};
        if (isAuth) {
            authValue = typeof authValue === "undefined" ? this.getAuthValueByName(Fetch.authDefaultName) : authValue;
            if (authValue.type === Fetch.auth.token) {
                // token
                headerJson['Authorization'] = `Bearer ${authValue.value}`;
            } else if (authValue.type === Fetch.auth.session) {
                // session
            } else {
                return console.warn('fetch 出错', `权限参数type出错：${authValue.type}`)
            }
            if (this.getIsLog()) console.log(headerJson);
        }
        // headers 请求头
        const headers = new Headers(headerJson);
        // 请求状态处理
        const requestStatus = this.getStatus();
        //网络超时
        const timeoutPromise = new Promise(resolve => {
            setTimeout(() => {
                return resolve({
                    code: Fetch.status.SERVE_TIMEOUT,
                    url: url,
                })
            }, this.getTimeout());
        });
        //数据请求
        const requestPromise = new Promise((resolve) => {
            fetch(url, {method, body, headers}).then(res => {
                const {status} = res;
                if (this.getIsLog()) console.log(`数据请求：${status}; url：${url}`, res);
                if (status !== 200) {
                    if (requestStatus && typeof requestStatus[status] === "function") {
                        requestStatus[status](url, {method, body, headers});
                    }
                    return resolve({code: status.toString()});
                }
                return res.json();
            }).then(res => {
                return resolve(res);
            }).catch(err => {
                console.warn(`请求出错: ${url}`);
                if (this.getIsLog()) console.warn(err);
                //网络请求失败
                if (err.message.indexOf('Network request failed') >= 0) return resolve({
                    code: Fetch.status.SERVE_FAILED,
                    url: url,
                });
                //请求错误
                return resolve({
                    code: Fetch.status.SERVE_ERROR,
                    message: err,
                    url: url
                });
            })
        });

        return new Promise(resolve => {
            Promise.race([timeoutPromise, requestPromise]).then(res => {
                if (this.getIsLog()) console.log('fetch race', res);
                if (res.code === Fetch.status.SERVE_ERROR ||
                    res.code === Fetch.status.SERVE_FAILED ||
                    res.code === Fetch.status.SERVE_TIMEOUT) {
                    if (requestStatus && typeof requestStatus[res.code] === 'function') {
                        console.warn(`数据请求：${res.code}; url：${url}`, res);
                        requestStatus[res.code](url, {method, body, headers});
                    }
                } else resolve(res);
            });
        });
    }

    /**
     * 初始化fetch
     * @param params
     */
    init(params) {
        const redux = new Redux();
        let list = [];
        if (typeof params !== "object" && params.length <= 0) return console.log('初始化 fetch', params);
        list = list.concat(params);
        const log = params.find(n => n.name === Fetch.params.log);
        const timeout = params.find(n => n.name === Fetch.params.timeout);
        const status = params.find(n => n.name === Fetch.params.status);
        const type = params.find(n => n.name === Fetch.params.type);
        const authValue = params.find(n => n.name === Fetch.params.authValue);
        // log
        if (typeof log === "undefined") list.push({name: Fetch.params.log, value: false});
        // 超时时间
        if (typeof timeout === "undefined") list.push({name: Fetch.params.timeout, value: 60000});
        // 错误状态处理
        if (typeof status === "undefined") list.push({name: Fetch.params.status, value: {}});
        // 默认类型，用于可切换式API
        if (typeof type === "undefined") list.push({name: Fetch.params.type, value: ''});
        // 权限存储
        if (typeof authValue === "undefined") list.push({name: Fetch.params.authValue, value: []});
        console.log('fetch init', list);
        redux.adds(list);
    }

    get(url, body, params) {

    }

    post() {

    }

    put() {

    }

    delete() {

    }

    // 获取权限储存内容
    getAuthValue() {
        return new Redux().get(Fetch.params.authValue);
    }

    // 根据名称搜索权限
    getAuthValueByName(name) {
        let res = this.getAuthValue();
        return res.find(n => n.name === name);
    }

    //获取默认类型
    getType() {
        return new Redux().get(Fetch.params.type)
    }

    //获取超时时间
    getTimeout() {
        return new Redux().get(Fetch.params.timeout)
    }

    getStatus() {
        return new Redux().get(Fetch.params.status)
    }

    getIsLog() {
        return new Redux().get(Fetch.params.log)
    }

    //写入默认权限
    setAuthValue(type, value) {
        this.setAuthValueCustom(Fetch.authDefaultName, type, value);
    }

    //权限 自定义
    setAuthValueCustom(name, type, value) {
        let list = this.getAuthValue() ?? [];
        if (!name || !type) return;
        let params = list.find(n => n.name === name);
        if (params === undefined) {
            list.push({name, type, value});
        } else {
            params.type = type;
            params.value = value;
        }
        new Redux().update(Fetch.params.authValue, list);
        new Storage().setJson(Fetch.params.authValue, list);
    }

    //写入类型
    setType(value) {
        new Redux().update(Fetch.params.type, value);
    }

}
