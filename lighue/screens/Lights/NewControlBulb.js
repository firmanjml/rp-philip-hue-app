import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Block, Text, Input } from '../../components';
import Slider from 'react-native-slider';
import { theme } from '../../constants';
import Icon from "react-native-vector-icons";
import { ColorPicker } from "react-native-color-picker";
import { connect } from 'react-redux';
import ToggleSwitch from '../../components/ToggleSwitch'
import _ from 'lodash';
import { ColorConversionToXY } from '../../components/ColorConvert';
import { GetLightAtrributes, SetLampState } from '../../redux/actions';

import axios from 'axios';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from "react-native-popup-menu";

class NewControlBulb extends Component {
    static navigationOptions = {
        header: null
    }

    state = {
        id: 0,
        roomName: 'None',
        bri: 0,
        sat: 0
    }

    componentWillMount() {
        this.setState({
            id: this.props.navigation.getParam('id', "1"),
            bri: this.props.lights[this.props.navigation.getParam('id', "1")].state.bri,
            sat: this.props.lights[this.props.navigation.getParam('id', "1")].state.sat,
        })
    }

    changeColorLightState = _.throttle((values) => {
        axios({
            method: "PUT",
            url: `http://${this.props.bridgeip[this.props.bridgeIndex]}/api/${
                this.props.username[this.props.bridgeIndex]}/lights/${this.state.id}/state`,
            data: {
                on: true,
                xy: ColorConversionToXY(values)
            }
        })
    }, 600);

    changeBrightnessState = _.throttle((value) => {
        axios({
            method: "PUT",
            url: `http://${this.props.bridgeip[this.props.bridgeIndex]}/api/${
                this.props.username[this.props.bridgeIndex]}/lights/${this.state.id}/state`,
            data: {
                on: true,
                bri: value
            }
        })
    }, 50)

    changeSaturationState = _.throttle((value) => {
        axios({
            method: "PUT",
            url: `http://${this.props.bridgeip[this.props.bridgeIndex]}/api/${
                this.props.username[this.props.bridgeIndex]}/lights/${this.state.id}/state`,
            data: {
                on: true,
                sat: value
            }
        })
    }, 50);

    renderBackButton() {
        const { navigation } = this.props;
        return (
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ height: 40, width: 80, justifyContent: "center" }}>
                <Image source={require("../../assets/icons/back.png")} />
            </TouchableOpacity>
        )
    }

    renderMenu() {
        return (
            <Menu onSelect={value => this.onMenuRoomSelect(value)}>
                <MenuTrigger>
                    <Icon.Entypo
                        name="dots-three-horizontal"
                        size={25}
                        color={theme.colors.gray}
                    />
                </MenuTrigger>
                <MenuOptions style={{ padding: 15 }}>
                    <MenuOption value={1}>
                        <Text h3>Show advanced option</Text>
                    </MenuOption>
                    <View style={styles.divider} />
                    <MenuOption value={2}>
                        <Text h3>Show bulb info</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
        );
    }

    onMenuRoomSelect(value) {
        if (value == 1) {
            this.props.navigation.navigate("ControlBulbAdvanced", {
                id: this.state.id
            });
        }
        else if (value == 2) {
            this.props.navigation.navigate('BulbInfo', {
                id: this.state.id
            });
        }
    }

    render() {
        const { nightmode, _ChangeLampStateByID } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        const textcolor = { color: nightmode ? colors.white : colors.black }
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        const bordercolor = { borderColor: nightmode ? colors.white : colors.gray2 }
        const trackTintColor = nightmode ? "rgba(157, 163, 180, 0.10)" : "#DDDDDD"
        return (
            <Block style={backgroundcolor}>
                <View style={styles.header}>
                    {this.renderBackButton()}
                    {this.renderMenu()}
                </View>
                <Block containerNoHeader>
                    <View style={styles.titleRow}>
                        <Text style={[styles.title, titlecolor]}>{this.props.lights[this.state.id].name}</Text>
                        <ToggleSwitch
                            offColor="#DDDDDD"
                            onColor={colors.secondary}
                            isOn={this.props.lights[this.state.id].state.on}
                            onToggle={(value) => {
                                _ChangeLampStateByID(this.state.id, {
                                    "on": value,
                                })
                            }}
                        />
                    </View>
                    <Text style={[styles.textControl, textcolor]}>Room Name</Text>
                    <Input
                        style={[styles.textInput, titlecolor, bordercolor]}
                        editable={false}
                        value={this.state.roomName}
                        placeholderTextColor={nightmode ? colors.gray2 : colors.black}
                    />
                    <Text style={[styles.textControl, textcolor, { marginBottom: 10 }]}>Brightness</Text>
                    <Slider
                        minimumValue={1}
                        maximumValue={254}
                        style={{ height: 25 }}
                        thumbStyle={styles.thumb}
                        trackStyle={{ height: 15, borderRadius: 10 }}
                        minimumTrackTintColor={colors.secondary}
                        maximumTrackTintColor={trackTintColor}
                        value={this.state.bri}
                        onValueChange={this.changeBrightnessState}
                    />
                    <Text style={[styles.textPer, textcolor]}>{this.state.briPer}</Text>
                    <Text style={[styles.textControl, textcolor, { marginBottom: 10 }]}>Saturation</Text>
                    <Slider
                        minimumValue={1}
                        maximumValue={254}
                        step={10}
                        style={{ height: 25 }}
                        thumbStyle={styles.thumb}
                        trackStyle={{ height: 15, borderRadius: 10 }}
                        minimumTrackTintColor={colors.secondary}
                        maximumTrackTintColor={trackTintColor}
                        value={this.state.sat}
                        onValueChange={this.changeSaturationState}
                    />
                    <Text style={[styles.textPer, textcolor]}>{this.state.satPer}</Text>
                    <ColorPicker
                        onColorChange={this.changeColorLightState}
                        style={{ flex: 1 }}
                        hideSliders={true}
                    />
                </Block>
            </Block>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        _FetchLampStateByID(id) {
            return dispatch(GetLightAtrributes(id));
        },
        _ChangeLampStateByID(id, data) {
            return dispatch(SetLampState(id, data));
        }
    }
}

const mapStateToProps = (state) => {
    return {
        nightmode: state.nightmode,
        cloud_enable: state.cloud_enable,
        bridgeip: state.bridgeip,
        bridgeIndex: state.bridgeIndex,
        username: state.username,
        lights: state.lights
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewControlBulb)

const styles = StyleSheet.create({
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25
    },
    thumb: {
        width: 25,
        height: 25,
        borderRadius: 25,
        borderColor: 'white',
        borderWidth: 3,
        backgroundColor: theme.colors.secondary,
    },
    textInput: {
        height: 30,
        borderBottomWidth: .5,
        borderRadius: 0,
        borderWidth: 0,
        textAlign: 'left',
        paddingBottom: 10
    },
    textPer: {
        textAlign: 'right'
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold'
    },
    textControl: {
        textAlign: 'left'
    },
    divider: {
        marginTop: 10,
        marginVertical: 5,
        marginHorizontal: 2,
        borderBottomWidth: 1,
        borderColor: "#E1E3E8"
    },
    header: {
        marginTop: 40,
        paddingHorizontal: theme.sizes.base * 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});