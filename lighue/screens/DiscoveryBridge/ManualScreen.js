import React from 'react';
import { StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { GetBridgeIP } from '../../redux/actions';
import validator from 'validator';

import Layout from '../../constants/Layout';
import { Button, Block, Text, Input } from '../../components';
import { theme } from '../../constants';


class ManualScreen extends React.Component {
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
    state = {
        isChecking: false,
        manualIP: ""
    }

    changeText = (value) => {
        this.setState({ manualIP: value })
    }

    onPress = () => {
        this.props.navigation.navigate("StepByStep");
    }

    render() {
        return (
            <Block style={styles.container} >
                <Block marginTop={20} margin={[0, theme.sizes.base * 2]}>
                    <Text h1 center bold color={'white'} style={{ textAlign: 'left' }}>
                        Find Hue Bridge
                    </Text>
                    <Text paragraph gray2 style={{ marginTop: 20 }}>
                        Make sure the Hue bridge is powered on and connected to the router of your current Wi-Fi. Then, tap search below.
                    </Text>
                    <Block marginTop={30} justifyContent={'center'} alignItems={'center'}>
                        <Image
                            source={require('../../assets/images/router.png')}
                            resizeMode='contain'
                            style={{ width: Layout.window.width, height: Layout.window.height / 5, }}
                        />
                    </Block>
                    <Block marginTop={20}>
                        <Text paragraph white>
                            Manual IP
                        </Text>
                        <Input
                            style={styles.textInput}
                            keyboardType="numeric"
                            value={this.state.manualIP}
                            onChangeText={this.changeText}
                            placeholder={'192.168.1.1'}
                            placeholderTextColor={theme.colors.gray2}
                            returnKeyType={'done'}
                        />
                        <Text paragraph gray2 marginTop={10}>
                            Advanced. You can also enter IP address above before starting the search.
                        </Text>
                    </Block>
                    <Block middle flex={1}>
                        <Button gradient
                            startColor='#0A7CC4'
                            endColor='#2BDACD'
                            onPress={() => {
                                if (validator.isIP(this.state.manualIP, [4])) {
                                    this.props._setIP(this.props.navigation, this.state.manualIP)
                                } else {
                                    Alert.alert(
                                        'Invalid IP Format',
                                        'Please re-enter IP address',
                                        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                                        { cancelable: false }
                                    )
                                }
                            }}>
                            <Text center semibold white>Search</Text>
                        </Button>
                        <TouchableOpacity style={{ marginTop: 5 }} onPress={this.onPress}>
                            <Text style={{ textAlign: 'center', color: 'white' }}>Having trouble finding out Bridge IP?</Text>
                        </TouchableOpacity>
                    </Block>
                </Block>
            </Block>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        _setIP: (navigation, ip) => {
            return dispatch(GetBridgeIP(navigation, true, ip));
        }
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

export default connect(null,mapDispatchToProps)(ManualScreen);