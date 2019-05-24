import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  View,
} from 'react-native';

import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        bridgeip: state.bridgeip,
        username: state.username
    }
}


class Verify extends React.Component {

    componentWillMount() {
        this.verifying();
    }

    verifying() {
        if (this.props.bridgeip && this.props.username) {
            this.props.navigation.navigate("ControlBulb")
        }
        else {
            this.props.navigation.navigate("StartPage")
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