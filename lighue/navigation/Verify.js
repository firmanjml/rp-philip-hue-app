import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  View,
} from 'react-native';

import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    bridgeIndex: state.bridgeIndex,
    bridgeip: state.bridgeip,
    username: state.username
  }
}

class Verify extends React.Component {

  componentWillMount() {
    this.verifying();
  }

  verifying() {
    const { bridgeip, username, navigation, bridgeIndex } = this.props;
    if (bridgeip[bridgeIndex] && username[bridgeIndex]) {
      navigation.navigate("ListRoom")
    }
    else {
      navigation.navigate("StartPage")
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