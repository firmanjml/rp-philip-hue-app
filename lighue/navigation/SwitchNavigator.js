import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import DiscoveryNavigatorScreen from '../navigation/DiscoveryNavigator';
import AppNavigator from './AppNavigator';
import Splash from '../screens/SplashScreen/Splash';

import VerifyScreen from './Verify';

const SwitchNavigator = createSwitchNavigator(
  {
    Verify: {
      screen : VerifyScreen
    },
    DiscoveryNavigator: {
      screen: DiscoveryNavigatorScreen
    },
    AppNavigator: {
      screen: AppNavigator
    },
    SplashNavigator: {
      screen: Splash
    },
  },
  {
    initialRouteName: 'Verify',
    headerMode: 'none'
  }
);

const MainSwitchNavigator = createAppContainer(SwitchNavigator);

export default MainSwitchNavigator;