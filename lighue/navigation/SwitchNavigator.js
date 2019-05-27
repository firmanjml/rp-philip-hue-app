import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import DiscoveryNavigatorScreen from '../navigation/DiscoveryNavigator';
import AppNavigator from './AppNavigator';
import SplashNavigator from '../navigation/SplashNavigator';

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
      screen : SplashNavigator
    }
  },
  {
    initialRouteName: 'Verify',
    headerMode: 'none'
  }
);

const MainSwitchNavigator = createAppContainer(SwitchNavigator);

export default MainSwitchNavigator;