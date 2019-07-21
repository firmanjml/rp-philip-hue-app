import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { ColorWheel } from 'react-native-color-wheel';
import { connect } from 'react-redux'
import { SetLampState } from '../../redux/actions'
import ToggleSwitch from '../../components/ToggleSwitch'
import _ from 'lodash'

import { ColorConversionToXY } from '../../components/ColorConvert';
import { theme } from '../../constants';

import { Block, Input, Text } from '../../components';

import Slider from 'react-native-slider';

import axios from 'axios';

class ControlBulb extends React.Component {

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
        id: null,
        sat: null,
        bri: null,
        on : null,
        dimmableType: null,
        satPer: null,
        briPer: null,
        roomName: "None"
    };

    componentWillMount() {
        this.setState({ id: this.props.navigation.getParam('id', 1) })
    }

    componentDidMount() {
        const { lights } = this.props;
        const { id } = this.state;
        this.calculatePercentage("bri", lights[id].state.bri)
        this.calculatePercentage("sat", lights[id].state.sat)
        this.setState({
            sat: lights[id].state.sat,
            dimmableType: lights[id].type != "Dimmable light" ? false : true,
            bri: lights[id].state.bri,
            on : lights[id].state.on
        })
    }

    changeColorLightState = _.throttle((values) => {
        const { bridgeip, username, bridgeIndex, lights, _changeLampStateByID } = this.props;
        const { id, on} = this.state;

        let h = Math.sign(values.h) === -1 ? 360 + (values.h) : values.h
        let s = values.s;
        let v = values.v;

        let colors = {
            h,
            s,
            v
        }
        if (!on) {
            this.turnOnOffBulb(true)
        }
        axios({
            method: "PUT",
            url: `http://${bridgeip[bridgeIndex]}/api/${
                username[bridgeIndex]
                }/lights/${id}/state`,
            data: { xy: ColorConversionToXY(colors) }
        })
    }, 600);


    changeSatLightState = _.throttle((values) => {
        const { _changeLampStateByID } = this.props;
        const { id,on } = this.state;

        if (!on) {
            this.turnOnOffBulb(true)
        }
        _changeLampStateByID(id, {
            sat: values
        });
        this.setState({
            sat : values
        })
        this.calculatePercentage("sat", values);
    },100);

    changeBriLightState = _.throttle((values) => {
        const { _changeLampStateByID } = this.props;
        const { id, on } = this.state;
        if (!on) {
            this.turnOnOffBulb(true)
        }
        _changeLampStateByID(id, {
            bri: values
        });
        this.setState({
            bri : values
        })
        this.calculatePercentage("bri", values);
    },100);

    calculatePercentage = (arg, values) => {
        const result = Math.round((values * 100) / 254);
        if (result == 0) {
            if (arg == "sat") {
                this.setState({ satPer: 1 + "%" })
            }
            else {
                this.setState({ briPer: 1 + "%" })
            }
        }
        else {
            if (arg == "sat") {
                this.setState({ satPer: result + "%" })
            }
            else {
                this.setState({ briPer: result + "%" })
            }
        }
    }

    renderControl() {
        const { nightmode, lights } = this.props;
        const { dimmableType, bri, sat, briPer, satPer, id } = this.state;
        const { colors } = theme;
        const trackTintColor = nightmode ? "rgba(157, 163, 180, 0.10)" : "#DDDDDD"
        const textcolor = { color: nightmode ? colors.white : colors.gray3 }
        const controls = dimmableType ? ["Brightness"] : ["Brightness", "Saturation"]
        return (
            controls.map(control => (
                <View>
                    <Text style={[styles.textControl, textcolor, { marginBottom: 10 }]}>{control}</Text>
                    <Slider
                        minimumValue={1}
                        maximumValue={254}
                        style={{ height: 19 }}
                        thumbStyle={styles.thumb}
                        trackStyle={{ height: 10, borderRadius: 10 }}
                        minimumTrackTintColor={theme.colors.secondary}
                        maximumTrackTintColor={trackTintColor}
                        value={control == "Brightness" ? bri : sat}
                        onValueChange={control == "Brightness" ? this.changeBriLightState : this.changeSatLightState}
                    />
                    <Text style={[styles.textPer, textcolor]}>{control == "Brightness" ? briPer : satPer}</Text>
                </View>
            )))
    }

    renderColorPicker() {
        const { dimmableType } = this.state;
        if (!dimmableType) {
            return (
                <ColorWheel
                    onColorChange={this.changeColorLightState}
                />
            )
        }
    }

    turnOnOffBulb = (bool) => {
        const { _changeLampStateByID } = this.props;
        _changeLampStateByID(this.state.id, {
            on: bool
        })
        this.setState({
            on : bool
        })
    }

    renderToggleButton() {
        const { on } = this.state
        return (
            <ToggleSwitch
                offColor="#DDDDDD"
                onColor={theme.colors.secondary}
                isOn={on}
                onToggle={this.turnOnOffBulb}
            />
        )
    }

    render() {
        const { nightmode, lights } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        const textcolor = { color: nightmode ? colors.white : colors.gray3 }
        const bordercolor = { borderColor: nightmode ? colors.white : colors.gray2 }
        return (
            <Block style={backgroundcolor}>
                <Block container>
                    <View style={styles.titleRow}>
                        <Text style={[styles.title, titlecolor]}>{lights[this.state.id].name}</Text>
                        {this.renderToggleButton()}
                    </View>
                    <Text style={[styles.textControl, textcolor]}>Room Name</Text>
                    <Input
                        style={[styles.textInput, titlecolor, bordercolor]}
                        editable={false}
                        value={this.state.roomName}
                        placeholderTextColor={nightmode ? colors.gray2 : colors.black}
                    />
                    {this.renderControl()}
                    {this.renderColorPicker()}
                </Block>
            </Block >
        )
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        _changeLampStateByID(id, data) {
            return dispatch(SetLampState(id, data));
        }
    }
}

const mapStateToProps = (state) => {
    return {
        lights: state.lights,
        bridgeIndex: state.bridgeIndex,
        bridgeip: state.bridgeip,
        username: state.username,
        nightmode: state.nightmode
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ControlBulb)

const styles = StyleSheet.create({
    lightPicker: {
        width: 10,
    },
    textInput: {
        height: 30,
        borderBottomWidth: .5,
        borderRadius: 0,
        borderWidth: 0,
        textAlign: 'left',
        paddingBottom: 10
    },
    thumb: {
        width: theme.sizes.base,
        height: theme.sizes.base,
        borderRadius: theme.sizes.base,
        borderColor: 'white',
        borderWidth: 3,
        backgroundColor: theme.colors.secondary,
    },
    textPer: {
        textAlign: 'right'
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold'
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25
    },
    textControl: {
        textAlign: 'left'
    }
})
