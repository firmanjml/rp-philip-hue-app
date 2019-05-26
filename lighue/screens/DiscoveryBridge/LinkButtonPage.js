import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import { MonoText } from '../../components/StyledText';
import { connect } from 'react-redux';
import { fetchBridgeIp, createUser } from '../../redux/actions';
import CountdownCircle from 'react-native-countdown-circle'

const mapStateToProps = state => {
  return {
    bridgeip: state.bridgeip,
    username: state.username
  }
}

const mapDispatchToprops = (dispatch, ownProps) => {
  return {
    _fetchBridgeIp() {
      return () => dispatch(fetchBridgeIp());
    },
    _createUser() {
      return () => dispatch(createUser());
    }
  }
}

let interval;

/**
 * LinkButtonPage
 * ! This class is deprecated, please do not use.
 */
class LinkButtonPage extends React.Component {

  createUsername = () => {
    const { username, bridgeIndex } = this.props;
    if (!username[bridgeIndex]) {
      this.props._createUser()()
      console.log("Link button not pressed!")
    }
    else {
      clearInterval(interval);
      console.log("Link button pressed")
      this.props.navigation.navigate("createUserName")
    }
  }


  expired = (navigation) => {
    navigation.goBack();
    alert("Link button not pressed!")
  }

  componentWillMount() {
    this.createUsername();
    interval = setInterval(this.createUsername, 3000);
  }

  componentWillUnmount() {
    clearInterval(interval);
  }

  render() {
    return (
      <View style={styles.container}>
        <CountdownCircle
          seconds={30}
          radius={80}
          borderWidth={20}
          color="#ff003f"
          bgColor="#fff"
          textStyle={{ fontSize: 50 }}
          onTimeElapsed={() => this.expired(this.props.navigation)}
        />
        <View style={[styles.codeHighlightContainer, styles.homeScreenFilename, { marginTop: 20 }]}>
          <MonoText style={styles.codeHighlightText} onPress={() => this._handleHelpPress()}>You have 30 seconds to press the link button</MonoText>
        </View>
      </View>
    );
  }

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
    justifyContent: 'center',
    alignItems: 'center'
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
    textAlign: 'center'
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
)(LinkButtonPage);