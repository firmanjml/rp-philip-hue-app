import { createAppContainer, createStackNavigator } from 'react-navigation';
import ControlBulbScreen from '../screens/Light/ControlBulb';
import AddRoomScreen from '../screens/Rooms/AddRoomScreen';
import EditRoomScreen from '../screens/Rooms/EditRoomScreen';
import DefaultScreen from '../screens/Rooms/DefaultScreen';
import TestScreen from '../screens/TestScreen';

import LightDemo from '../screens/LightDemoMode';
import SettingsScreen from '../screens/Setting';

import AddSchedulesScreen from '../screens/Schedules/AddSchedules'
import CategoryScreen from '../screens/Schedules/CategoryList'
import LocationScreen from '../screens/Schedules/LocationList'

import AddSceneScreen from '../screens/Scenes/Camera'

import { theme } from '../constants';

const SetupNavigatorApp = createStackNavigator(
  {
    ListRoom: {
      screen: DefaultScreen
    },
    ControlBulb: {
      screen : ControlBulbScreen
    },
    AddRoom: {
      screen : AddRoomScreen
    },
    EditRoom: {
      screen : EditRoomScreen
    },
    TestScreen: {
      screen: TestScreen
    },
    LightDemo: {
      screen : LightDemo
    },
    Settings: {
      screen : SettingsScreen
    },
    AddSchedules: {
      screen : AddSchedulesScreen
    },
    CategoryListScreen: {
      screen : CategoryScreen
    },
    LocationListScreen: {
      screen : LocationScreen
    },
    AddScenes: {
      screen : AddSceneScreen
    },
  },
  {
    initialRouteName: "ListRoom",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: 'transparent',
        opacity: 1,
        borderBottomColor: "transparent",
        elevation: 0, // for android
      },
      headerTransparent: true,
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
