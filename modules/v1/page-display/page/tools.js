import {BackHandler, Platform} from 'react-native';
import redux from '../../data-storage/redux';
import unmount from '../unmount';
import popup from '../popup';

const barStyle = 'barStyle';

const initBarStyle = (value) => {
    redux.add(barStyle, value);
};

const setBarStyle = (value) => {
    redux.update(barStyle, value);
};

const getBarStyle = () => {
    return redux.get(barStyle);
};

const blur = (that) => {
    if (!that) return console.warn('page.blur(this); 方法this为undefined');
    let refs = that['refs'];
    if (!refs) return;
    for (let item in refs) {
        if (refs.hasOwnProperty(item)) {
            refs[item].blur();
        }
    }
};

//页面start
const start = (that) => {
    if (!that) return;
    if (that.name) unmount.load(that.name);
    if (Platform.OS === 'android') BackHandler.addEventListener('hardwareBackPress', () => OnBackPress());
};

//页面end
const end = (that) => {
    if (!that) return;
    if (that.name) unmount.remove(that.name);
    if (Platform.OS === 'android') BackHandler.removeEventListener('hardwareBackPress', () => OnBackPress());
};

const OnBackPress = () => {
    if (popup.view.isShow()) {
        popup.view.hide();
        return true;
    }
    return false;
};

export default {
    initBarStyle,
    setBarStyle,
    getBarStyle,
    blur,
    start,
    end,
}
