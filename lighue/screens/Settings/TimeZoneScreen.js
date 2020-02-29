import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, View, Button } from 'react-native'
import { Block, Text } from '../../components';
import { ChangeConfig } from '../../redux/actions'
import { theme } from '../../constants';
import { connect } from 'react-redux';
import Timezone from '../../assets/lottie/timezone.json'
import LottieView from 'lottie-react-native'
import PickerModal from 'react-native-picker-modal-view';

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
        animation1: Timezone,
        selectedItem : {}
    }

    componentDidMount() {
        this.animation1.play();
    }

    updateTimezone() {

    }

    onSelected(selected) {
        this.setState({ selectedItem: selected });
        return selected;
    }

    render() {
        const { config, capabilities } = this.props;
        const { selectedItem } = this.state;
        return (
            <Block style={styles.container}>
                <Text h1 bold>Timezone Settings</Text>
                <Block style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                    {this.state.animation1 &&
                        <LottieView
                            ref={animation1 => {
                                this.animation1 = animation1;
                            }}
                            style={{
                                width: '100%',
                                height: '100%',
                                alignSelf: 'center'
                            }}
                            loop={true}
                            source={this.state.animation1}
                        />}
                </Block>
                <Block bottom flex={1} style={{ marginBottom: 10 }}>
                    <View style={{ marginBottom: 20 }}>
                        <Text bold>Current Timezone : {config.timezone}</Text>
                        <Text bold>New Timezone :</Text>
                    </View>
                </Block>
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