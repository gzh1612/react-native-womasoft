import init from './init_modal';

import {select} from "./modal_select";
import {alert, confirm, confirmPwd} from './modal_prompt_box';
import {show, hide} from './modal_popup';

import initLoading from './init_loading';
import loading from './modal_loading';

export default {
    init,//初始化页面

    select,
    popupShow: show,
    popupHide: hide,

    alert,
    confirm,
    confirmPwd,

    initLoading,
    loading,
};
