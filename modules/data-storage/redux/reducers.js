import {combineReducers} from 'redux'
import {
    add_data,
    update_data,
    remove_data,
} from './actions'

const params = (state = {}, action) => {
    let res = state[action.name];
    let data = Object.assign({}, state);
    if (!action.name) return data;
    let type = action.type;
    if (type === add_data && res) return state;
    else if (type === update_data && typeof res === 'undefined') return state;
    else if (type === remove_data && !res) return state;

    if (action.type === remove_data) delete data[action.name];
    else data[action.name] = action.params;

    return data
};


const todoApp = combineReducers({
    params
});

export default todoApp
