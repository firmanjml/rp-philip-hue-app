import { createAppContainer, createStackNavigator } from 'react-navigation';
import createUserNameScreen from '../screens/viewUserName'

const SetupNavigatorApp = createStackNavigator(
  {
    createUserName: {
      screen: createUserNameScreen
    }
  },
  {
    initialRouteName: "createUserName",
    headerMode: 'none'
  }
);

const SetupNavigator = createAppContainer(SetupNavigatorApp);

export default SetupNavigator;