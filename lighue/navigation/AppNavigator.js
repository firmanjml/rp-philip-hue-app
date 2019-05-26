import { createAppContainer, createStackNavigator } from 'react-navigation';
import createUserNameScreen from '../screens/viewUserName';
import ControlBulbScreen from '../screens/Light/ControlBulb';
import DefaultScreen from '../screens/Rooms/DefaultScreen';
import TestScreen from '../screens/TestScreen';

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
    }
  },
  {
    initialRouteName: "ListRoom",
    headerMode: 'none'
  }
);

const SetupNavigator = createAppContainer(SetupNavigatorApp);

export default SetupNavigator;