import initModal from './init_modal';
import initPopup from './init_popup';
import initLoading from './init_loading';


import popup from './modal_popup';
import loading from './modal_loading';


import {select} from "./modal_select";
import {alert, confirm, confirmPwd} from './modal_prompt_box';

export default {
    initModal,//初始化页面
    initPopup,
    initLoading,

    select,
    alert,
    confirm,
    confirmPwd,

    popup,
    loading,
};
