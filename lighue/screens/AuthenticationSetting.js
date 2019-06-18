import React from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import { Block, Text, Button } from '../components';
import { connect } from 'react-redux'
import { Constants } from 'expo';
import { DangerZone } from 'expo';
import { theme, constant } from '../constants';
import { ChangeAuthentication } from '../redux/actions'
import Security from '../assets/lottie/cloud-security.json'
const { Lottie } = DangerZone;

import ToggleSwitch from '../components/ToggleSwitch'

class AuthenticationSetting extends React.Component {
    state = {
        type: null,
        animation: null,
    }

    componentWillMount() {
        this._playAnimation();
    }

    componentDidMount() {
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

    _playAnimation = () => {
        if (!this.state.animation) {
            this._loadAnimationAsync();
        } else {
            this.animation.reset();
            this.animation.play();
        }
    };

    _loadAnimationAsync = async () => {
        this.setState({ animation: Security }, this._playAnimation);
      };

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
                    <Block style={{justifyContent : 'center', alignItems : 'center', marginTop : 30}}>
                        {this.state.animation &&
                            <Lottie
                                ref={animation => {
                                    this.animation = animation;
                                }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    alignSelf : 'center'
                                }}
                                loop={true}
                                source={this.state.animation}
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
                            <Text style={[textcolor, { marginTop: 15 }]}>Allow your {type} to unlock the Lighue app.</Text>
                        </View>
                        <Button gradient
                            startColor='#0A7CC4'
                            endColor='#2BDACD'
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
        },
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
    }
});

