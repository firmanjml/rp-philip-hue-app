import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, View, Alert } from 'react-native'
import { Block, Text, Input } from '../../components';
import { theme } from '../../constants';
import { connect } from 'react-redux';
import { SetLampState } from "../../redux/actions";
import validator from 'validator';
import { HexColorConversionToXY } from '../../components/ColorConvert';

class ControlBulbAdvanced extends Component {
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
        id: 0,
        hexCode: ""
    }

    componentWillMount() {
        this.setState({
            id: this.props.navigation.getParam('id', "1")
        })
    }

    handleHex = (value) => {
        if (validator.isHexColor(value)) {
            
        }
        this.setState({
            hexCode: value
        })
    }

    applyHexCode() {
        if (validator.isHexColor(this.state.hexCode)) {
            this.props._changeLightStateByID(this.state.id, {
                xy: HexColorConversionToXY(this.state.hexCode)
            })
        }
        else {
            Alert.alert(
                'Incorrect input',
                'Make sure that the input is a hex code',
                [
                    { text: "Ok", onPress: () => {} },
                ],
                { cancelable: false },
            );
        }
    }


    render() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        const textcolor = { color: nightmode ? colors.white : colors.black }
        return (
            <Block style={backgroundcolor}>
                <Block container style={{ marginBottom: 20 }}>
                    <Text h1 bold style={[textcolor, { marginTop: 10 }]}>Control Bulb Advanced</Text>
                    <Block flex={false} column style={styles.row}>
                        <Text bold style={textcolor}>Enter Hex Code</Text>
                        <Input
                            style={styles.textInput}
                            value={this.state.hexCode}
                            onChangeText={this.handleHex}
                            placeholder={"#ffffff"}
                            placeholderTextColor={theme.colors.gray2}
                        />
                        <TouchableOpacity
                            onPress={() => this.applyHexCode()}>
                            <Text style={[textcolor, { marginTop: 10 }]}>Tap here to apply to Bulb</Text>
                        </TouchableOpacity>
                    </Block>
                    <Text style={[textcolor, { marginTop: 50 }]}>More function coming soon!</Text>
                </Block>
            </Block>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        nightmode: state.nightmode,
        config: state.config,
        status: state.status,
        cloud_enable: state.cloud_enable
    }
}

const mapDispatchToProps = dispatch => {
    return {
        _changeLightStateByID(id, data) {
            return dispatch(SetLampState(id, data));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ControlBulbAdvanced)

const styles = StyleSheet.create({
    row: {
        marginTop: 20,
    },
    textSetting: {
        marginTop: 10
    },
    hexRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    divider: {
        marginTop: 10,
        marginVertical: 5,
        marginHorizontal: 2,
        borderBottomWidth: 1,
        borderColor: "#E1E3E8"
    },
    textInput: {
        height: 25,
        borderBottomWidth: 0.5,
        borderRadius: 0,
        borderWidth: 0,
        color: theme.colors.gray2,
        borderColor: "white",
        textAlign: "left",
        paddingBottom: 10
    },
});