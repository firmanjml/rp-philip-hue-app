import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, View, Alert } from 'react-native'
import { Block, Text, Button } from '../../components';
import { theme } from '../../constants';
import { connect } from 'react-redux';
import { Updates, AuthSession } from 'expo';
import { persistor } from "../../redux/store";
import Constants from 'expo-constants';
import { ChangeThemeMode, ChangeCloudToken, ChangeAuthentication } from '../../redux/actions'
import ToggleSwitch from '../../components/ToggleSwitch';
import Base64 from 'Base64';
import { ScrollView } from 'react-native-gesture-handler';

class SettingScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft:
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ height: 40, width: 80, justifyContent: 'center' }}>
                    <Image source={require('../../assets/icons/back.png')} />
                </TouchableOpacity>
        }
    }

    clearAppData() {
        persistor.flush();
        persistor.purge();
        setTimeout(() => {
            Updates.reload()
            this.props.navigation.navigate("DiscoveryNavigator")
        }, 4000);
    }

    renderClearButton() {
        return (
            <Block bottom flex={1} style={{ marginBottom: 10 }}>
                <Button
                    onPress={() => this.clearAppData()}>
                    <Text center semibold white>Clear app data</Text>
                </Button>
            </Block>
        )
    }

    render() {
        const { nightmode, cloud_enable, bridgeip, bridgeIndex, hardwareSupport } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        const textcolor = { color: nightmode ? colors.white : colors.black }
        return (
            <Block style={backgroundcolor}>
                <Block container>
                    <Text h1 bold>Settings</Text>
                    <ScrollView>
                        <Block>
                            <Block flex={false} column style={styles.row}>
                                <Text gray googlebold style={styles.textSetting}>Bridge Configuration</Text>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate("ListBridge")}>
                                    <Text style={[styles.textSetting, textcolor]}>{(bridgeip.length > 1) ? "Switch Bridge" : "Add new Bridge"}</Text>
                                </TouchableOpacity>
                                <View style={styles.divider} />
                                {
                                    cloud_enable === true ?
                                        <Text style={[styles.textSetting, { color: theme.colors.gray2 }]}>Connected via Cloud</Text>
                                        :
                                        <TouchableOpacity
                                            onPress={() => this._handleoAuth()}>
                                            <Text style={[styles.textSetting, textcolor]}>Setup Remote Control via Cloud</Text>
                                        </TouchableOpacity>
                                }
                                <View style={styles.divider} />
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate("BridgeInfo")}>
                                    <Text style={[styles.textSetting, textcolor]}>Bridge Info</Text>
                                </TouchableOpacity>
                                <View style={styles.divider} />
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate("TimeZone")}>
                                    <Text style={[styles.textSetting, textcolor]}>Change Time Zone</Text>
                                </TouchableOpacity>
                                <View style={styles.divider} />
                            </Block>
                            <View>
                                {
                                    hardwareSupport != 0 ?
                                        <Block flex={false} column style={styles.row}>
                                            <Text gray googlebold style={styles.textSetting}>Lighue</Text>
                                            <Block flex={false} row space="between" style={styles.row}>
                                                <Text style={[styles.textSetting, textcolor, {alignSelf : 'center'}]}>Enable Fingerprint</Text>
                                                <ToggleSwitch
                                                    offColor="#DDDDDD"
                                                    onColor={theme.colors.secondary}
                                                    isOn={this.props.authentication}
                                                    onToggle={(boolean) => this.props._UpdateAuthentication(boolean)}
                                                />
                                            </Block>
                                            <View style={styles.divider} />
                                        </Block>
                                        :
                                        <View></View>
                                }
                            
                            </View>
                        </Block>
                    </ScrollView>
            </Block>
            </Block >
        )
    }

    _handleoAuth = async () => {
        const csrf = Base64.btoa('lighue' + Constants.installationId + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));

        const queryParams = toQueryString({
            clientid: 'SFL5STvqIFZb219NUAflwg8UIeQm7KmD',
            deviceid: Constants.installationId,
            appid: 'lighue',
            state: csrf
        });

        let result = await AuthSession.startAsync({
            authUrl: `https://api.meethue.com/oauth2/auth${queryParams}`,
            returnUrl: 'lighue://'
        })

        console.log(csrf);
        console.log(result);

        if (result.params) {
            if (result.params.state === csrf && result.params.code) {
                this.props._changeCloudToken(result.params.code);
                Alert.alert(
                    'Hooray 🥳',
                    'Successfully paired to cloud.',
                    [{ text: "OK" }],
                    { cancelable: false }
                );
            } else {
                Alert.alert(
                    "Validation Error",
                    'Fail to validate data.',
                    [{ text: "OK" }],
                    { cancelable: false }
                );
            }
        } else {
            Alert.alert(
                'Please try again',
                'There\'s something wrong with the authentication right now.',
                [{ text: "OK" }],
                { cancelable: false }
            );
        }
    }
}

function toQueryString(params) {
    return '?' + Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
}

const mapDispatchToProps = (dispatch) => {
    return {
        _changeTheme: (boolean) => {
            return dispatch(ChangeThemeMode(boolean));
        },
        _changeCloudToken: (code) => {
            return dispatch(ChangeCloudToken(code));
        },
        _UpdateAuthentication: (boolean) => {
            return dispatch(ChangeAuthentication(boolean));
        }
    }
}

const mapStateToProps = (state) => {
    return {
        nightmode: state.nightmode,
        cloud_enable: state.cloud_enable,
        bridgeIndex: state.bridgeIndex,
        bridgeip: state.bridgeip,
        username: state.username,
        authentication: state.authentication,
        hardwareSupport: state.hardwareSupport
    }
}

const styles = StyleSheet.create({
    row: {
        marginTop: 20,
    },
    textSetting: {
        marginTop: 18,
        fontSize: 16
    },
    divider: {
        marginTop: 20,
        marginVertical: 5,
        marginHorizontal: 2,
        borderBottomWidth: 1,
        borderColor: "#747880"
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingScreen)