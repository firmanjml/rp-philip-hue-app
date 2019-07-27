import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, View, ScrollView, Alert, Modal, ActivityIndicator } from 'react-native'
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
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ height: 40, width: 80, justifyContent: 'center' }}>
                    <Image source={require('../../assets/icons/back.png')} />
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
        mode: "Repeat",
        displaydate: null,
        displaymonth: null,
        displayyear: null,
        isTimePickerVisible: false,
        isDatePickerVisible: false
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

    renderLoadingModal() {
        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={this.props.saving}
                onRequestClose={() => { console.log('close modal') }}>
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator
                            animating={this.props.saving}
                            color="#00ff00" />
                        <Text>Saving...</Text>
                    </View>
                </View>
            </Modal>
        )
    }


    confirmAddSchedule = async () => {
        const { username, bridgeIndex } = this.props;
        const { homeSelected, roomSelected, bulbSelected,
            categories, time, name, description, enabled, mode, date } = this.state;

        if (name == null ||
            time == "Add time" ||
            categories == "Add categories" ||
            (homeSelected == false && roomSelected == null && bulbSelected == null)) {
            Alert.alert(
                'Invalid Input',
                'Please fill the required field to proceed',
                { cancelable: true },
            );
        }
        else {
            var utcDaySelected = await this.calculateRepDay();
            if (homeSelected == true) {
                var address = `/api/${username[bridgeIndex]}/groups/0/action`
            }
            else if (roomSelected != null) {
                var address = `/api/${username[bridgeIndex]}/groups/${roomSelected}/action`
            }
            else if (bulbSelected != null) {
                var address = `/api/${username[bridgeIndex]}/lights/${bulbSelected}/action`
            }

            if (categories == "Wake up" || categories == "I'm home") {
                var on = true
            }
            else if (categories == "Sleep" || categories == "I'm away") {
                var on = false
            }

            if (mode == "Repeat") {
                var datetime = `${utcDaySelected}/T${time}:00`
            }
            else if (mode == "Specific Date") {
                var datetime = `${this.state.displayyear}-${this.state.displaymonth < 10 ? `0${this.state.displaymonth}` : this.state.displaymonth}-${this.state.displaydate < 10 ? `0${this.state.displaydate}` : this.state.displaydate}T${time}:00`
            }

            const scheduleData =
            {
                "name": `${name}#${categories}`,
                "description": description,
                "status": enabled ? "enabled" : "disabled",
                "command": {
                    "address": address,
                    "method": "PUT",
                    "body": {
                        "on": on
                    }
                },
                "localtime": datetime,
            }
            console.log(scheduleData)
            this.props._CreateSchedules(scheduleData, this.props.navigation);
        }
    }

    renderTab(tab, backgroundcolor) {
        const { mode } = this.state, isActive = mode === tab;

        return (
            <TouchableOpacity
                key={`tab-${tab}`}
                onPress={() => {
                    this.setState({ mode: tab })
                }}
                style={[
                    styles.tab,
                    backgroundcolor,
                    isActive ? styles.active : null
                ]}>
                <Text size={16} bold gray={!isActive} secondary={isActive}>
                    {tab}
                </Text>
            </TouchableOpacity>
        )
    }



    renderCategories(textcolor) {
        const { navigation } = this.props;
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

    renderWhere(textcolor) {
        const { navigation } = this.props;
        const { roomSelected, bulbSelected, homeSelected } = this.state;
        if (homeSelected == false && roomSelected == null && bulbSelected == null) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('ScheduleLocationListScreen', { returnData: this.returnLocationData.bind(this) });
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
                    {this.renderWhereText(textcolor)}
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('ScheduleLocationListScreen', { returnData: this.returnLocationData.bind(this) });
                        }}>
                        <Text style={[{ color: '#20D29B' }]}> Edit</Text>
                    </TouchableOpacity>
                </Block>
            )
        }
    }

    renderWhereText(textcolor) {
        const { groups, lights } = this.props;
        const { roomSelected, bulbSelected, homeSelected } = this.state;
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

    handleDatePicked = (date) => {
        var Dates = new Date(date);
        var day = Dates.getDate();
        var month = Dates.getMonth() + 1
        var year = Dates.getFullYear()
        this.setState({
            isDatePickerVisible: false,
            displaydate: day,
            displaymonth: month,
            displayyear: year
        })
    }

    renderWhen(textcolor) {
        if (this.state.time == "Add time") {
            return (
                <TouchableOpacity
                    onPress={() => this.setState({ isTimePickerVisible: true })}>
                    <Block flex={false} row space="between" style={{ alignSelf: 'center' }}>
                        <Text style={textcolor}>{this.state.time}</Text>
                        <Text style={textcolor}> ></Text>
                    </Block>
                    {this.renderTimePicker()}
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
                    {this.renderTimePicker()}
                </Block>
            )
        }
    }

    renderTimePicker() {
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

    renderDatePicker() {
        return (
            <DateTimePicker
                isVisible={this.state.isDatePickerVisible}
                onConfirm={this.handleDatePicked}
                titleIOS="Pick a date"
                onCancel={() => { this.setState({ isDatePickerVisible: false }) }}
                mode="date"
                dismissOnBackdropPressIOS={true}
            />
        )
    }


    renderRepetitiveText(titlecolor) {
        if (this.state.mode == "Repeat") {
            return (
                <Text bold style={[styles.textControl, titlecolor, { marginTop: 15 }]}>Day of the week</Text>
            )
        }
        else if (this.state.mode == "Specific Date") {
            return (
                <Text bold style={[styles.textControl, titlecolor, { marginTop: 15 }]}>Choose Date</Text>
            )
        }
    }

    renderDay(textcolor) {
        const { dayOpacity } = this;
        const { colors } = theme;
        if (this.state.mode == "Repeat") {
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
                ))
            )
        }
        else {
            return (
                this.renderDate(textcolor)
            )
        }
    }

    renderDate(textcolor) {
        if (this.state.displaydate == null) {
            return (
                <TouchableOpacity
                    onPress={() => { this.setState({ isDatePickerVisible: true }) }} >
                    <Text style={[styles.textControl, textcolor]}>Add date</Text>
                    {this.renderDatePicker()}
                </TouchableOpacity>
            )
        }
        else {
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            return (
                <Block flex={false} row space="between" style={{ alignSelf: 'center' }}>
                    <TouchableOpacity
                        onPress={() => this.setState({ isDatePickerVisible: true })}>
                        <Text style={{ color: '#20D29B', alignSelf: 'center' }}>{`${this.state.displaydate} ${monthNames[this.state.displaymonth - 1]} ${this.state.displayyear}`}</Text>
                    </TouchableOpacity>
                    {this.renderDatePicker()}
                </Block>
            )
        }
    }

    renderOn(textcolor) {
        return (
            <Block row space="between" style={{ marginTop: 40, marginBottom: 20 }}>
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

    renderInput(titlecolor, bordercolor, textcolor, nightmode, colors) {
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
        const tabs = ['Repeat', 'Specific Date'];
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        const textcolor = { color: nightmode ? colors.gray2 : colors.black }
        const bordercolor = { borderColor: nightmode ? colors.white : colors.black }
        return (
            <Block style={backgroundcolor}>
                <Block container style={{ marginBottom: 20 }}>
                    <Text h1 bold style={titlecolor}>Add Schedules</Text>
                    {this.renderLoadingModal()}
                    <ScrollView
                        showsVerticalScrollIndicator={false}>
                        {this.renderInput(titlecolor, bordercolor, textcolor, nightmode, colors)}
                        <View style={[styles.divider, { marginTop: 30 }]} />
                        <Block flex={false} row space="between" style={{ marginTop: 10 }}>
                            <Text bold style={titlecolor}>Categories</Text>
                            {this.renderCategories(textcolor)}
                        </Block>
                        <View style={[styles.divider, { marginTop: 10 }]} />
                        <Block flex={false} row space="between" style={{ marginTop: 10 }}>
                            <Text bold style={[titlecolor, { alignSelf: 'center' }]}>When</Text>
                            {this.renderWhen(textcolor)}
                        </Block>
                        <View style={[styles.divider, { marginTop: 10 }]} />
                        <Block flex={false} row space="between" style={{ marginTop: 10 }}>
                            <Text bold style={[titlecolor, { alignSelf: 'center' }]}>Where</Text>
                            {this.renderWhere(textcolor)}
                        </Block>
                        <View style={[styles.divider, { marginTop: 10 }]} />
                        <Block flex={false} row style={[styles.tabs, backgroundcolor]}>
                            {tabs.map(tab => this.renderTab(tab, backgroundcolor))}
                        </Block>
                        {this.renderRepetitiveText(textcolor)}
                        <Block flex={false} row space="between" style={{ marginTop: 20 }}>
                            {this.renderDay(textcolor, titlecolor)}
                        </Block>
                        {this.renderOn(textcolor)}
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
        schedules: state.schedules,
        saving: state.saving
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        _CreateSchedules(data, navigation) {
            return dispatch(CreateSchedules(data, navigation));
        }
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
    tabs: {
        marginTop: 30,
        justifyContent: 'space-between',
        borderBottomColor: theme.colors.gray2,
        borderBottomWidth: StyleSheet.hairlineWidth,
        // marginVertical: theme.sizes.base,
        // marginHorizontal: theme.sizes.base * 2,
    },
    tab: {
        paddingBottom: theme.sizes.base
    },
    active: {
        borderBottomColor: theme.colors.secondary,
        borderBottomWidth: 3,
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