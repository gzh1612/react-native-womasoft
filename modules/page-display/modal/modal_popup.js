import redux from '../../data-storage/redux';

import Modals from './init_modal';

const timer = 200;

const show = (data, style = {}) => {
    redux.update(Modals.reduxName, {
        type: 2,
        display: true,
        style: style,
        data: data,
    });
};

const hide = () => {
    redux.update(Modals.reduxName, {
        type: 2,
        display: false,
        style: {},
        data: null,
        onPress: null
    });
};


export {
    show, hide
}
