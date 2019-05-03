import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import DiscoveryNavigatorScreen from '../navigation/DiscoveryNavigator';
import AppNavigator from './AppNavigator';


const SwitchNavigator = createSwitchNavigator(
  {
    DiscoveryNavigator: {screen: DiscoveryNavigatorScreen},
    AppNavigator: {screen : AppNavigator}
    
  },
  {
    initialRouteName: "DiscoveryNavigator",
    headerMode : 'none'
  }
);

const MainSwitchNavigator = createAppContainer(SwitchNavigator);

export default MainSwitchNavigator;