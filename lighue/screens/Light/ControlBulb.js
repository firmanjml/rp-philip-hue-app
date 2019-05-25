import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { ColorPicker } from 'react-native-color-picker'

import { connect } from 'react-redux'
import { GetAllLights, SetLampState } from '../../redux/actions'
import ToggleSwitch from '../../components/ToggleSwitch'

import { ColorConversionToXY, ConvertXYtoHex } from '../../components/ColorConvert';
import { theme } from '../../constants';

import { Block, Input, Text } from '../../components';

import Slider from 'react-native-slider';

import axios from 'axios';

var interval;
class ControlBulb extends React.Component {

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

    state = {
        id: 1,
        color: null,
        sat: null,
        bri: null,
        satPer: null,
        briPer: null,
        isOnDefaultToggleSwitch: false,
        roomName : "Bedroom",
        bulbName: "Hue Lamp 1"
    };

    componentWillMount() {
        interval = setInterval(() => {
            this.props._fetchAllLights();
        }, 1000)
    }

    async componentDidMount() {
        await this.initialState();
    }

    initialState = async () => {
        var x = await this.props.lights[this.state.id].state.xy[0]
        var y = await this.props.lights[this.state.id].state.xy[1]
        var bri = await this.props.lights[this.state.id].state.bri
        var result = await ConvertXYtoHex(x, y, bri)
        this.setState({
            name: this.props.lights[this.state.id].name,
            color: result,
            sat: this.props.lights[this.state.id].state.sat,
            bri: bri,
            isOnDefaultToggleSwitch: this.props.lights[this.state.id].state.on
        });
        await this.calculatePercentage("bri", this.state.bri)
        await this.calculatePercentage("sat", this.state.sat)
    }

    calculatePercentage = (arg, values) => {
        let result = Math.round((values * 100) / 254);
        if (result == 0) {
            if (arg == "sat") {
                this.setState({ satPer: 1 })
            }
            else {
                this.setState({ briPer: 1 })
            }
        }
        else {
            if (arg == "sat") {
                this.setState({ satPer: result })
            }
            else {
                this.setState({ briPer: result })
            }
        }
    }

    changeLightState = (arg, values) => {
        if (!this.state.isOnDefaultToggleSwitch) {
            this.props._changeLampStateByID(this.state.id, {
                on: true
            });
            this.setState({
                isOnDefaultToggleSwitch: true
            })
        }

        if (arg == "color") {
            let result = ColorConversionToXY(values);
            axios({
                method: 'PUT',
                url: `http://${this.props.bridgeip}/api/${this.props.username}/lights/${this.state.id}/state`,
                data: { xy: result }
            })
        }
        else if (arg == "sat") {
            this.props._changeLampStateByID(this.state.id, {
                sat: values
            });
            this.calculatePercentage("sat", values);
        }
        else if (arg == "bri") {
            this.props._changeLampStateByID(this.state.id, {
                bri: values
            });
            this.calculatePercentage("bri", values);
        }
    }

    changeOnState = (boolean) => {
        this.props._changeLampStateByID(this.state.id, {
            on: boolean
        });
    }

    renderBriSlider() {
        return (
            <Slider
                minimumValue={1}
                maximumValue={254}
                style={{ height: 19 }}
                thumbStyle={styles.thumb}
                trackStyle={{ height: 10, borderRadius: 10 }}
                minimumTrackTintColor={theme.colors.secondary}
                maximumTrackTintColor="rgba(157, 163, 180, 0.10)"
                value={this.state.bri}
                onValueChange={(value) => this.changeLightState("bri", value)}
            />
        )
    }

    renderSatSlider() {
        return (
            <Slider
                minimumValue={1}
                maximumValue={254}
                style={{ height: 19 }}
                thumbStyle={styles.thumb}
                trackStyle={{ height: 10, borderRadius: 10 }}
                minimumTrackTintColor={theme.colors.secondary}
                maximumTrackTintColor="rgba(157, 163, 180, 0.10)"
                value={this.state.sat}
                onValueChange={(value) => this.changeLightState("sat", value)}
            />
        )
    }

    renderColorPicker() {
        return (
            <ColorPicker
                onColorChange={(color) => this.changeLightState("color", color)}
                style={{ flex: 1 }}
                hideSliders={true}
                color={this.state.color}
            />
        )
    }

    renderToggleButton() {
        return (
            <ToggleSwitch
                offColor="rgba(157, 163, 180, 0.10)"
                onColor={theme.colors.secondary}
                isOn={this.state.isOnDefaultToggleSwitch}
                onToggle={isOnDefaultToggleSwitch => {
                    this.setState({ isOnDefaultToggleSwitch });
                    this.changeOnState(isOnDefaultToggleSwitch);
                }}
            />
        )
    }

    render() {
        return (
            <Block style={styles.container}>
                <Block style={styles.colorControl}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{this.state.bulbName}</Text>
                        {this.renderToggleButton()}
                    </View>
                    <Text style={styles.textControl}>
                        Room Name
                        </Text>
                    <Input
                        style={styles.textInput}
                        editable={false}
                        value = {this.state.roomName}
                        placeholderTextColor={theme.colors.gray2}
                    />
                    <Text style={[styles.textControl, {marginBottom: 10}]}>Brightness</Text>
                {this.renderBriSlider()}
                <Text style={styles.textPer}>{this.state.briPer}%</Text>
                <Text style={[styles.textControl, {marginBottom: 10}]}>Saturation</Text>
                {this.renderSatSlider()}
                <Text style={styles.textPer}>{this.state.satPer}%</Text>
                {this.renderColorPicker()}
            </Block>
            </Block >
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        _changeLampStateByID(id, data) {
            return dispatch(SetLampState(id, data));
        },
        _fetchAllLights() {
            return dispatch(GetAllLights())
        }
    }
}

const mapStateToProps = (state) => {
    return {
        lights: state.lights,
        bridgeip: state.bridgeip,
        username: state.username
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ControlBulb)

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background
    },
    lightPicker: {
        width: 10
    },
    textInput: {
        height: 20,
        borderBottomWidth: .5,
        borderRadius: 0,
        borderWidth: 0,
        color: 'white',
        borderColor: 'white',
        textAlign: 'left',
        paddingBottom: 10
    },
    colorControl: {
        marginLeft: theme.sizes.base * 2,
        marginRight: theme.sizes.base * 2
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
        textAlign: 'right',
        color: 'white'
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white'
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25
    },
    textControl: {
        textAlign: 'left',
        color: 'white'
    }
})
