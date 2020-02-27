import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Block, Text, Button } from '../../components';
import { theme } from '../../constants';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';


class BridgeInfo extends Component {
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

    renderStatus(textcolor) {
        const { cloud_enable, status } = this.props;
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
        return (
            <Block style={styles.container}>
                <Block flex={false} center row space="between" style={styles.header}>
                    <Text h1 googlebold>{config.name}</Text>
                </Block>
                <Text gray style={{ marginTop: 10 }}>Bridge Information</Text>
                <ScrollView>
                    <Block flex={false} column>
                        <Text gray googlebold style={styles.textSetting}>Connection</Text>
                        <Text style={styles.textSetting}>Status : Connected</Text>
                        <Text style={styles.textSetting}>Portal Services : {config.portalservices ? "Connected through Cloud" : "Not using cloud"}</Text>
                        <Text style={styles.textSetting}>ZigBee Channel : {config.zigbeechannel}</Text>
                    </Block>
                    <Block flex={false} column style={styles.row}>
                        <Text gray googlebold style={styles.textSetting}>Software</Text>
                        <Text style={styles.textSetting}>Software Version : {config.swversion}</Text>
                        <Text style={styles.textSetting}>API Version : {config.apiversion}</Text>
                    </Block>
                    <Block flex={false} column style={styles.row}>
                        <Text gray googlebold style={styles.textSetting}>Network</Text>
                        <Text style={styles.textSetting}>IP Address : {config.ipaddress}</Text>
                        <Text style={styles.textSetting}>MAC Address : {config.mac}</Text>
                        <Text style={styles.textSetting}>Gateway : {config.gateway}</Text>
                        <Text style={styles.textSetting}>DHCP : {config.dhcp ? "Use assigned IP by DHCP Server" : "Static IP"}</Text>
                        <Text style={styles.textSetting}>Proxy Address : {config.proxyaddress === "none" ? "None" : config.proxyaddress}</Text>
                        <Text style={styles.textSetting}>Proxy Port : {config.proxyport}</Text>
                    </Block>
                    <Block flex={false} column style={[styles.row, { marginBottom: 20 }]}>
                        <Text gray googlebold style={styles.textSetting}>Time</Text>
                        <Text style={styles.textSetting}>Local Time : {config.localtime}</Text>
                        <Text style={styles.textSetting}>Timezone : {config.timezone}</Text>
                        <Text style={styles.textSetting}>UTC : {config.UTC}</Text>
                    </Block>
                </ScrollView>
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
    container: {
        paddingHorizontal: theme.sizes.base * 2,
        backgroundColor: theme.colors.background
    },
    textSetting: {
        marginTop: 18,
        fontSize: 16
    },
    header: {
        marginTop: 25
    },
    row: {
        marginTop: 20,
    },
    divider: {
        marginTop: 15,
        marginVertical: 5,
        marginHorizontal: 2,
        borderBottomWidth: 0.5,
        borderColor: "#E1E3E8"
    }
});