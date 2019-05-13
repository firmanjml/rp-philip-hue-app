import React, { Component } from 'react'
import { StyleSheet, Alert } from 'react-native'
import { connect } from 'react-redux'
import { GetAllGroups, SetGroupState, CreateGroup, DeleteGroup, GetAllLights, SetLampState, DeleteLight } from '../redux/actions'
import Spinner from "react-native-loading-spinner-overlay";
import { Button, Block, Text, Divider } from '../components';
import { theme } from '../constants';

/**
 * TestScreen
 * ! This class is used for testing purposes.
 */
class TestScreen extends Component {

    state = {
        group_on: false,
        light_on: false
    }
    componentWillMount() {
        // // before calling get group api
        // console.log(this.props.groups);
        // // after calling get group api
        // console.log(this.props.groups[0].name);
        this.props._fetchAllGroups();
        this.props._fetchAllLights();
        this.setState({ group_on: this.props.groups["1"].action.on })
        this.setState({ light_on: this.props.lights["1"].state.on })
        // this.props._fetchAllLights();
    }

    group(isLog = false) {
        // this.props._addGroup({
        //     "name": "Living room",
        //     "class": "Living room",
        //     "lights": [
        //         "1"
        //     ],
        //     "type": "LightGroup"
        // })
        // this.props._deleteGroup(13)
        // const { groups } = this.props
        // console.log(groups[1])
        // Object.keys(groups).map((val) => {
        //     console.log(groups[val])
        // // })
        // this.props._deleteLampByID(1)
        // this.props._changeLampStateByID(2, {
        //     on : false
        // });

        if (isLog) {
            console.log(this.props.groups)
        } else {
            if (this.props.bridgeip && this.props.username) {
                this.setState({ group_on: !this.state.group_on })
                this.props._changeGroupStateByID(1, {
                    on: this.state.group_on
                });
            } else {
                Alert.alert(
                    'Could not connect to bridge.',
                    'Please edit initialState.json',
                    [{
                        text: "OK", onPress: () => {
                            this.props.navigation.goBack();
                        }
                    }],
                    { cancelable: false }
                )
            }

        }
    }

    light(isLog = false) {
        if (isLog) {
            console.log(this.props.lights)
        } else {
            if (this.props.bridgeip && this.props.username) {
                this.setState({ light_on: !this.state.light_on })
                this.props._changeLampStateByID(1, {
                    on: this.state.light_on
                });
            } else {
                Alert.alert(
                    'Could not connect to bridge.',
                    'Please edit initialState.json',
                    [{
                        text: "OK", onPress: () => {
                            this.props.navigation.goBack();
                        }
                    }],
                    { cancelable: false }
                )
            }

        }
    }


    render() {
        // Example 
        return (
            <Block style={styles.container}>
                <Block center top flex={0.1}>
                    <Text h1 center bold white>
                        Debug Mode
                    </Text>
                    <Text h3 gray2 style={{ marginTop: theme.sizes.padding / 2 }}>
                        Enjoy the testing experience
                    </Text>
                </Block>

                <Block middle flex={0.4} margin={[0, theme.sizes.padding * 2]}>
                    <Text h1 center bold white>Group Test</Text>
                    <Button shadow onPress={() => this.group()}>
                        <Text center semibold>Turn {this.state.group_on ? 'On' : 'Off'} Group 1 Lights</Text>
                    </Button>
                    <Button shadow onPress={() => this.group(true)}>
                        <Text center semibold>Output Group Log Data</Text>
                    </Button>
                </Block>
                <Block middle flex={0.2} margin={[0, theme.sizes.padding * 2]}>
                    <Text h1 center bold white style={{ marginTop: 10 }}>Light Test</Text>
                    <Button shadow onPress={() => this.light()}>
                        <Text center semibold>Turn {this.state.light_on ? 'On' : 'Off'} Light 1</Text>
                    </Button>
                    <Button shadow onPress={() => this.light(true)}>
                        <Text center semibold>Output Light 1 Log Data</Text>
                    </Button>
                </Block>
                <Block bottom flex={0.15} margin={[0, theme.sizes.padding * 2]}>
                    <Text h3 center bold white style={{ marginTop: 10 }}>{this.props.bridgeip ? this.props.bridgeip : 'Not connected to bridge'}</Text>
                    <Text h3 center bold white style={{ marginTop: 10 }}>{this.props.username ? this.props.username : 'Not linked to bridge'}</Text>
                </Block>
            </Block>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        groups: state.groups,
        lights: state.lights,
        bridgeip: state.bridgeip,
        username: state.username
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        _fetchAllGroups() {
            return dispatch(GetAllGroups());
        },
        _changeGroupStateByID(id, data) {
            return dispatch(SetGroupState(id, data));
        },
        _addGroup(data) {
            return dispatch(CreateGroup(data));
        },
        _deleteGroup(id) {
            return dispatch(DeleteGroup(id));
        },
        _fetchAllLights() {
            return dispatch(GetAllLights())
        },
        _changeLampStateByID(id, data) {
            return dispatch(SetLampState(id, data));
        },
        _deleteLampByID(id) {
            return dispatch(DeleteLight(id));
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background
    },
    stepsContainer: {
        position: 'absolute',
        bottom: theme.sizes.base * 3,
        right: 0,
        left: 0
    },
    steps: {
        width: 5,
        height: 5,
        borderRadius: 5,
        marginHorizontal: 2.5
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TestScreen)
