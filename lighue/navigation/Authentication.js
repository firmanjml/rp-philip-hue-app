import React from 'react';
import { StyleSheet, Platform, View, Modal, ActivityIndicator, TouchableOpacity } from 'react-native';
import { theme } from '../constants';
import { Text, Block } from '../components';

import Fingerprint from '../assets/lottie/fingerprint.json'
import { connect } from 'react-redux'
import { DangerZone, LocalAuthentication, BlurView } from 'expo';

const { Lottie } = DangerZone;
class Authentication extends React.Component {

    state = {
        authenticate: null,
        androidModal: false,
        animation: Fingerprint,
        status: false,
        retry: 0,
        retryText: ""
    }

    componentWillMount() {
        this.authentication()
    }

    componentDidMount() {
        if (Platform.OS == "android") {
            this.animation.play(38, 38);
        }
    }

    authentication = async () => {
        this.setState({
            authenticate: true
        })

        if (Platform.OS == "ios") {
            let result = await LocalAuthentication.authenticateAsync("Authenticate with your finger");

            if (result.success) {
                this.props.navigation.navigate("ListRoom")
            }
            else {
                this.setState({ authenticate: false })
            }
        }
        else {
            // android work in progress
            // this.animation.play(38, 38);
            this.setState({
                androidModal: true
            })

            let result = await LocalAuthentication.authenticateAsync("Authenticate for Lighue");

            if (result.success) {
                this.setState({
                    status: true
                });
                this.animation.play(37, 154)
                setTimeout(() => { this.props.navigation.navigate("ListRoom") }, 600);
            }
            else {
                this.setState({
                    authenticate: false,
                    androidModal: false
                })
            }
        }
    }

    cancelAuthentication() {
        LocalAuthentication.cancelAuthenticate();
        this.setState({
            androidModal: false,
            authenticate: false
        })
    }

    renderAndroidFingerprint() {
        const status = this.state.status ? "Fingerprint recognised" : "Confirm your fingerprint now";
        const textcolor = this.state.status ? '#20D29B' : 'black';
        return (
            <Modal animationType={"none"}
                transparent={true}
                onRequestClose={() => this.cancelAuthentication()}
                visible={this.state.androidModal}>
                <BlurView tint="dark" intensity={100} style={StyleSheet.absoluteFill}>
                    <View style={{ backgroundColor: 'white', marginHorizontal: theme.sizes.base * 2, marginVertical: 270 }}>
                        {this.state.animation &&
                            <Lottie
                                ref={animation => {
                                    this.animation = animation;
                                }}
                                style={{
                                    width: '100%',
                                    height: '100%'
                                }}
                                loop={false}
                                speed={5.0}
                                source={this.state.animation}
                            />}
                        <View style={{ backgroundColor: 'white' }}>
                            <Text center>Fingerprint for Lighue</Text>
                            <Text center light style={{ color: textcolor }}>{status}</Text>
                            <View style={[styles.divider, { marginTop: 25, marginBottom: 15 }]} />
                            <TouchableOpacity
                                style={{ alignItems: 'center' }}
                                onPress={() => this.cancelAuthentication()}>
                                <Text light style={{ marginBottom: 15, color: '#20D29B' }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BlurView>
            </Modal>
        )
    }

    render() {
        const { nightmode } = this.props;
        const { authenticate } = this.state;
        const { colors } = theme;
        const textcolor = { color: nightmode ? colors.white : colors.black }
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight };
        if (authenticate) {
            return (
                <View style={[backgroundcolor, styles.container]}>
                    {this.renderAndroidFingerprint()}
                </View>
            )
        }
        else if (authenticate == false) {
            return (
                <View style={[backgroundcolor, styles.container]}>
                    {this.renderAndroidFingerprint()}
                    <Text h2 bold style={[{ textAlign: 'center' }, textcolor]}>You are not authenticated.</Text>
                    <Text h3 style={[{ textAlign: 'center' }, textcolor]}>Please try again</Text>
                    <TouchableOpacity
                        onPress={this.authentication}>
                        <Text h3 style={{ textAlign: 'center', marginTop: 20, color: '#20D29B' }}>Retry authentication</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }
}

const mapStateToProps = (state) => {
    return {
        nightmode: state.nightmode,
        hardwareSupport: state.hardwareSupport
    }
}

export default connect(
    mapStateToProps,
    null
)(Authentication)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

