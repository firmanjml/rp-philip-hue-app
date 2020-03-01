import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, View, FlatList } from 'react-native'
import { Block, Text } from '../../components';
import { ChangeConfig } from '../../redux/actions'
import { theme } from '../../constants';
import { connect } from 'react-redux';

class TimeZone extends Component {
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
        selectedTimezone: this.props.config.timezone
    }

    updateTimezone(value) {
        this.props.ChangeConfig({
            "timezone" : value
        });
        this.setState({
            selectedTimezone : value
        })
    }

    render() {
        const { config, capabilities } = this.props;
        return (
            <Block style={styles.container}>
                <Text h1 bold style={{marginBottom : 20}}>Time zone</Text>
                <FlatList
                    keyExtractor={(item) => item}
                    data={Object.keys(capabilities.timezones.values)}
                    renderItem={({ item: key }) => (
                        <TouchableOpacity onPress={() => this.updateTimezone(capabilities.timezones.values[key])}>
                            <Block flex={false} row space="between" style={styles.row}>
                                <Text style={{fontSize: 16}}>{capabilities.timezones.values[key]}</Text>
                                {capabilities.timezones.values[key] == this.state.selectedTimezone
                                    ?
                                    <Text>Selected</Text>
                                    :
                                    null
                                }
                            </Block>
                        </TouchableOpacity>
                    )}
                />
            </Block>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        capabilities: state.capabilities,
        config: state.config
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        ChangeConfig(config) {
            return dispatch(ChangeConfig(config))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TimeZone)

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
        marginBottom: 30,
    },
    divider: {
        marginTop: 15,
        marginVertical: 5,
        marginHorizontal: 2,
        borderBottomWidth: 0.5,
        borderColor: "#E1E3E8"
    }
});