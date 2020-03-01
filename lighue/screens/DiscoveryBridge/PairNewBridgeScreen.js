import React, { Component } from 'react'
import {
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import { CreateUser, SwitchBridge, GetConfig } from '../../redux/actions';
import { theme } from '../../constants';
import { Block, Text } from '../../components';
import Countdown from 'react-countdown-now';

class PairNewBridgeScreen extends Component {
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

    createUsername = () => {
        const { username, bridgeip } = this.props;
        const bridgeLength = bridgeip.length - 1;
        if (!username[bridgeLength]) {
            this.props._CreateUser(bridgeLength);
        } else {
            this.props._SwitchBridge(bridgeLength);
            setTimeout(() => {
                this.props._fetchEverything(true);
                this.props.navigation.navigate("ListRoom");
            }, 1000);
        }
    }

    timer = ({ seconds, completed }) => {
        const { nightmode } = this.props;
        const { colors } = theme;
        const textcolor = { color: nightmode ? colors.white : colors.black }
        if (!completed) {
            return <Text center h1 style={[this.props.style, textcolor]}>{seconds} seconds</Text>;
        } else {
            return <Text center h1 style={[this.props.style, textcolor]}>No device link.</Text>;
        }
    };

    render() {
        const { navigation, nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight };
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        const textcolor = { color: nightmode ? colors.white : colors.gray3 }
        return (
            <Block style={backgroundcolor} >
                <Block container>
                    <Text h1 center bold style={[{ textAlign: 'left' }, titlecolor]}>
                        Link to Philips Hue
                    </Text>
                    <Text paragraph style={[{ marginTop: 20 }, textcolor]}>
                        To link this device with the Bridge, press the big button of the Hue bridge you want to connect to.
                    </Text>
                    <Block marginTop={30} justifyContent={'center'} alignItems={'center'}>
                        <Image
                            source={require('../../assets/images/pushlink.png')}
                            resizeMode='contain'
                            style={{ width: 250, height: 240 }}
                        />
                    </Block>
                    <Block marginTop={20}>
                        {<Countdown
                            date={Date.now() + 30000}
                            intervalDelay={1000}
                            renderer={this.timer}
                            onComplete={() => {
                                Alert.alert(
                                    'No Bridge was found.',
                                    '',
                                    [{
                                        text: "OK", onPress: () => {
                                            navigation.goBack();
                                        }
                                    }],
                                    { cancelable: false }
                                )
                            }}
                            onTick={() => {
                                this.createUsername();
                            }}
                        />}
                        <Block marginTop={20}>
                            <Text paragraph style={textcolor}>
                                Note: You will have 30 seconds to press the big button
                            </Text>
                        </Block>
                    </Block>
                </Block>
            </Block>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        bridgeip: state.bridgeip,
        username: state.username,
        nightmode: state.nightmode
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        _CreateUser(i) {
            return dispatch(CreateUser(i));
        },
        _SwitchBridge(i) {
            return dispatch(SwitchBridge(i));
        },
        _fetchEverything(isLoading) {
            return dispatch(GetConfig(isLoading));
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PairNewBridgeScreen);