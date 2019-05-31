import { createAppContainer, createStackNavigator } from 'react-navigation';

import StepScreen from '../screens/StepbyStep';
import ManualIPScreen from '../screens/DiscoveryBridge/ManualScreen';
import LinkButtonPage from '../screens/DiscoveryBridge/LinkButtonScreen';
import WelcomeScreen from '../screens/DiscoveryBridge/WelcomeScreen';
import SettingDiscovery from '../screens/Setting';

import TestScreen from '../screens/TestScreen';
import { theme } from '../constants';

const MainNavigator = createStackNavigator(
  {
    StartPage: { screen: WelcomeScreen },
    LinkButton: { screen: LinkButtonPage },
    ManualIP: { screen: ManualIPScreen },
    StepByStep: {screen : StepScreen},
    SettingDiscovery : {screen : SettingDiscovery}
  },
  {
    initialRouteName: "StartPage",
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

const DiscoveryNavigator = createAppContainer(MainNavigator);

export default DiscoveryNavigator;