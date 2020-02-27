import { createAppContainer, createStackNavigator } from 'react-navigation';
import Splash from '../screens/Splash'
import { theme } from '../constants';

import {Platform} from 'react-native';
const SetupNavigatorApp = createStackNavigator(
  {
    Splash: {
      screen: Splash
    }
  },
  {
    initialRouteName: "Splash",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: theme.colors.background,
        height : 10,
        elevation: 0
      },
      headerTransparent: false,
      headerLeftContainerStyle: {
        alignItems: 'center',
        marginLeft: theme.sizes.base * 2,
      }
    },
  }
);

const SetupNavigator = createAppContainer(SetupNavigatorApp);

export default SetupNavigator;
