import init_modals from './init_modal';
import init_popup from './init_popup';
import init_loading from './init_loading';


import modal_popup from './modal_popup';
import modal_loading from './modal_loading';


import {select} from "./modal_select";
import {alert, confirm, confirmPwd} from './modal_prompt_box';

export default {
    initModal: init_modals,//初始化页面
    initPopup: init_popup,
    initLoading: init_loading,

    select,
    alert,
    confirm,
    confirmPwd,

    popup: modal_popup,
    loading: modal_loading,

};
