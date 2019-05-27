import { createAppContainer, createStackNavigator } from 'react-navigation';
import createUserNameScreen from '../screens/viewUserName';
import ControlBulbScreen from '../screens/Light/ControlBulb';
import DefaultScreen from '../screens/Rooms/DefaultScreen';
import TestScreen from '../screens/TestScreen';

import  { Platform } from 'react-native';
import LightDemo from '../screens/LightDemoMode';
import SettingsScreen from '../screens/Setting';

import { theme } from '../constants';
import {fromRight} from 'react-navigation-transitions';

const SetupNavigatorApp = createStackNavigator(
  {
    ListRoom: {
      screen: DefaultScreen
    },
    ControlBulb: {
      screen : ControlBulbScreen
    },
    TestScreen: {
      screen: TestScreen
    },
    LightDemo: {
      screen : LightDemo
    },
    Settings: {
      screen : SettingsScreen
    }
  },
  {
    initialRouteName: "ListRoom",
    transitionConfig: () => fromRight(),
    defaultNavigationOptions: {
      headerStyle: {
        height: Platform.OS === 'ios' ? theme.sizes.base * 4 : theme.sizes.base,
        backgroundColor: theme.colors.background,
        borderBottomColor: "transparent",
        elevation: 0, // for android
      },
      headerBackTitle: null,
      headerLeftContainerStyle: {
        alignItems: 'center',
        marginLeft: theme.sizes.base * 2,
      },
      gesturesEnabled: true,
    },
  }
);

const SetupNavigator = createAppContainer(SetupNavigatorApp);

export default SetupNavigator;
