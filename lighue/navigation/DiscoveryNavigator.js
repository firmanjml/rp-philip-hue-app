import React from 'react';
import { Platform } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import StepScreen from '../screens/StepbyStep';
import ManualIPScreen from '../screens/DiscoveryBridge/ManualScreen';
import LinkButtonPage from '../screens/DiscoveryBridge/LinkButtonScreen';
import WelcomeScreen from '../screens/DiscoveryBridge/WelcomeScreen';

import TestScreen from '../screens/TestScreen';
import {fromRight} from 'react-navigation-transitions';
import { theme } from '../constants';

const MainNavigator = createStackNavigator(
  {
    StartPage: { screen: WelcomeScreen },
    LinkButton: { screen: LinkButtonPage },
    ManualIP: { screen: ManualIPScreen },
    StepByStep: {screen : StepScreen}
  },
  {
    initialRouteName: "StartPage",
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

const DiscoveryNavigator = createAppContainer(MainNavigator);

export default DiscoveryNavigator;