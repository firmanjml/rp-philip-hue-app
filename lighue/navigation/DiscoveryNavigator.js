import { createAppContainer, createStackNavigator } from 'react-navigation';
import StepScreen from '../screens/StepbyStep';
import ManualIPScreen from '../screens/DiscoveryBridge/ManualScreen';
import LinkButtonPage from '../screens/DiscoveryBridge/LinkButtonScreen';
import WelcomeScreen from '../screens/DiscoveryBridge/WelcomeScreen';
import SettingDiscovery from '../screens/Settings/SettingScreen';
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

const DiscoveryNavigator = createAppContainer(MainNavigator);

export default DiscoveryNavigator;