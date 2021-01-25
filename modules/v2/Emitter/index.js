import {DeviceEventEmitter} from 'react-native';

export default class Emitter {
    constructor() {
    }

    set(name, value) {
        DeviceEventEmitter.emit(name, {code: 0, result: value});
    }

    get(name, success) {
        DeviceEventEmitter.addListener(name, res => {
            if (res && res.code === 0 && typeof success === "function") success(res.result)
        })
    }
}
