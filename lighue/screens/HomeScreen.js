import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
import { connect } from 'react-redux';
import { fetchBridgeIp, createUser, fetchAllGroups, fetchAllLights } from '../redux/actions';
import Spinner from "react-native-loading-spinner-overlay";
import TimerCountdown from "react-native-timer-countdown";

const mapStateToProps = state => {
  return {
    loading: state.loading,
    bridgeip: state.bridgeip,
    username: state.username,
    groups: state.groups,
    lights: state.lights
  }
}

const mapDispatchToprops = (dispatch, ownProps) => {
  return {
    _fetchBridgeIp() {
      return () => dispatch(fetchBridgeIp());
    },
    _createUser() {
      return () => dispatch(createUser());
    },
    _fetchAllGroups() {
      return () => dispatch(fetchAllGroups());
    },
    _fetchAllLights() {
      return () => dispatch(fetchAllLights());
    }
  }
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  componentWillMount() {
    if (!this.props.bridgeip) {
      this.props._fetchBridgeIp()();
    }
    if (this.props.username) {
      // navigate to logged in page.
      console.log("LOGGEDIN")
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.props.loading} />
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

          <View style={styles.getStartedContainer}>

            <TimerCountdown
              initialMilliseconds={1000 * 30}
              formatMilliseconds={(milliseconds) => {
                const remainingSec = Math.round(milliseconds / 1000);
                const seconds = parseInt((remainingSec % 60).toString(), 10);
                const minutes = parseInt(((remainingSec / 60) % 60).toString(), 10);
                const hours = parseInt((remainingSec / 3600).toString(), 10);
                const s = seconds < 10 ? '0' + seconds : seconds;
                const m = minutes < 10 ? '0' + minutes : minutes;
                let h = hours < 10 ? '0' + hours : hours;
                h = h === '00' ? '' : h + ':';
                return h + m + ':' + s;
              }}
              onExpire={() => {
                // go back to home page.
                console.log('expired')
              }}
              allowFontScaling={true}
              style={styles.getStartedText}
            />

            <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
              <MonoText style={styles.codeHighlightText} onPress={() => this._handleHelpPress()}>You have 30 seconds to press the link button</MonoText>
            </View>
          </View>

        </ScrollView>

        <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

          <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
          </View>
        </View>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = async () => {
    await this.props._fetchAllGroups()();
    console.log(this.props.groups);
    await this.props._fetchAllLights()();
    console.log(this.props.lights);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    marginTop: 30,
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 50,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToprops
)(HomeScreen);