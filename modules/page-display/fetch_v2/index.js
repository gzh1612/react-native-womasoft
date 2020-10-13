import fetch from "./fetch";
import tools from "./tools";

export default {
    get: fetch.Get,
    post: fetch.Post,
    put: fetch.Put,
    delete: fetch.Delete,

    init: tools.init,
    setStatus: tools.setStatus,
    setAuthStorage: tools.setAuthStorage,
    getAuthStorage: tools.getAuthStorage,
    setAuthType: tools.setAuthType,
    setTimeout: tools.setTimeout,

    getType: tools.getType,
    setType: tools.setType,
    auth: tools.auth,
}
