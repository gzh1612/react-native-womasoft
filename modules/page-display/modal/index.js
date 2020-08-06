import init from './init_modal';

import {select} from "./modal_select";
import {alert, confirm, confirmPwd} from './modal_prompt_box';

import initLoading from './init_loading';
import loading from './modal_loading';

import initPopup from './init_popup';
import popup from './modal_popup';

export default {
    init,//初始化页面

    select,

    alert,
    confirm,
    confirmPwd,

    initLoading,
    loading,

    initPopup,
    popup,
};
