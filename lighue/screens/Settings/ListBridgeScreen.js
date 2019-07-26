import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image, View, Alert } from 'react-native';
import { Block, Text } from '../../components';
import { theme } from '../../constants';
import { connect } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons';
import DialogInput from 'react-native-dialog-input';
import { AddBridge, SwitchBridge, DeleteBridge, GetConfig } from '../../redux/actions';

class ListBridgeScreen extends Component {
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
        dialogModal: false
    }

    _renderModal() {
        return (
            <DialogInput
                isDialogVisible={this.state.dialogModal}
                title={"Add Bridge"}
                message={"Please enter the bridge ip address"}
                hintInput={"192.168.1.1"}
                submitInput={(ip) => {
                    this.setState({ dialogModal: false });
                    this.props._setIp(ip, this.props.navigation);
                }}
                closeDialog={() => this.setState({ dialogModal: false })}
            />
        )
    }

    render() {
        const { nightmode, bridgeip, bridgeIndex } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight };
        const titlecolor = { color: nightmode ? colors.white : colors.black };
        const textcolor = { color: nightmode ? colors.white : colors.gray3 };
        return (
            <Block style={backgroundcolor}>
                <Block container>
                    <Block flex={false} center row space="between">
                        <Text h1 bold style={[titlecolor]}>List of Bridge</Text>
                        <TouchableOpacity
                            onPress={() => this.setState({ dialogModal: true })}
                        >
                            <Icon.Entypo name="circle-with-plus" size={25} color={theme.colors.gray} />
                        </TouchableOpacity>
                    </Block>
                    <ScrollView>
                        {
                            bridgeip.map((bridge, i) => (
                                <Block key={i}>
                                    <Block flex={false} row space="between" style={styles.row}>
                                        {
                                            (bridgeIndex == i) ? (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        Alert.alert(
                                                            'Warning',
                                                            'You have already selected this bridge',
                                                            [{
                                                                text: "OK"
                                                            }],
                                                            { cancelable: true }
                                                        );
                                                    }}
                                                >
                                                    <Text style={[textcolor]}>{i + 1}) Bridge IP: {bridge}</Text>
                                                </TouchableOpacity>
                                            ) : <TouchableOpacity
                                                onPress={() => {
                                                    this.props._switchBridge(i);
                                                    setTimeout(() => {
                                                        this.props._fetchEverything(true);
                                                        this.props.navigation.navigate("ListRoom");
                                                    }, 1000);
                                                }}
                                            >
                                                    <Text bold style={[textcolor]}>{i + 1}) Bridge IP: {bridge}</Text>
                                                </TouchableOpacity>
                                        }
                                        {
                                            (bridgeIndex != i) ? (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        Alert.alert(
                                                            'Confirmation',
                                                            'Are you sure you want to remove this ?',
                                                            [{
                                                                text: "No"
                                                            }, {
                                                                text: "Yes", onPress: async () => {
                                                                    await this.props._deleteIp(i);
                                                                    console.log(bridgeip)
                                                                }
                                                            }],
                                                            { cancelable: true }
                                                        );
                                                    }}>
                                                    <Icon.Entypo name="squared-cross" size={25} color={'#ff0000'} />
                                                </TouchableOpacity>)
                                                :
                                                null
                                        }
                                    </Block>
                                    <View style={styles.divider} />
                                </Block>
                            ))
                        }
                    </ScrollView>
                </Block>
                {this._renderModal()}
            </Block>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        lights: state.lights,
        nightmode: state.nightmode,
        bridgeip: state.bridgeip,
        bridgeIndex: state.bridgeIndex
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        _setIp: (i, navigate) => {
            return dispatch(AddBridge(i, navigate));
        },
        _deleteIp: (i) => {
            return dispatch(DeleteBridge(i));
        },
        _switchBridge: (i) => {
            return dispatch(SwitchBridge(i));
        },
        _fetchEverything(isLoading) {
            return dispatch(GetConfig(isLoading));
        }
    }
}

const styles = StyleSheet.create({
    row: {
        marginTop: 20,
    },
    textSetting: {
        fontSize: 16,
        color: 'black',
        alignSelf: "center"
    },
    divider: {
        marginTop: 20,
        marginVertical: 5,
        marginHorizontal: 2,
        borderBottomWidth: 1,
        borderColor: "#747880"
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ListBridgeScreen)