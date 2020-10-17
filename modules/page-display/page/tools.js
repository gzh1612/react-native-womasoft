import redux from '../../data-storage/redux';

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

export default {
    initBarStyle,
    setBarStyle,
    getBarStyle,
    blur,
}
