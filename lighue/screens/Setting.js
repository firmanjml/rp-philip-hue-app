import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, View, Alert } from 'react-native'
import { Block, Text, Button } from '../components';
import { theme } from '../constants';
import { connect } from 'react-redux';
import { Updates } from 'expo';
import { persistor } from "../redux/store";

import { ChangeThemeMode } from '../redux/actions'

import ToggleSwitch from '../components/ToggleSwitch'


class Setting extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft:
                <TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ height: 40, width: 80, justifyContent: 'center' }}>
                        <Image source={require('../assets/icons/back.png')} />
                    </TouchableOpacity>
                </TouchableOpacity>
        }
    }

    confirmationClear() {
        Alert.alert(
            'Are you sure?',
            'This will entirely clear app data!',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => this.clearAppData() },
            ],
            { cancelable: false },
        );
    }

    clearAppData() {
        persistor.flush();
        persistor.purge();
        setTimeout(() => {
            Updates.reload()
        }, 1000);
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
                    <Block bottom flex={1} style={{ marginBottom: 10 }}>
                        <Button gradient
                            startColor='#C40A0A'
                            endColor='#E86241'
                            onPress={() => { this.confirmationClear() }}>
                            <Text center semibold white>Clear data</Text>
                        </Button>
                    </Block>
                </Block>
            </Block>
        )
    }

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
        borderColor: "#E1E3E8"
    },
});