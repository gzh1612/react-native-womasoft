/*
 * action 类型
 */

export const add_data = 'add_data';
export const update_data = 'update_data';
export const remove_data = 'remove_data';


/*
 * 其它的常量
 */

// export const VisibilityFilters = {
//     SHOW_ALL: 'SHOW_ALL',
//     SHOW_COMPLETED: 'SHOW_COMPLETED',
//     SHOW_ACTIVE: 'SHOW_ACTIVE'
// };

/*
 * action 创建函数
 */

export function addData(name, params) {
    return {type: add_data, name, params}
}

export function updateData(name, params) {
    return {type: update_data, name, params}
}

export function removeData(name, params) {
    return {type: remove_data, name, params}
}
