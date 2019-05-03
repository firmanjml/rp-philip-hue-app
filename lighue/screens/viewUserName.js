import React from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import { connect } from 'react-redux';
import { Constants } from 'expo';

const mapStateToProps = state => {
    return {
        username : state.username
    }
}


class viewUserName extends React.Component {
    render() {
        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <Text>{this.props.username}</Text>
                <Text>{Constants.deviceName}</Text>
            </View >
        );
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

export default connect(mapStateToProps, null)(viewUserName);