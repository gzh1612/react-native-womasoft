import fetch from './fetch';

export default {
    get: fetch.Get,
    post: fetch.Post,
    put: fetch.Put,
    delete: fetch.Delete,

    init: fetch.init,
    initStatus: fetch.initStatus,

    token: fetch.token,
    setToken: fetch.setToken,
    type: fetch.type,
    getType: fetch.getType,
    setType: fetch.setType,
    setTime: fetch.setTime,
}
