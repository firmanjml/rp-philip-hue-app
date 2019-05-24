import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { ColorPicker } from 'react-native-color-picker'

import { connect } from 'react-redux'
import { GetAllLights, SetLampState } from '../../redux/actions'
import ToggleSwitch from '../../components/ToggleSwitch'

import { ColorConversionToXY } from '../../components/ColorConvert';
import { theme } from '../../constants';

import { Block } from '../../components';

import Slider from 'react-native-slider';
import RNPickerSelect from 'react-native-picker-select';

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
        sat: null,
        bri: null,
        satPer: null,
        briPer: null,
        isOnDefaultToggleSwitch: false,
        name: "Hue Lamp 1"
    };

    componentWillMount() {
        this.props._fetchAllLights();
        interval = setInterval(() => {
            this.props._fetchAllLights();
          }, 1000)
        
    }

    async componentDidMount() {
        await this.setState({
            name: this.props.lights[this.state.id].name,
            sat: this.props.lights[this.state.id].state.sat,
            bri: this.props.lights[this.state.id].state.bri,
            isOnDefaultToggleSwitch: this.props.lights[this.state.id].state.on
        })
        await this.calculatePercentage("bri", this.state.bri)
        await this.calculatePercentage("sat", this.state.sat)
    }

    componentWillUnmount() {
        clearInterval(interval);
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
            this.calculatePercentage("sat",values);
        }
        else if (arg == "bri") {
            this.props._changeLampStateByID(this.state.id, {
                bri: values
            });
            this.calculatePercentage("bri",values);
        }
    }

    changeOnState = (boolean) => {
        this.props._changeLampStateByID(this.state.id, {
            on: boolean
        });
    }

    changeLightPicker = async (idNew) => {
        await this.setState({
            id: idNew,
            sat: this.props.lights[idNew].state.sat,
            bri: this.props.lights[idNew].state.bri,
            isOnDefaultToggleSwitch: this.props.lights[idNew].state.on
        });
        await this.calculatePercentage("bri", this.props.lights[idNew].state.bri);
        await this.calculatePercentage("sat", this.props.lights[idNew].state.sat);
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

    renderLightPicker() {
        const lights = [
            {
                label: 'Hue Light 2',
                value: '2',
            },
            {
                label: 'Hue Light 3',
                value: '3',
            },
            {
                label: 'Hue Light 4',
                value: '4',
            },
            {
                label: 'Hue Light 5',
                value: '5',
            },
            {
                label: 'Hue Light 6',
                value: '6',
            }
        ];

        const placeholder = {
            label: "Hue Light 1",
            value: '1',
            color: 'black',
        };

        return (
            <RNPickerSelect
                placeholder={placeholder}
                items={lights}
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                onValueChange={(value) => this.changeLightPicker(value)}
            />
        )
    }

    render() {
        return (
            <Block style={styles.container}>
                <Block style={styles.colorControl}>
                    <View style={styles.titleRow}>
                        {/* <Text style={styles.title}>{this.state.name}</Text> */}
                        {this.renderLightPicker()}
                        {this.renderToggleButton()}
                    </View>
                    <Text style={styles.textControl}>Brightness</Text>
                    {this.renderBriSlider()}
                    <Text style={styles.textPer}>{this.state.briPer}%</Text>
                    <Text style={styles.textControl}>Saturation</Text>
                    {this.renderSatSlider()}
                    <Text style={styles.textPer}>{this.state.satPer}%</Text>
                    {this.renderColorPicker()}
                </Block>
            </Block>
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
    colorControl: {
        marginTop: 40,
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
        marginBottom: 30
    },
    textControl: {
        textAlign: 'left',
        color: 'white',
        marginBottom: 10
    }
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 26,
        color: 'white',
        paddingRight: 30
    },
    inputAndroid: {
        fontSize: 26,
        color: 'white',
        paddingRight: 30, 
      },
});
