import { createAppContainer, createStackNavigator } from 'react-navigation';
import createUserNameScreen from '../screens/viewUserName';
import ControlBulbScreen from '../screens/Light/ControlBulb';

const SetupNavigatorApp = createStackNavigator(
  {
    createUserName: {
      screen: createUserNameScreen
    },
    ControlBulb: {
      screen : ControlBulbScreen
    }
  },
  {
    initialRouteName: "createUserName",
    headerMode: 'none'
  }
);

const SetupNavigator = createAppContainer(SetupNavigatorApp);

export default SetupNavigator;