import React, { Component } from 'react'
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import { fetchBridgeIp, createUser } from '../../redux/actions';
import { theme } from '../../constants';
import { Button, Block, Text, Input } from '../../components';
import Layout from '../../constants/Layout';
import Countdown from 'react-countdown-now';

const mapStateToProps = state => {
    return {
        bridgeip: state.bridgeip,
        username: state.username
    }
}

const mapDispatchToprops = (dispatch, ownProps) => {
    return {
        _fetchBridgeIp() {
            return () => dispatch(fetchBridgeIp());
        },
        _createUser() {
            return () => dispatch(createUser());
        }
    }
}

class LinkButtonScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft:
                <TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ height: 40, width: 80, justifyContent: 'center' }}>
                        <Image source={require('../../assets/images/back.png')} />
                    </TouchableOpacity>
                </TouchableOpacity>
        }
    }

    createUsername = () => {
        if (!this.props.username) {
            this.props._createUser()()
            console.log("Link button not pressed!")
        } else {
            console.log("Link button pressed")
            this.props.navigation.navigate("createUserName")
        }
    }

    timer = ({ hours, minutes, seconds, completed }) => {
        if (!completed) {
            return <Text center h1 style={[this.props.style, { color: theme.colors.white, fontFamily: 'space-mono' }]}>{seconds} seconds</Text>;
        } else {
            return <Text center h1 style={[this.props.style, { color: theme.colors.white, fontFamily: 'space-mono' }]}>No device link.</Text>;
        }
    };

    render() {
        return (
            <Block style={styles.container} >
                <Block marginTop={20} margin={[0, theme.sizes.base * 2]}>
                    <Text h1 center bold color={'white'} style={{ textAlign: 'left' }}>
                        Link to Philips Hue
                    </Text>
                    <Text paragraph gray2 style={{ marginTop: 20 }}>
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
                            precision={0}
                            renderer={this.timer}
                            onComplete={() => {
                                Alert.alert(
                                    'No Bridge was found.',
                                    '',
                                    [{ text: "OK", onPress: () => {
                                        this.props.navigation.goBack();
                                    } }],
                                    { cancelable: false }
                                )
                            }}
                            onTick={() => {
                                this.createUsername();
                            }}
                        />}
                        <Block marginTop={20}>
                            <Text paragraph gray2>
                                Note: You will have 30 seconds to press the push-link button
                            </Text>
                        </Block>
                    </Block>
                </Block>
            </Block>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
    },
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
    mapDispatchToprops
)(LinkButtonScreen);