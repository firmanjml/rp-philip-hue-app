import React from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import { BlurView } from 'expo';
import { Block, Text, Button } from '../components';
import { connect } from 'react-redux'
import { theme } from '../constants';
import { ChangeAuthentication } from '../redux/actions'
import Security from '../assets/lottie/cloud-security.json'
import LottieView from 'lottie-react-native'

import ToggleSwitch from '../components/ToggleSwitch'

class AuthenticationSetting extends React.Component {
    state = {
        type: null,
        animation1: Security
    }

    componentDidMount() {
        this.animation1.play();
        if (this.props.hardwareSupport == 1) {
            if (Platform.OS == "ios") {
                this.setState({ type: "Touch ID" })
            }
            else {
                this.setState({ type: "Fingerprint" })
            }
        }
        else {
            this.setState({ type: "Face ID" })
        }
    }

    render() {
        const { nightmode } = this.props;
        const { type } = this.state;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight };
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        const textcolor = { color: nightmode ? colors.white : colors.gray3 }
        return (
            <Block style={backgroundcolor}>
                <Block container>
                    <Text h1 bold style={titlecolor}>Authentication Settings</Text>
                    <Text style={[textcolor, { marginTop: 10 }]}>Your device supports authentication with {type}.</Text>
                    <Text style={textcolor}>You can change settings later.</Text>
                    <Block style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                        {this.state.animation1 &&
                            <LottieView
                                ref={animation1 => {
                                    this.animation1 = animation1;
                                }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    alignSelf: 'center'
                                }}
                                loop={true}
                                source={this.state.animation1}
                            />}
                    </Block>
                    <Block bottom flex={1} style={{ marginBottom: 10 }}>
                        <View style={{ marginBottom: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: "space-between", marginTop: 5 }}>
                                <Text bold style={[textcolor, { fontSize: 16, alignSelf: 'center' }]}>{type}</Text>
                                <ToggleSwitch
                                    offColor="#DDDDDD"
                                    onColor={theme.colors.secondary}
                                    isOn={this.props.authentication}
                                    onToggle={(boolean) => this.props._UpdateAuthentication(boolean)}
                                />
                            </View>
                            <Text style={[textcolor, { marginTop: 15 }]}>All the {type} on this device can be used to unlock the Lighue app.</Text>
                        </View>
                        <Button
                            onPress={() => this.props.navigation.navigate("ListRoom")}>
                            <Text center semibold white>Next</Text>
                        </Button>
                    </Block>
                </Block>
            </Block>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        nightmode: state.nightmode,
        authentication: state.authentication,
        hardwareSupport: state.hardwareSupport
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        _UpdateAuthentication(boolean) {
            return dispatch(ChangeAuthentication(boolean))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AuthenticationSetting)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    divider: {
        borderBottomWidth: 1,
        borderColor: "#E1E3E8"
    }
});

