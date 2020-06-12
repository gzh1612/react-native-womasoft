import {PermissionsAndroid, Platform} from 'react-native';


const WRITE_EXTERNAL_STORAGE = () => {
    return new Promise(resolve => {
        if (Platform.OS === 'android') return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then(res => {
            if (res !== 'granted') return false;
            return resolve(true);
        });
        if (Platform.OS === 'ios') return resolve(true);
    });
};

const CAMERA = () => {
    return new Promise(resolve => {
        if (Platform.OS === 'android') return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then(res => {
            if (res !== 'granted') return false;
            return resolve(true);
        });
        if (Platform.OS === 'ios') return resolve(true);
    });
};

const RECORD_AUDIO = () => {
    return new Promise(resolve => {
        if (Platform.OS === 'android') return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO).then(res => {
            if (res !== 'granted') return false;
            return resolve(true);
        });
        if (Platform.OS === 'ios') return resolve(true);
    });
};

export {
    WRITE_EXTERNAL_STORAGE,
    CAMERA,
    RECORD_AUDIO,
};
