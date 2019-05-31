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
        height: Platform.OS === 'ios' ? theme.sizes.base * 4 : theme.sizes.base,
        backgroundColor: theme.colors.background,
        borderBottomColor: "transparent",
        elevation: 0, // for android
      },
      headerBackTitle: null,
    },
  }
);

const SetupNavigator = createAppContainer(SetupNavigatorApp);

export default SetupNavigator;
