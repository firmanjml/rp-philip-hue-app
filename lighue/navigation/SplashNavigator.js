import { Platform } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import Splash from '../screens/SplashScreen/Splash';
import { fromRight } from 'react-navigation-transitions';
import { theme } from '../constants';

const MainNavigator = createStackNavigator(
  {
    SplashPage: {
      screen: Splash
    }
  },
  {
    initialRouteName: "SplashPage",
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

const SplashNavigator = createAppContainer(MainNavigator);

export default SplashNavigator;