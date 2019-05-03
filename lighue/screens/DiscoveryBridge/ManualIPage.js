import React from 'react';
import { Text, StyleSheet, View, Button, TextInput, Dimensions, Alert } from 'react-native';
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


class ManualIPage extends React.Component {
    state = {
        textDisabled: true,
        isChecking: false,
        manualIP: ""
    }

    // ValidateIPaddress = () => {
    //     var ipformat = '^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$';
    //     var ipaddress = this.state.manualIP;
    //     console.log(this.state.bridgeip)
    //     if (ipaddress) {
    //         if (ipaddress.match(ipformat)) {
    //             this.setState({ textDisabled: false });
    //             console.log(this.state.textDisabled)
    //         }
    //         else {
    //             this.setState({ textDisabled: true })
    //             console.log(this.state.textDisabled)
    //         }
    //     }
    // }

    changeText = (value) => {
        this.setState({ manualIP: value })
        console.log(this.state.manualIP)
    }

    // checkIP = () => {
    //     axios({
    //         url: 'http://' + this.state.manualIP + '/api/nouser/config',
    //         method: 'GET'
    //     }).then((res) => {
    //         if (res.data.modelid === "BSB001") {
    //             console.log("yey correct")
    //             this.submitIP();
    //         }
    //     }).catch((error) => {
    //         console.log(error)
    //         alert("Wrong IP. Please re-enter Bridge IP")
    //     });
    // }

    // submitIP = () => {
    //     this.props._setIP(this.state.manualIP)();
    //     this.props.navigation.goBack();
    // }

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
    searchButton: {
        marginTop: 20
    }
});

export default connect(null, mapDispatchToprops)(ManualIPage);