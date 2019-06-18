import React, { Component } from 'react'
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import { CreateUser } from '../../redux/actions';
import { theme } from '../../constants';
import { Block, Text } from '../../components';
import Countdown from 'react-countdown-now';

class LinkButtonScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft:
                <TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ height: 40, width: 80, justifyContent: 'center' }}>
                        <Image source={require('../../assets/icons/back.png')} />
                    </TouchableOpacity>
                </TouchableOpacity>
        }
    }

    createUsername = () => {
        const { username, bridgeIndex, bridgeip } = this.props;
        if (!username[bridgeIndex]) {
            this.props._CreateUser();
        } else {
            this.props.navigation.navigate("SplashNavigator")
        }
    }

    timer = ({ seconds, completed }) => {
        const { nightmode } = this.props;
        const { colors } = theme;
        const textcolor = { color: nightmode ? colors.white : colors.black }
        if (!completed) {
            return <Text center h1 style={[this.props.style, { fontFamily: 'space-mono' },textcolor]}>{seconds} seconds</Text>;
        } else {
            return <Text center h1 style={[this.props.style, { fontFamily: 'space-mono' },textcolor]}>No device link.</Text>;
        }
    };

    render() {
        const { navigation, nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight };
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        const textcolor = { color: nightmode ? colors.white : colors.gray3}
        return (
            <Block style={backgroundcolor} >
                <Block container>
                    <Text h1 center bold style={[{ textAlign: 'left' },titlecolor]}>
                        Link to Philips Hue
                    </Text>
                    <Text paragraph style={[{ marginTop: 20 },textcolor]}>
                        To link this device with the Bridge, press the push-link button of the Hue bridge you want to connect to.
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
                                Note: You will have 30 seconds to press the push-link button
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
        bridgeIndex: state.bridgeIndex,
        username: state.username,
        nightmode: state.nightmode
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        _CreateUser() {
            return dispatch(CreateUser());
        }
    }
}

const styles = StyleSheet.create({
    textInput: {
        height: 25,
        borderBottomWidth: .5,
        borderRadius: 0,
        borderWidth: 0,
        color: 'white',
        borderColor: 'white',
        textAlign: 'left',
        paddingBottom: 10
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LinkButtonScreen);