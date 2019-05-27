import { createAppContainer, createStackNavigator } from 'react-navigation';
import Splash from '../screens/Splash'
import {fromRight} from 'react-navigation-transitions';
import { theme } from '../constants';

const SetupNavigatorApp = createStackNavigator(
  {
    Splash: {
      screen: Splash
    }
  },
  {
    initialRouteName: "Splash",
    transitionConfig: () => fromRight(),
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