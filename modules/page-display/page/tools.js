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

export default {
    initBarStyle,
    setBarStyle,
    getBarStyle
}
