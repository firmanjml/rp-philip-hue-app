import React from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage} from 'react-native';
import { AppLoading } from 'expo';
import SwitchNavigator from './navigation/SwitchNavigator';
import { Provider } from "react-redux";
import { reduxStore, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/lib/integration/react";
import {
  MenuProvider,
} from 'react-native-popup-menu';
import * as Font from 'expo-font';

export default class App extends React.Component {
  state = {
    isReady : false
  };

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._loadFontAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      ); 
    }

    return (
      <Provider store={reduxStore}>
        <PersistGate loading={null} persistor={persistor}>
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <MenuProvider>
              <SwitchNavigator />
            </MenuProvider>
          </View>
        </PersistGate>
      </Provider>
    );
  }

  async _loadFontAsync() {
    await Font.loadAsync({
      'googlesans-bold': require('./assets/fonts/GoogleSans-Bold.ttf'),
      'googlesans-regular': require('./assets/fonts/GoogleSans-Regular.ttf'),
      'googlesans-medium': require('./assets/fonts/GoogleSans-Medium.ttf')
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
