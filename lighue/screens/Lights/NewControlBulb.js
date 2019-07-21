import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Block, Text, Input } from '../../components';
import Slider from 'react-native-slider';
import { theme } from '../../constants';
import { ColorWheel } from 'react-native-color-wheel';
import { connect } from 'react-redux';
import ToggleSwitch from '../../components/ToggleSwitch'
import _ from 'lodash';
import { ColorConversionToXY } from '../../components/ColorConvert';
import { GetLightAtrributes, SetLampState } from '../../redux/actions';
class NewControlBulb extends Component {
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
        id: 0,
        roomName: 'None',
        bri: 0,
        sat: 0,
        colorHex: null
    }

    componentWillMount() {
        this.setState({
            id: this.props.navigation.getParam('id', '1'),
            colorHex: this.props.navigation.getParam('colorHex', '#ffffff')
        })
        this.props._FetchLampStateByID(this.props.navigation.getParam('id', '1'));
    }

    componentDidMount() {
        this.setState({
            bri: this.props.lights[this.state.id].state.bri,
            sat: this.props.lights[this.state.id].state.sat,
        })
    }

    changeColorLightState = _.throttle((values) => {
        const { _ChangeLampStateByID } = this.props;
        const { id } = this.state;

        let h = Math.sign(values.h) === -1 ? 360 + (values.h) : values.h
        let s = values.s;
        let v = values.v;

        let colors = {
            h,
            s,
            v
        }
        _ChangeLampStateByID(id, {
            "on": true,
            "xy": ColorConversionToXY(colors)
        })
    }, 500);

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
                <Block container>
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
                        step={10}
                        style={{ height: 25 }}
                        thumbStyle={styles.thumb}
                        trackStyle={{ height: 15, borderRadius: 10 }}
                        minimumTrackTintColor={colors.secondary}
                        maximumTrackTintColor={trackTintColor}
                        value={this.state.bri}
                        onValueChange={(value) => {
                            _ChangeLampStateByID(this.state.id, {
                                "on": true,
                                "bri": value
                            })
                        }}
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
                        onValueChange={(value) => {
                            _ChangeLampStateByID(this.state.id, {
                                "on": true,
                                "sat": value
                            })
                        }}
                    />
                    <Text style={[styles.textPer, textcolor]}>{this.state.satPer}</Text>
                    <ColorWheel
                        onColorChange={this.changeColorLightState}
                        initialColor={this.state.colorHex}
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
    }
});
