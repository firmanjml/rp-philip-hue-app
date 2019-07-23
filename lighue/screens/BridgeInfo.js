import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Block, Text, Button } from '../components';
import { theme } from '../constants';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';


class BridgeInfo extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft:
                <TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ height: 40, width: 80, justifyContent: 'center' }}>
                        <Image source={require('../assets/icons/back.png')} />
                    </TouchableOpacity>
                </TouchableOpacity>
        }
    }

    renderStatus(textcolor) {
        const {cloud_enable , status} = this.props;
        if (!cloud_enable) {
            return (
                <Text style={textcolor}>{status ? "Connected" : "Not Connected"}</Text>
            )
        }
        else {
            return (
                <Text style={textcolor}>Connected via cloud</Text>
            )
        }
    }

    render() {
        const { nightmode, config } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        const textcolor = { color: nightmode ? colors.white : colors.black }
        return (
            <Block style={backgroundcolor}>
                <Block container style={{ marginBottom: 20 }}>
                    <Text h1 bold style={[textcolor, { marginTop: 10 }]}>Bridge Info</Text>
                    <ScrollView>
                        <Block flex={false} column style={styles.row}>
                            <Text bold style={textcolor}>Name</Text>
                            <Text style={[styles.textSetting, textcolor]}>{config.name}</Text>
                            <View style={styles.divider} />
                        </Block>
                        <Block flex={false} column style={styles.row}>
                            <Text bold style={textcolor}>IP Address</Text>
                            <Text style={[styles.textSetting, textcolor]}>{config.ipaddress}</Text>
                            <View style={styles.divider} />
                        </Block>
                        <Block flex={false} column style={styles.row}>
                            <Text bold style={textcolor}>Status</Text>
                            <Text style={[styles.textSetting, textcolor]}>{this.renderStatus(textcolor)}</Text>
                            <View style={styles.divider} />
                        </Block>
                        <Block flex={false} column style={styles.row}>
                            <Text bold style={textcolor}>MAC Address</Text>
                            <Text style={[styles.textSetting, textcolor]}>{config.mac}</Text>
                            <View style={styles.divider} />
                        </Block>
                        <Block flex={false} column style={styles.row}>
                            <Text bold style={textcolor}>DCHP</Text>
                            <Text style={[styles.textSetting, textcolor]}>{config.dhcp ? "On" : " Off"}</Text>
                            <View style={styles.divider} />
                        </Block>
                        <Block flex={false} column style={styles.row}>
                            <Text bold style={textcolor}>Portal Service</Text>
                            <Text style={[styles.textSetting, textcolor]}>{config.portalservices ? "On" : " Off"}</Text>
                            <View style={styles.divider} />
                        </Block>
                        <Block flex={false} column style={styles.row}>
                            <Text bold style={textcolor}>Firmware</Text>
                            <Text style={[styles.textSetting, textcolor]}>{config.swversion}</Text>
                            <View style={styles.divider} />
                        </Block>
                        <Block flex={false} column style={styles.row}>
                            <Text bold style={textcolor}>Bridge ID</Text>
                            <Text style={[styles.textSetting, textcolor]}>{config.bridgeid}</Text>
                            <View style={styles.divider} />
                        </Block>
                        <Block flex={false} column style={styles.row}>
                            <Text bold style={textcolor}>Bridge Model</Text>
                            <Text style={[styles.textSetting, textcolor]}>{config.modelid}</Text>
                            <View style={styles.divider} />
                        </Block>
                        <Block flex={false} column style={styles.row}>
                            <Text bold style={textcolor}>Bridge Date</Text>
                            <Text style={[styles.textSetting, textcolor]}>{(config.localtime).substring(0,10)}</Text>
                            <View style={styles.divider} />
                        </Block>
                        <Block flex={false} column style={styles.row}>
                            <Text bold style={textcolor}>Bridge Time</Text>
                            <Text style={[styles.textSetting, textcolor]}>{(config.localtime).substring(11)}</Text>
                            <View style={styles.divider} />
                        </Block>
                        <Block flex={false} column style={styles.row}>
                            <Text bold style={textcolor}>ZigBee Channel</Text>
                            <Text style={[styles.textSetting, textcolor]}>{config.zigbeechannel}</Text>
                            <View style={styles.divider} />
                        </Block>
                    </ScrollView>
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

export default connect(
    mapStateToProps,
    null
)(BridgeInfo)

const styles = StyleSheet.create({
    row: {
        marginTop: 20,
    },
    textSetting: {
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