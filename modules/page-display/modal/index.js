import init from './init_modal';

import {select} from "./modal_select";
import {alert, confirm, confirmPwd} from './modal_prompt_box';
import {popup} from './modal_popup';

import initLoading from './init_loading';
import loading from './modal_loading';

export default {
    init,//初始化页面

    select,
    popup,

    alert,
    confirm,
    confirmPwd,

    initLoading,
    loading,
};
