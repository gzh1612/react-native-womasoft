import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, CardStyleInterpolators,} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const App = () => {
    const Stack = createStackNavigator();

};

/**
 * 初始化导航
 * paramsList [name | component | ]
 * @param paramsList
 * @return {*}
 */
const initNavBar = (paramsList) => {
    const Tab = createBottomTabNavigator();
    return <Tab.Navigator
        screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
                let iconName;
                if (route.name === 'Home') {
                    iconName = 'Home';
                }
                if (route.name === 'Details') {
                    iconName = 'Details';
                }
            },
        })}
        tabBarOptions={{
            activeTintColor: '#f00',
            inactiveTintColor: '#000',
        }}>
        {forTabScreen(Tab, paramsList)}
        {/*<Tab.Screen name="Home" component={HomeScreen}/>*/}
        {/*<Tab.Screen name="Details" component={DetailsScreen}/>*/}
    </Tab.Navigator>;
};

const forTabScreen = (Tab, paramsList) => {
    return paramsList.map((item, key) => {
        return <Tab.Screen name={item.name} component={item.component}/>
    });
};


export default {
    initNavBar, App,
}
