import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { Block } from '../components';
import { theme } from '../constants';
import { ConvertXYtoHex } from '../components/ColorConvert';
import { connect } from 'react-redux'

class LightDemoMode extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft:
                <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ height: 40, width: 80, justifyContent: 'center' }}>
                        <Image source={require('../assets/icons/back.png')} />
                </TouchableOpacity>
        }
    }

    renderButton() {
        const { navigation, lights, nightmode } = this.props;
        const { colors } = theme;
        const textcolor = { color: nightmode ? colors.white : colors.black }
        return (
            Object.keys(lights).map(val => (
                <TouchableOpacity
                    key={val}
                    onPress={() => {
                        navigation.navigate('ControlBulb', {
                            id: val,
                            colorHex: ConvertXYtoHex(this.props.lights[val].state.xy[0],
                                this.props.lights[val].state.xy[1],
                                this.props.lights[val].state.bri)
                        });
                    }}>
                    <Text style={[{ marginBottom: 20, fontSize: 20 }, textcolor]}>{lights[val].name}</Text>
                </TouchableOpacity>
            )))
    }

    render() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight };
        return (
            <Block style={[styles.container, backgroundcolor]}>
                {this.renderButton()}
            </Block>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        lights: state.lights,
        nightmode: state.nightmode
    }
}

export default connect(
    mapStateToProps,
    null
)(LightDemoMode)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

});