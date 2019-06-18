import React from 'react';
import {
  ActivityIndicator,
  View,
} from 'react-native';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    bridgeIndex: state.bridgeIndex,
    bridgeip: state.bridgeip,
    username: state.username,
    authentication : state.authentication
  }
}

class Verify extends React.Component {

  componentWillMount() {
    this.verifying();
  }

  verifying() {
    const { bridgeip, username, navigation, bridgeIndex, authentication} = this.props;
    if (bridgeip[bridgeIndex] && username[bridgeIndex]) {
      if (authentication) {
        navigation.navigate("Authenticate")
      }
      else {
        navigation.navigate("AppNavigator")
      }
    }
    else {
      navigation.navigate("DiscoveryNavigator")
    }
  }

  render() {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }
}

export default connect(mapStateToProps, null)(Verify);