import init from './init_modal';

import {select, show, hide} from "./modal_select";
import {alert, confirm, confirmPwd} from './modal_prompt_box';

import initLoading from './init_loading';
import loading from './modal_loading';

export default {
    init,//初始化页面

    select,
    show,
    hide,

    alert,
    confirm,
    confirmPwd,

    initLoading,
    loading,
};
