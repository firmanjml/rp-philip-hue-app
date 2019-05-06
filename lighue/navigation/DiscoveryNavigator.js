import React from 'react';
import { Image, Platform, TouchableOpacity } from 'react-native';
import { createAppContainer, createStackNavigator, NavigationEvents } from 'react-navigation';

import ManualIPScreen from '../screens/DiscoveryBridge/ManualScreen'
import LinkButtonPage from '../screens/DiscoveryBridge/LinkButtonPage'
import WelcomeScreen from '../screens/DiscoveryBridge/WelcomeScreen'

import { fromRight } from 'react-navigation-transitions';
import { theme } from '../constants';

import Layout from '../constants/Layout'


const MainNavigator = createStackNavigator(
  {
    StartPage: { screen: WelcomeScreen },
    LinkButton: { screen: LinkButtonPage },
    ManualIP: { screen: ManualIPScreen }
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
      gesturesEnabled : true,
    },
  }
);

const DiscoveryNavigator = createAppContainer(MainNavigator);

export default DiscoveryNavigator;