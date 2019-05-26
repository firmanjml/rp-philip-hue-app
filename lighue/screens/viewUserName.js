import React from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import { connect } from 'react-redux';
import { Constants } from 'expo';

class viewUserName extends React.Component {
    render() {
        const { bridgeIndex, username } = this.props;
        return (
            <View style={styles.container}>
                <Text>{username[bridgeIndex]}</Text>
                <Text>{Constants.deviceName}</Text>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        username: state.username,
        bridgeIndex: state.bridgeIndex
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButton: {
        marginTop: 50,
    },
    manualButton: {
        marginTop: 50
    }
});

export default connect(mapStateToProps)(viewUserName);