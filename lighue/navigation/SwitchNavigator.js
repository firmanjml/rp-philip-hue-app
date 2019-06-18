import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import DiscoveryNavigatorScreen from '../navigation/DiscoveryNavigator';
import AppNavigator from './AppNavigator';
import SplashNavigator from '../navigation/SplashNavigator';
import VerifyScreen from './Verify';
import AuthenticationScreen from './Authentication'
import AuthenticationSettingScreen from '../screens/AuthenticationSetting'

const SwitchNavigator = createSwitchNavigator(
  {
    Verify: {
      screen : VerifyScreen
    },
    Authenticate:{
      screen : AuthenticationScreen
    },
    AuthenticationSetting: {
      screen : AuthenticationSettingScreen
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