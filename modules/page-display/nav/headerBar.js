import React from "react";
import {View} from "react-native";
import page from '../page';
import redux from '../../data-storage/redux';
import theme from '../theme';
import control from './control';


const defaultName = 'HeaderLeftName';

/**
 * 初始化
 * @param headerLeftIconName
 */
const init = ({headerLeftIconName}) => {
    const name = redux.get(defaultName);
    if (!name) {
        if (!headerLeftIconName) return console.error('初始化配置 nav init headerLeftIconName 没有值');
        redux.add(defaultName, headerLeftIconName);
    }
};

const left = (that, color = undefined, size = 18) => {
    const css = theme.get();
    let name = redux.get(defaultName);
    if (!name) return console.error('初始化 nav headerLeft 没有配置成功');
    if (!color) color = css.header.leftColor ?? '#fff';
    return <page.a onPress={() => control.back(that)}
                   style={{
                       paddingLeft: 15,
                       paddingRight: 25,
                       height: css.headerHeight,
                       flexDirection: 'row',
                       justifyContent: 'flex-start',
                       alignItems: 'center',
                   }}>
        <page.icon name={name} size={size} color={color}/>
    </page.a>
};

const headerRight = (title, rightView, leftView) => {

    return <View>

    </View>
};


export default {
    init,
    left,
}
