// import React from "react";
// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator, CardStyleInterpolators,} from '@react-navigation/stack';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
//
// import ConfTheme from '../ConfTheme';
//
//
// /**
//  * 配置App导航
//  * @param initPage
//  * @param screenList
//  * @returns {*}
//  * @constructor
//  */
// const App = (initPage, screenList) => {
//     const Stack = createStackNavigator();
//     // console.log(screenList);
//     const css = ConfTheme.get();
//     return (<NavigationContainer>
//         <Stack.Navigator
//             initialRouteName={initPage}
//             lazy={true}
//             headerMode={'screen'}
//             screenOptions={{
//                 cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,// 添加这一行会实现安卓下页面的左右切换，默认是从下到上
//                 headerTitleAlign: 'center',//标题居中
//                 headerTruncatedBackTitle: '',
//                 headerBackTitle: '',
//                 headerStyle: {
//                     backgroundColor: css.headerBgColor,
//                     textAlign: 'center',
//                 },
//                 headerTintColor: css.headerTitleColor,
//                 headerTitleStyle: {
//                     fontWeight: 'bold',
//                     fontSize: 18,
//                 },
//             }}
//         >
//             {screenList}
//         </Stack.Navigator>
//     </NavigationContainer>)
// };
//
//
// const Pages = (item) => {
//     const Stack = createStackNavigator();
//     return <Stack.Screen
//         name={item.name}
//         component={item.page}
//         options={({route}) => ({
//             title: item.title ?? route.params.title,
//             headerShown: item.headerShown ?? true
//         })}
//     />
// };
//
// export default {
//     App, Pages,
// }
