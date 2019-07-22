import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, Dimensions, View, Alert } from 'react-native'
import { Block, Text, Button } from '../components';
import { theme } from '../constants';
import { connect } from 'react-redux';
import { Updates, BlurView, AuthSession, Constants, WebBrowser } from 'expo';
import { persistor } from "../redux/store";
const { width } = Dimensions.get('window');
import { ChangeThemeMode, ChangeCloudToken, ChangeCloudState } from '../redux/actions'
import ToggleSwitch from '../components/ToggleSwitch';

class Setting extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft:
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ height: 40, width: 80, justifyContent: 'center' }}>
                    <Image source={require('../assets/icons/back.png')} />
                </TouchableOpacity>
        }
    }
    state = {
        clearDataModal: false
    }

    clearAppData() {
        persistor.flush();
        persistor.purge();
        setTimeout(() => {
            Updates.reload()
            this.props.navigation.navigate("DiscoveryNavigator")
        }, 4000);
    }

    renderBridgeInfo(textcolor) {
        const { username, bridgeIndex } = this.props;
        if (username[bridgeIndex]) {
            return (
                <View>
                    <Block flex={false} row space="between" style={styles.row}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate("BridgeInfo")}>
                            <Text style={[styles.textSetting, textcolor]}>Bridge Info</Text>
                        </TouchableOpacity>
                    </Block>
                    <View style={styles.divider} />
                </View>
            )
        }
    }

    renderClearButton() {
        const { username, bridgeIndex } = this.props;
        if (username[bridgeIndex]) {
            return (
                <Block bottom flex={1} style={{ marginBottom: 10 }}>
                    <Button gradient
                        startColor='#C40A0A'
                        endColor='#E86241'
                        onPress={() => this.clearAppData()}>
                        <Text center semibold white>Clear app data</Text>
                    </Button>
                </Block>
            )
        }
    }

    render() {
        const { nightmode, cloud_enable } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        const textcolor = { color: nightmode ? colors.white : colors.black }
        return (
            <Block style={backgroundcolor}>
                <Block container>
                    <Text h1 bold style={[textcolor, { marginTop: 10 }]}>Settings</Text>
                    <Block flex={false} row space="between" style={styles.row}>
                        <Text style={[styles.textSetting, textcolor]}>Dark mode</Text>
                        <ToggleSwitch
                            offColor="#DDDDDD"
                            onColor={theme.colors.secondary}
                            isOn={nightmode}
                            onToggle={nightmode => {
                                this.props._changeTheme(nightmode);
                            }}
                        />
                    </Block>
                    <View style={styles.divider} />
                    <Block flex={false} row space="between" style={styles.row}>
                        {
                            cloud_enable === true ?
                                <Text style={[styles.textSetting, { color: theme.colors.gray2 }]}>Connected via Cloud</Text>
                                :
                                <TouchableOpacity
                                    onPress={() => this._handleoAuth()}>
                                    <Text style={[styles.textSetting, textcolor]}>Setup Remote Control via Cloud</Text>
                                </TouchableOpacity>
                        }
                    </Block>
                    <View style={styles.divider} />
                    {this.renderBridgeInfo(textcolor)}
                    {this.renderClearButton()}
                </Block>
            </Block>
        )
    }
    _handleoAuth = async () => {
        const redirectUrl = AuthSession.getRedirectUrl();
        const csrf = 'lighue' + Constants.installationId + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const queryParams = toQueryString({
            clientid: 'SFL5STvqIFZb219NUAflwg8UIeQm7KmD',
            deviceid: Constants.installationId,
            appid: 'lighue',
            state: csrf
        });

        let result = await AuthSession.startAsync({
            authUrl: `https://api.meethue.com/oauth2/auth${queryParams}`,
        })
        console.log(csrf);

        if (result.params.status === "error") {
            Alert.alert(
                "Please try again.",
                'There\'s something wrong with the authentication right now.',
                [{ text: "OK" }],
                { cancelable: false }
            );
        } else if (result.params.status === "success") {
            if (result.params.state === csrf) {
                this.props._changeCloudToken(result.params.code);
                Alert.alert(
                    'Hooray 🥳',
                    'Successfully paired to cloud.',
                    [{
                        text: "OK", onPress: () => {

                        }
                    }],
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
                'Please try again. 😉',
                'Hacking attempt an invalid request.',
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
        }
    }
}

const mapStateToProps = (state) => {
    return {
        nightmode: state.nightmode,
        cloud_enable: state.cloud_enable,
        bridgeIndex: state.bridgeIndex,
        username: state.username
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Setting)

const styles = StyleSheet.create({
    row: {
        marginTop: 20,
    },
    textSetting: {
        fontSize: 16,
        color: 'black',
        alignSelf: "center"
    },
    divider: {
        marginTop: 20,
        marginVertical: 5,
        marginHorizontal: 2,
        borderBottomWidth: 1,
        borderColor: "#747880"
    },
});