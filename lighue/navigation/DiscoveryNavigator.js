import { createAppContainer, createStackNavigator } from 'react-navigation';
import StartPageScreen from '../screens/DiscoveryBridge/StartPage'
import ManualIPScreen from '../screens/DiscoveryBridge/ManualIPage'
import LinkButtonPage from '../screens/DiscoveryBridge/LinkButtonPage'
import WelcomeScreen from '../screens/DiscoveryBridge/WelcomeScreen'
import TestScreen from '../screens/TestScreen'

const MainNavigator = createStackNavigator(
  {
    StartPage: { screen: TestScreen },
    LinkButton: { screen: LinkButtonPage},
    ManualIP : {screen : ManualIPScreen }
  },
  {
    initialRouteName: "StartPage",
    headerMode : 'none'
  }
);

const DiscoveryNavigator = createAppContainer(MainNavigator);

export default DiscoveryNavigator;