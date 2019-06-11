import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, View, ScrollView, Alert } from 'react-native'
import { Block, Text, Button, Input } from '../../components';
import { theme } from '../../constants';
import { CreateSchedules } from '../../redux/actions';
import { connect } from 'react-redux';

import ToggleSwitch from '../../components/ToggleSwitch'
import DateTimePicker from "react-native-modal-datetime-picker";

class AddSchedules extends Component {
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
        name: null,
        description: null,
        categories: "Add categories",
        time: "Add time",
        homeSelected: false,
        roomSelected: null,
        bulbSelected: null,
        enabled: true,
        repeat: true,
        isTimePickerVisible: false,
        loading: false
    }


    bin_to_dec(bstr) {
        return parseInt((bstr + '')
            .replace(/[^01]/gi, ''), 2);
    }

    formatTimeShow(t_24) {
        var hour = t_24.substring(0, 2) % 12;
        var minute = t_24.substring(3);
        if (hour === 0) hour = 12;
        return (hour < 10 ? '0' : '') + hour + ':' + minute + (t_24.substring(0, 2) < 12 ? ' AM' : ' PM');
    }

    changeNameText = (value) => {
        this.setState({ name: value })
    }

    changeDescText = (value) => {
        this.setState({ description: value })
    }

    returnCategoryData(category) {
        this.setState({ categories: category });
    }

    returnLocationData(arg, where) {
        if (arg == "Home") {
            this.setState({
                homeSelected: true,
                bulbSelected: null,
                roomSelected: null
            })
        }
        else if (arg == "room") {
            this.setState({
                homeSelected: false,
                bulbSelected: null,
                roomSelected: where
            })
        }
        else if (arg == "bulb") {
            this.setState({
                homeSelected: false,
                bulbSelected: where,
                roomSelected: null
            })
        }
    }


    dayOpacity = {
        Monday: {
            selected: false
        },
        Tuesday: {
            selected: false
        },
        Wednesday: {
            selected: false
        },
        Thursday: {
            selected: false
        },
        Friday: {
            selected: false
        },
        Saturday: {
            selected: false
        },
        Sunday: {
            selected: false
        }
    };

    updateDay = (val) => {
        const newBoolean = !this.dayOpacity[val].selected;
        this.dayOpacity[val].selected = newBoolean
        this.forceUpdate()
    }

    calculateRepDay = async () => {
        let utc = "0";
        for (var key in this.dayOpacity) {
            if (this.dayOpacity[key].selected) {
                utc = utc + 1
            }
            else {
                utc = utc + 0
            }
        }
        return `W${this.bin_to_dec(utc)}`
    }


    confirmAddSchedule = async() => {
        const { username, bridgeIndex } = this.props;
        const { homeSelected, roomSelected, bulbSelected,
            categories, time, name, description, enabled, repeat } = this.state;

        if (name == null ||
            time == "Add time" ||
            categories == "Add categories" ||
            (homeSelected == false && roomSelected == null && bulbSelected == null)) 
            {
            Alert.alert(
                'Invalid Input',
                'Please fill the required field to proceed',
                { cancelable: true },
            );
        }
        else {
            var utcDaySelected = await this.calculateRepDay();
            var localtime = `${utcDaySelected}/T${time}:00`
            if (homeSelected == true) {
                var address = `/api/${username[bridgeIndex]}/api/groups/0/action`
            }
            else if (roomSelected != null) {
                var address = `/api/${username[bridgeIndex]}/api/groups/${roomSelected}/action`
            }
            else if (bulbSelected != null) {
                var address = `/api/${username[bridgeIndex]}/api/lights/${bulbSelected}/action`
            }

            if (categories == "Wake up" || categories == "I'm home") {
                var body = { on: true }
            }
            else if (categories == "Sleep" || categories == "I'm away") {
                var body = { on: false }
            }

            this.props._CreateSchedules({
                "name": `${name}#${categories}`,
                "description": description,
                "status": enabled ? "enabled" : "disabled",
                "autodelete": repeat ? false : true,
                "command": {
                    "address": address,
                    "method": "PUT",
                    "body": body
                },
                "localtime": localtime
            });

            Alert.alert(
                'Result',
                'Name : ' + name +
                '\nCategories : ' + categories +
                '\nDateTime : ' + localtime +
                '\nAddress : ' + address +
                '\nBody : ' + scheduleData,
                { cancelable: true },
            );
        }
    }


    renderCategories() {
        const { nightmode, navigation } = this.props;
        const { colors } = theme;
        const textcolor = { color: nightmode ? colors.gray2 : colors.black }
        if (this.state.categories == "Add categories") {
            return (
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('CategoryListScreen', { returnData: this.returnCategoryData.bind(this) });
                    }}>
                    <Block flex={false} row space="between" style={{ alignSelf: 'center' }}>
                        <Text style={textcolor}>{this.state.categories}</Text>
                        <Text style={textcolor}> ></Text>
                    </Block>
                </TouchableOpacity>
            )
        }
        else {
            return (
                <Block flex={false} row space="between" style={{ alignSelf: 'center' }}>
                    <Text style={textcolor}>{this.state.categories}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('CategoryListScreen', { returnData: this.returnCategoryData.bind(this) });
                        }}>
                        <Text style={[{ color: '#20D29B' }]}> Edit</Text>
                    </TouchableOpacity>
                </Block>
            )
        }
    }

    renderWhere() {
        const { nightmode, navigation } = this.props;
        const { roomSelected, bulbSelected, homeSelected } = this.state;
        const { colors } = theme;
        const textcolor = { color: nightmode ? colors.gray2 : colors.black }
        if (homeSelected == false && roomSelected == null && bulbSelected == null) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('LocationListScreen', { returnData: this.returnLocationData.bind(this) });
                    }}>
                    <Block flex={false} row space="between" style={{ alignSelf: 'center' }} >
                        <Text style={textcolor}>Add location</Text>
                        <Text style={textcolor}> ></Text>
                    </Block>
                </TouchableOpacity>
            )
        }
        else {
            return (
                <Block flex={false} row space="between" style={{ alignSelf: 'center' }} >
                    {this.renderWhereText()}
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('LocationListScreen', { returnData: this.returnLocationData.bind(this) });
                        }}>
                        <Text style={[{ color: '#20D29B' }]}> Edit</Text>
                    </TouchableOpacity>
                </Block>
            )
        }
    }

    renderWhereText() {
        const { nightmode, groups, lights } = this.props;
        const { roomSelected, bulbSelected, homeSelected } = this.state;
        const { colors } = theme;
        const textcolor = { color: nightmode ? colors.gray2 : colors.black }
        if (roomSelected != null) {
            return (
                <Text style={textcolor}>{groups[roomSelected].name}</Text>
            )
        }
        else if (bulbSelected != null) {
            return (
                <Text style={textcolor}>{lights[bulbSelected].name}</Text>
            )
        }
        else if (homeSelected == true) {
            return (
                <Text style={textcolor}>Home</Text>
            )
        }
    }

    handleTimePicked = (time) => {
        var datetime = new Date(time);
        var hour = datetime.getUTCHours()
        var minute = datetime.getUTCMinutes()
        if (hour <= 9) {
            hour = "0" + hour
        }

        if (minute <= 9) {
            minute = "0" + minute
        }

        this.setState({
            isTimePickerVisible: false,
            time: hour + ":" + minute
        })
    };

    renderWhen() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const textcolor = { color: nightmode ? colors.gray2 : colors.black }
        if (this.state.time == "Add time") {
            return (
                <TouchableOpacity
                    onPress={() => this.setState({ isTimePickerVisible: true })}>
                    <Block flex={false} row space="between" style={{ alignSelf: 'center' }}>
                        <Text style={textcolor}>{this.state.time}</Text>
                        <Text style={textcolor}> ></Text>
                    </Block>
                    {this.renderDatePicker()}
                </TouchableOpacity>
            )
        }
        else {
            return (
                <Block flex={false} row space="between" style={{ alignSelf: 'center' }}>
                    <Text style={[textcolor, { alignSelf: 'center' }]}>{this.formatTimeShow(this.state.time)}</Text>
                    <TouchableOpacity
                        onPress={() => this.setState({ isTimePickerVisible: true })}>
                        <Text style={{ color: '#20D29B' }}> Edit</Text>
                    </TouchableOpacity>
                    {this.renderDatePicker()}
                </Block>
            )
        }
    }

    renderDatePicker() {
        return (
            <DateTimePicker
                isVisible={this.state.isTimePickerVisible}
                onConfirm={this.handleTimePicked}
                titleIOS="Pick a time"
                onCancel={() => { this.setState({ isTimePickerVisible: false }) }}
                mode="time"
                is24Hour={false}
                timePickerModeAndroid="clock"
                timeZoneOffsetInMinutes={0}
                dismissOnBackdropPressIOS={true}
            />
        )
    }

    renderDay() {
        const { dayOpacity } = this;
        const { nightmode } = this.props;
        const { colors } = theme;
        const textcolor = { color: nightmode ? colors.white : colors.black }
        return (
            Object.keys(dayOpacity).map(val => (
                <TouchableOpacity
                    key={val}
                    style={[styles.roundDay, {
                        borderColor: dayOpacity[val].selected ? colors.secondary : 'white',
                        backgroundColor: dayOpacity[val].selected ? colors.secondary : null
                    }]}
                    onPress={() => this.updateDay(val)}>
                    <Text style={textcolor}>{val.charAt(0)}</Text>
                </TouchableOpacity>
            )))
    }

    renderOn() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const textcolor = { color: nightmode ? colors.white : colors.black }
        return (
            <Block row space="between" style={{ marginTop: 40 }}>
                <Text bold style={[styles.textControl, textcolor, { alignSelf: 'center' }]}>Enable Schedule</Text>
                <ToggleSwitch
                    offColor="#DDDDDD"
                    onColor={theme.colors.secondary}
                    isOn={this.state.enabled}
                    onToggle={(boolean) => this.setState({ enabled: boolean })}
                />
            </Block>
        )
    }

    renderRepeat() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const textcolor = { color: nightmode ? colors.white : colors.black }
        return (
            <Block row space="between" style={{ marginTop: 40, marginBottom: 20 }}>
                <Text bold style={[styles.textControl, textcolor, { alignSelf: 'center' }]}>Repeat</Text>
                <ToggleSwitch
                    offColor="#DDDDDD"
                    onColor={theme.colors.secondary}
                    isOn={this.state.repeat}
                    onToggle={(boolean) => this.setState({ repeat: boolean })}
                />
            </Block>
        )
    }

    renderCreateButton() {
        return (
            <Block bottom flex={1} style={{ marginBottom: 10 }}>
                <Button gradient
                    startColor='#0A7CC4'
                    endColor='#2BDACD'
                    onPress={() => this.confirmAddSchedule()}>
                    <Text center semibold white>Create new schedule</Text>
                </Button>
            </Block>
        )
    }

    renderInput() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const bordercolor = { borderColor: nightmode ? colors.white : colors.gray2 }
        const textcolor = { color: nightmode ? colors.gray2 : colors.black }
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        return (
            <Block>
                <Text bold h3 style={[styles.textControl, titlecolor, styles.row]}>Name</Text>
                <Input
                    style={[styles.textInput, textcolor, bordercolor]}
                    editable={true}
                    value={this.state.name}
                    placeholderTextColor={nightmode ? colors.gray2 : colors.black}
                    onChangeText={this.changeNameText}
                />
                <Text bold h3 style={[styles.textControl, titlecolor, { marginTop: 20 }]}>Description</Text>
                <Input
                    style={[styles.textInput, textcolor, bordercolor]}
                    editable={true}
                    value={this.state.description}
                    placeholder={'None'}
                    placeholderTextColor={nightmode ? colors.gray2 : colors.black}
                    onChangeText={this.changeDescText}
                />
            </Block>
        )
    }

    render() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        const textcolor = { color: nightmode ? colors.gray2 : colors.black }
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        return (
            <Block style={backgroundcolor}>
                <Block container style={{ marginBottom: 20 }}>
                    <Text h1 bold style={titlecolor}>Add Schedules</Text>
                    <ScrollView
                        showsVerticalScrollIndicator={false}>
                        {this.renderInput()}
                        <Text style={[styles.textControl, textcolor, { marginTop: 10 }]}>Days of the week</Text>
                        <Block flex={false} row space="between" style={{ marginTop: 20 }}>
                            {this.renderDay()}
                        </Block>
                        <View style={[styles.divider, { marginTop: 30 }]} />
                        <Block flex={false} row space="between" style={{ marginTop: 10 }}>
                            <Text style={titlecolor}>Categories</Text>
                            {this.renderCategories()}
                        </Block>
                        <View style={[styles.divider, { marginTop: 10 }]} />
                        <Block flex={false} row space="between" style={{ marginTop: 10 }}>
                            <Text style={[titlecolor, { alignSelf: 'center' }]}>When</Text>
                            {this.renderWhen()}
                        </Block>
                        <View style={[styles.divider, { marginTop: 10 }]} />
                        <Block flex={false} row space="between" style={{ marginTop: 10 }}>
                            <Text style={[titlecolor, { alignSelf: 'center' }]}>Where</Text>
                            {this.renderWhere()}
                        </Block>
                        <View style={[styles.divider, { marginTop: 10 }]} />
                        {this.renderOn()}
                        {this.renderRepeat()}
                        {this.renderCreateButton()}
                    </ScrollView>
                </Block>
            </Block>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        nightmode: state.nightmode,
        bridgeip: state.bridgeip,
        bridgeIndex: state.bridgeIndex,
        username: state.username,
        groups: state.groups,
        lights: state.lights,
        schedules: state.schedules
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        _CreateSchedules(data) {
            return dispatch(CreateSchedules(data));
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddSchedules)

const styles = StyleSheet.create({
    row: {
        marginTop: 20,
    },
    textRow: {
        fontSize: 16,
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
    textControl: {
        textAlign: 'left'
    },
    roundDay: {
        borderWidth: 1,
        borderRadius: 20,
        width: 30,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    divider: {
        borderBottomWidth: 0.5,
        borderColor: "#E1E3E8"
    }
});