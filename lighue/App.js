import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import SwitchNavigator from './navigation/SwitchNavigator';
import Testing from './screens/Splash'
import { Provider } from "react-redux";
import { reduxStore, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/lib/integration/react";
import {
  MenuProvider,
} from 'react-native-popup-menu';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    persistor.flush();
    persistor.purge();
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Provider store={reduxStore}>
          <PersistGate loading={null} persistor={persistor}>
            <View style={styles.container}>
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              <MenuProvider>
                <SwitchNavigator />
              </MenuProvider>
              {/* <Testing/> */}
            </View>
          </PersistGate>
        </Provider>

      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Font.loadAsync({
        ...Icon.Ionicons.font,
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
