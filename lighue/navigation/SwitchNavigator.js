import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import DiscoveryNavigatorScreen from '../navigation/DiscoveryNavigator';
import AppNavigator from './AppNavigator';
import SplashNavigator from './SplashNavigator';

const SwitchNavigator = createSwitchNavigator(
  {
    DiscoveryNavigator: {
      screen: DiscoveryNavigatorScreen
    },
    AppNavigator: {
      screen: AppNavigator
    },
    SplashNavigator: {
      screen: SplashNavigator
    }

  },
  {
    initialRouteName: "DiscoveryNavigator",
    headerMode: 'none'
  }
);

const MainSwitchNavigator = createAppContainer(SwitchNavigator);

export default MainSwitchNavigator;