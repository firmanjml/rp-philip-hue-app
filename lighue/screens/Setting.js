import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, View, Alert } from 'react-native'
import { Card, Badge, Block, Text } from '../components';
import { theme, constant } from '../constants';
import { connect } from 'react-redux';

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

    state = {
        nightmode: false
    }

    componentWillMount() {
        this.setState({
            nightmode: this.props.nightmode
        })
    }

    confirmationNightMode = (nightmode) => {
        Alert.alert(
            'Are you sure?',
            'App will be turn to light mode',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: this.changeNightMode(nightmode)},
            ],
            { cancelable: true },
        );
    }

    changeNightMode = (boolean) => {
        // this.props._changeTheme(boolean)
        console.log("button pressed")
    }

    render() {
        return (
            <Block style={styles.container}>
                <View style={styles.header}>
                    <Text h1 white bold>Settings</Text>
                    <View style={styles.row}>
                        <Text style={{ fontSize: 14, color: 'white' }}>Night Mode</Text>
                        <ToggleSwitch
                            offColor="rgba(157, 163, 180, 0.10)"
                            onColor={theme.colors.secondary}
                            isOn={this.state.nightmode}
                            onToggle={nightmode => {
                                this.confirmationNightMode(nightmode);
                            }}
                        />
                    </View>
                    <View style={styles.divider} />
                </View>
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
    container: {
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.sizes.base * 2,
    },
    header: {
        marginTop: 20
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    divider: {
        marginTop: 20,
        marginVertical: 5,
        marginHorizontal: 2,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
});