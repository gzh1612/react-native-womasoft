import init_modal from './init_modal';
import popup_modal from "./popup_modal";
import popup_select from './popup_select';

import init_view from "./init_view";
import popup_view from "./popup_view";

import init_loading from './init_loading';
import popup_loading from "./popup_loading";

export default {
    initModal: init_modal,
    select: popup_select,
    modal: popup_modal,

    initView: init_view,
    view: popup_view,

    initLoading: init_loading,
    loading: popup_loading,
}
