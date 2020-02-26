import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Block, Text } from '../components';
import { theme, constant } from '../constants';

import { connect } from 'react-redux'
import Layout from '../constants/Layout';
import AppIntroSlider from 'react-native-app-intro-slider';
import LottieView from 'lottie-react-native'
import * as LocalAuthentication from 'expo-local-authentication'

import { GetConfig, ChangeHardwareSupport } from '../redux/actions'

var interval;
class Splash extends Component {
    static navigationOptions = {
        header: null
    }

    state = {
        animation: null
    };

    componentWillMount() {
        this.props._fetchEverything();
        interval = setInterval(() => {
            this.props._fetchEverything();
        }, 3000)
    }

    componentDidMount() {
        this.checkAuthenticationSupport();
        this.animation1.play()
        this.animation2.play()
        this.animation3.play()
    }

    componentWillUnmount() {
        clearInterval(interval);
    }


    checkAuthenticationSupport = async () => {
        let supported = await LocalAuthentication.hasHardwareAsync();
        let whatHardware = await LocalAuthentication.supportedAuthenticationTypesAsync();
        let isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (supported && isEnrolled) {
            if (whatHardware[0] == 1) {
                this.props._UpdateHardwareSupport(1);
            }
            else {
                this.props._UpdateHardwareSupport(2);
            }
        }
    }


    renderLottie(item) {
        if (item.key == 0) {
            return (
                <Block container style={styles.slide}>
                    {constant.splash_slider[0].lottie &&
                        <LottieView
                            ref={animation1 => {
                                this.animation1 = animation1;
                            }}
                            speed={1}
                            source={constant.splash_slider[0].lottie}
                        />}
                </Block>
            );
        }
        else if (item.key == 1) {
            return (
                <Block container style={styles.slide}>
                    {constant.splash_slider[1].lottie &&
                        <LottieView
                            ref={animation2 => {
                                this.animation2 = animation2;
                            }}
                            speed={2}
                            source={constant.splash_slider[1].lottie}
                        />}
                </Block>
            );
        }
        else {
            return (
                <Block container style={styles.slide}>
                    {constant.splash_slider[2].lottie &&
                        <LottieView
                            ref={animation3 => {
                                this.animation3 = animation3;
                            }}
                            speed={2}
                            source={constant.splash_slider[2].lottie}
                        />}
                </Block>
            );
        }
    }

    _renderItem = (item) => {
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight };
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        const textcolor = { color: nightmode ? colors.white : colors.gray3 }
        return (
            <Block style={backgroundcolor}>
                    {this.renderLottie(item)}
                    <Block marginTop={20} style={{ marginHorizontal: theme.sizes.base * 3 }}>
                        <Text style={[styles.title, titlecolor]}>{item.title}</Text>
                        <Text medium style={[styles.text, textcolor]}>{item.text}</Text>
                    </Block>
            </Block>
        );
    }

    _onDone = () => {
        const { navigation, hardwareSupport } = this.props;
        if (hardwareSupport != 0) {
            navigation.navigate("AuthenticationSetting")
        }
        else {
            navigation.navigate("ListRoom")
        }
    }


    render() {
        return <AppIntroSlider
            renderItem={this._renderItem}
            slides={constant.splash_slider}
            onDone={this._onDone}
            bottomButton />;
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        _UpdateHardwareSupport(index) {
            return dispatch(ChangeHardwareSupport(index))
        },
        _fetchEverything(isLoading) {
            return dispatch(GetConfig(isLoading));
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
    mapDispatchToProps
)(Splash)

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        alignItems: 'center'
    },
    imageBlock: {
        marginTop: 20
    },
    image: {
        width: Layout.window.width,
        height: Layout.window.height / 2.5,
        resizeMode: 'contain'
    },
    title: {
        textAlign: 'left',
        fontWeight: '200',
        fontSize: 30
    },
    text: {
        marginTop: 20,
        textAlign: 'left',
        fontSize: 15,
    }
});