import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, Dimensions, View, Modal, Alert } from 'react-native'
import { Block, Text, Button } from '../components';
import { theme } from '../constants';
import { connect } from 'react-redux';
import { Updates, BlurView, AuthSession, Constants, WebBrowser } from 'expo';
import { persistor } from "../redux/store";
import Swipe from '../components/Swipe';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
const { width } = Dimensions.get('window');
import { ChangeThemeMode } from '../redux/actions'
import ToggleSwitch from '../components/ToggleSwitch'

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
            // Updates.reload()
            this.props.navigation.navigate("DiscoveryNavigator")
        }, 4000);
    }

    renderClearData() {
        return (
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.state.clearDataModal}>
                <BlurView tint="dark" intensity={100} style={StyleSheet.absoluteFill}>
                    <View style={{ marginTop: 90, paddingLeft: 30, paddingRight: 30, height : 60 }}>
                        <Swipe
                            width={width - 50}
                            buttonSize={70}
                            buttonColor="white"
                            backgroundColor="rgb(176,176,176)"
                            textColor="#37474F"
                            borderRadius={40}
                            borderColor="transparent"
                            okButton={{ visible: true, duration: 400 }}
                            icon={<AntDesign name="arrowright" size={30} color='red' />}
                            onVerified={() => this.clearAppData()}>
                            <Text bold>               slide to clear data</Text>
                        </Swipe>
                    </View>
                    <Block bottom flex={1} style={{ marginBottom: 40 }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => this.setState({ clearDataModal: false })}>
                                <MaterialIcons name="cancel" size={80} color='white' />
                            </TouchableOpacity>
                            <Text center white>Cancel</Text>
                        </View>
                    </Block>
                </BlurView>
            </Modal>
        )
    }

    render() {
        const { nightmode } = this.props;
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
                            isOn={this.props.nightmode}
                            onToggle={nightmode => {
                                this.props._changeTheme(nightmode);
                            }}
                        />
                    </Block>
                    <View style={styles.divider} />
                    <Block flex={false} row space="between" style={styles.row}>
                        <TouchableOpacity
                        onPress={() => this._handleoAuth()}>
                            <Text style={[styles.textSetting, textcolor]}>Setup Remote Control via Cloud</Text>
                        </TouchableOpacity>
                    </Block>
                    <View style={styles.divider} />
                    {this.renderClearData()}
                    <Block bottom flex={1} style={{ marginBottom: 10 }}>
                        <Button gradient
                            startColor='#C40A0A'
                            endColor='#E86241'
                            onPress={() => this.setState({ clearDataModal: true })}>
                            <Text center semibold white>Clear app data</Text>
                        </Button>
                    </Block>
                </Block>
            </Block>
        )
    }
    _handleoAuth = async () => {
        let redirectUrl = AuthSession.getRedirectUrl();
    
        const queryParams = toQueryString({
            clientid: 'SFL5STvqIFZb219NUAflwg8UIeQm7KmD',
            deviceid: Constants.installationId,
            appid: 'lighue',
            state: 'test'
        });
    
        let result = await AuthSession.startAsync({
            authUrl: `https://api.meethue.com/oauth2/auth${queryParams}`,
        })

        if (result.params.status === "error") {
            Alert.alert(
                'There\'s something wrong with the authentication right now.',
                "Please try again.",
                [{ text: "OK" }],
                { cancelable: false }
            );
        } else if (result.params.status === "success") {
            Alert.alert(
                result.params,
                [{ text: "OK" }],
                { cancelable: false }
            );
        } else {
            Alert.alert(
                'Hacking attempt an invalid request.',
                'Please try again. 😉',
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
        }
    }
}

const mapStateToProps = (state) => {
    return {
        nightmode: state.nightmode,
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