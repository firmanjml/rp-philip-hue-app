import { createAppContainer, createStackNavigator } from 'react-navigation';
import StartPageScreen from '../screens/DiscoveryBridge/StartPage'
import ManualIPScreen from '../screens/DiscoveryBridge/ManualIPage'
import LinkButtonPage from '../screens/DiscoveryBridge/LinkButtonPage'

const MainNavigator = createStackNavigator(
  {
    StartPage: { screen: StartPageScreen },
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