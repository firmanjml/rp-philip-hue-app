import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, View, ActivityIndicator, Modal } from 'react-native'
import { Block, Text, Input, Button } from '../../components';
import { theme, constant } from '../../constants';
import { connect } from 'react-redux';
import { ColorWheel } from 'react-native-color-wheel';
import { CreateScenes, SetLampState } from '../../redux/actions';
import { ColorConversionToXY } from '../../components/ColorConvert';
import axios from 'axios';

class AddScenes extends Component {
    static navigationOptions = {
        header: null
    }

    state = {
        name: null,
        newStateBulbColor: null,
        oldStateBulb: null,
        locationType: null,
        locationID: null,
        mode: "ColorPicker",
    };

    componentWillMount() {
        const { locationType, locationID } = this.props.navigation.state.params;
        this.setState({
            locationType: locationType,
            locationID: locationID
        })
    }

    componentDidMount() {
        if (this.state.locationType == "Bulb") {
            this.setState({
                oldStateBulb: this.props.lights[this.state.locationID].state
            })
        }
    }

    componentWillUnmount() {
        const { bridgeIndex, bridgeip, username } = this.props;
        const { locationID } = this.state;
        axios({
            method: "PUT",
            url: `http://${bridgeip[bridgeIndex]}/api/${username[bridgeIndex]}/lights/${locationID}/state`,
            data: this.state.oldStateBulb
        });
    }

    changeColorSceneState = values => {
        const { bridgeip, username, bridgeIndex, lights, _changeLampStateByID } = this.props;
        const { locationID } = this.state;

        let h = Math.sign(values.h) === -1 ? 360 + (values.h) : values.h
        let s = values.s;
        let v = values.v;

        let colors = {
            h,
            s,
            v
        }

        if (!lights[locationID].state.on) {
            _changeLampStateByID(locationID, {
                on: true
            });
        }

        axios({
            method: "PUT",
            url: `http://${bridgeip[bridgeIndex]}/api/${username[bridgeIndex]}/lights/${locationID}/state`,
            data: { xy: ColorConversionToXY(colors) }
        });
        this.setState({ newStateBulbColor: ColorConversionToXY(colors) })
    };

    renderBackButton() {
        const { navigation } = this.props;
        return (
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ height: 40, width: 80, justifyContent: "center" }}
            >
                <Image source={require("../../assets/icons/back.png")} />
            </TouchableOpacity>
        )
    }

    renderSave() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const textcolor = { color: nightmode ? colors.white : colors.black }
        if (this.state.name != null) {
            return (
                <TouchableOpacity
                    onPress={this.confirmAddScene}>
                    <Text style={[textcolor, { justifyContent: 'center' }]}>Save</Text>
                </TouchableOpacity>
            )
        }
    }

    changeNameText = (value) => {
        this.setState({ name: value })
        console.log(this.state.name)
    }

    onRequestCloseModal() {
        this.setState({ locationModal: false })
        this.props.navigation.goBack();
    }

    renderLoadingModal() {
        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={this.props.loading}
                onRequestClose={() => { console.log('close modal') }}>
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator
                            animating={this.props.loading}
                            color="#00ff00" />
                    </View>
                </View>
            </Modal>
        )
    }

    renderInput() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const bordercolor = { borderColor: nightmode ? colors.white : colors.gray2 }
        const textcolor = { color: nightmode ? colors.gray2 : colors.black }
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        return (
            <View>
                <Text bold h3 style={[styles.textControl, titlecolor, styles.row]}>Name</Text>
                <Input
                    style={[styles.textInput, textcolor, bordercolor]}
                    editable={true}
                    value={this.state.name}
                    placeholderTextColor={nightmode ? colors.gray2 : colors.black}
                    onChangeText={this.changeNameText}
                />
            </View>
        )
    }

    renderListBulb() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        if (this.state.locationType == "Bulb") {
            return (
                <View>
                    <Text style={titlecolor}>Lights included in the scene</Text>
                    <View>
                        <Text style={{ color: '#20D29B', marginTop: 10 }}>{this.props.lights[this.state.locationID].name}</Text>
                    </View>
                </View>
            )
        }
        else if (this.state.locationType == "Room") {
            return (
                <View>
                    <Text style={titlecolor}>Lights included in the scene</Text>
                    <Text>Coming soon...</Text>
                </View>
            )
        }
    }

    confirmAddScene() {
        if (this.state.locationType == "Bulb") {
            const lightstate = {
                
            }
            const scenesData =
            {
                "name": this.state.name,
                "lights": `[${this.state.bulb}]`,
                "lightstates": lightstate
            }
            this.props._CreateScenes(scenesData);
        }
    }

    render() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        return (
            <Block style={backgroundcolor}>
                {this.renderLoadingModal()}
                <View style={styles.header}>
                    {this.renderBackButton()}
                    {this.renderSave()}
                </View>
                <Block containerNoHeader>
                    <Text h1 bold style={[titlecolor, { marginTop: 10 }]}>Add Scenes</Text>
                    {this.renderInput()}
                    {this.renderListBulb()}
                    <ColorWheel
                        onColorChange={this.changeColorSceneState}
                        style={{ flex: 1 }}
                    />
                </Block>
            </Block>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        nightmode: state.nightmode,
        groups: state.groups,
        lights: state.lights,
        loading: state.loading,
        bridgeip: state.bridgeip,
        bridgeIndex: state.bridgeIndex,
        username: state.username
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        _CreateScenes(data, navigation) {
            return dispatch(CreateScenes(data, navigation));
        },
        _changeLampStateByID(id, data) {
            return dispatch(SetLampState(id, data));
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddScenes)

const styles = StyleSheet.create({
    row: {
        marginTop: 20,
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    header: {
        marginTop: 30,
        paddingHorizontal: theme.sizes.base * 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textSetting: {
        fontSize: 24,
        color: 'black',
        alignSelf: "center"
    },
    textInput: {
        height: 30,
        borderBottomWidth: .5,
        borderRadius: 0,
        borderWidth: 0,
        textAlign: 'left',
        paddingBottom: 10
    },
});