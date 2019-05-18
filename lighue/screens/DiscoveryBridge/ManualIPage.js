import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Button, TextInput, Alert } from 'react-native';
import { connect } from 'react-redux';
import { fetchBridgeIp } from '../../redux/actions';
import validator from 'validator';
import Layout from '../../constants/Layout'

const mapDispatchToprops = (dispatch) => {
    return {
        _setIP(navigation, ip) {
            return dispatch(fetchBridgeIp(navigation, true, ip));
        }
    }
}

/**
 * ManualIPage
 * ! This class is deprecated, please do not use.
 */
class ManualIPage extends React.Component {
    state = {
        isChecking: false,
        manualIP: ""
    }

    changeText = (value) => {
        this.setState({ manualIP: value })
        console.log(this.state.manualIP)
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Set Manual IP</Text>
                <View style={styles.manualIP}>
                    <TextInput
                        style={{ height: 40, borderWidth: 1, borderColor: 'gray', width: Layout.window.width - 100, textAlign: 'center' }}
                        keyboardType='numeric'
                        onChangeText={this.changeText}
                        onEndEditing={this.ValidateIPaddress}
                        value={this.state.manualIP}
                    />
                </View>
                <View style={styles.linkButton}>
                   <TouchableOpacity onPress={this.props.navigation.navigate("StepByStep")}>
                         Having trouble finding out Bridge IP?
                   </TouchableOpacity>
                </View>
                <View style={styles.searchButton}>
                    <Button
                        title="Search"
                        // disabled={this.state.textDisabled}
                        onPress={() => {
                            if (validator.isIP(this.state.manualIP, [4])) {
                                this.props._setIP(this.props.navigation, this.state.manualIP)
                            } else {
                                Alert.alert(
                                    'Invalid IP Format',
                                    '',
                                    [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                                    { cancelable: false }
                                )
                            }
                        }}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    manualIP: {
        marginTop: 20
    },
    linkButton: {
        marginTop : 10
    },
    searchButton: {
        marginTop: 20
    }
});

export default connect(null, mapDispatchToprops)(ManualIPage);