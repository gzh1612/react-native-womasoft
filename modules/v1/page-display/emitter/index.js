import {DeviceEventEmitter} from 'react-native';

const set = (name, res) => {
    DeviceEventEmitter.emit(name, {code: 0, result: res});
};

const get = (name, success) => {
    return DeviceEventEmitter.addListener(name, res => {
        if (res && res.code === 0 && typeof success === 'function')
            success(res['result']);
    });
};

export default {
    set,
    get,
};
