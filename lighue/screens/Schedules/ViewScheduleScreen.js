import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, View, ScrollView, Alert, Modal, ActivityIndicator } from 'react-native'
import { Block, Text, Button, Input } from '../../components';
import { theme } from '../../constants';
import { CreateSchedules, GetSchedules } from '../../redux/actions';
import { connect } from 'react-redux';
import ToggleSwitch from '../../components/ToggleSwitch'
import DateTimePicker from "react-native-modal-datetime-picker";

class ViewScheduleScreen extends Component {
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
        id: 1,
        name: "",
        category: "",
        description: "",
        status: "decease",
        time: "",
        bin: ""
    }

    componentWillMount() {
        const id = this.props.navigation.getParam("id", "1");
        const str = this.props.schedules[id].name.split("#");

        this.setState({ name: str[0] });
        this.setState({ category: str[1] });
        this.setState({ description: this.props.schedules[id].description });
        this.setState({ status: this.props.schedules[id].status });
        this.setState({ time: this.props.schedules[id].time });
    }

    render() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        const textcolor = { color: nightmode ? colors.gray2 : colors.black }
        const bordercolor = { borderColor: nightmode ? colors.white : colors.black }
        return (
            <Block style={backgroundcolor}>
                <Block container style={{ marginBottom: 20 }}>
                    <Text h1 bold style={titlecolor}>Schedules Details</Text>
                    <Block flex={false} column style={styles.row}>
                        <Text bold style={titlecolor}>Name</Text>
                        <Text style={[styles.text, textcolor]}>{this.state.name}</Text>
                        <View style={styles.divider} />
                    </Block>
                    <Block flex={false} column style={styles.row}>
                        <Text bold style={titlecolor}>Description</Text>
                        <Text style={[styles.text, textcolor]}>{this.state.description}</Text>
                        <View style={styles.divider} />
                    </Block>
                    <Block flex={false} column style={styles.row}>
                        <Text bold style={titlecolor}>Category</Text>
                        <Text style={[styles.text, textcolor]}>{this.state.category}</Text>
                        <View style={styles.divider} />
                    </Block>
                    <Block flex={false} column style={styles.row}>
                        <Text bold style={titlecolor}>Status</Text>
                        <Text style={[styles.text, textcolor]}>{this.state.status}</Text>
                        <View style={styles.divider} />
                    </Block>
                    <Block flex={false} column style={styles.row}>
                        <Text bold style={titlecolor}>Time</Text>
                        <Text style={[styles.text, textcolor]}>{this.state.time}</Text>
                        <View style={styles.divider} />
                    </Block>

                    <Block flex={false} center style={styles.row}>
                        <Text bold style={[titlecolor, { fontSize: 21 }]}>{this.state.bin}</Text>
                        <View style={styles.divider} />
                    </Block>
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
        },
        _GetSchedules() {
            return dispatch(GetSchedules());
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ViewScheduleScreen)

const styles = StyleSheet.create({
    row: {
        marginTop: 20,
    },
    text: {
        marginTop: 10
    },
    divider: {
        marginTop: 10,
        marginVertical: 5,
        marginHorizontal: 2,
        borderBottomWidth: 1,
        borderColor: "#E1E3E8"
    },
});