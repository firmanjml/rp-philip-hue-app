import React from 'react';
import { StyleSheet, Image, Alert, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { GetBridgeIP } from '../../redux/actions';
import validator from 'validator';
import { Entypo } from '@expo/vector-icons';
import Layout from '../../constants/Layout';
import { Button, Block, Text, Input } from '../../components';
import { theme } from '../../constants';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';


class ManualScreen extends React.Component {
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

    renderMenu() {
        return (
            <Menu onSelect={value => this.onMenuSelect(value)}>
                <MenuTrigger>
                    <Entypo name="dots-three-horizontal" size={25} color={theme.colors.gray} />
                </MenuTrigger>
                <MenuOptions style={{ padding: 15 }} >
                    <MenuOption value={1}><Text h3>Settings</Text></MenuOption>
                    <View style={styles.divider} />
                </MenuOptions>
            </Menu>
        )
    }

    onMenuSelect(value) {
        if (value == 1) {
            this.props.navigation.navigate('SettingDiscovery');
        }
    }

    render() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight };
        const textcolor = { color: nightmode ? colors.white : colors.gray3 }
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        const bordercolor = { borderColor: nightmode ? colors.white : colors.black }
        const placeholdercolor = nightmode ? colors.gray2 : colors.gray3
        return (
            <Block style={backgroundcolor} >
                <Block container>
                    <Block flex={false} row space="between">
                        <Text h1 center bold style={[{ textAlign: 'left' }, titlecolor]}>
                            Find Hue Bridge</Text>
                        {this.renderMenu()}
                    </Block>
                    <Text paragraph style={[{ marginTop: 20 }, textcolor]}>
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
                        <Text paragraph style={titlecolor}>
                            Manual IP
                        </Text>
                        <Input
                            style={[styles.textInput, textcolor, bordercolor]}
                            keyboardType="numeric"
                            value={this.state.manualIP}
                            onChangeText={this.changeText}
                            placeholder={'192.168.1.1'}
                            placeholderTextColor={placeholdercolor}
                            returnKeyType={'done'}
                        />
                        <Text paragraph marginTop={10} style={textcolor}>
                            Advanced. You can also enter IP address above before starting the search.
                        </Text>
                    </Block>
                    <Block middle flex={1}>
                        <Button
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
                            <Text style={[{ textAlign: 'center' }, textcolor]}>Having trouble finding out Bridge IP?</Text>
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

const mapStateToProps = (state) => {
    return {
        nightmode: state.nightmode
    }
}

const styles = StyleSheet.create({
    textInput: {
        height: 25,
        borderBottomWidth: .5,
        borderRadius: 0,
        borderWidth: 0,
        textAlign: 'left',
        paddingBottom: 10
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ManualScreen);