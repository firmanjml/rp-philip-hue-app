import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, Dimensions, View, Modal, Alert } from 'react-native'
import { Block, Text, Button } from '../../components';
import { theme } from '../../constants';
import { connect } from 'react-redux';
import { persistor } from "../../redux/store";

import axios from 'axios';

import Swipe from '../../components/Swipe';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
const { width } = Dimensions.get('window');
import SnackBar from 'rn-snackbar';

import { SearchForNewLights } from '../../redux/actions'
var interval;
class Setting extends Component {
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
        bulbs: {}
    }

    componentWillMount() {
        const { bridgeip, username } = this.props;
        SnackBar.show(`Searching for new lights`, { duration: 40000 });
        this.props._searchForNewLights();
        interval = setInterval(() => {
            axios({
                url: `http://${bridgeip}/api/${username}/lights/new`,
                method: 'GET',
            }).then(res => {
                console.log(res.data);
                if (res.data.lastscan != 'active') {
                    clearInterval(interval);
                } else {
                    console.log(res.data);
                    delete res.data.lastscan;
                    this.setState({bulbs: res.data})
                    SnackBar.dismiss()
                }
            })
        }, 2000);
    }

    componentWillUnmount() {
        clearInterval(interval);
    }


    render() {
        const { nightmode } = this.props;
        const { bulbs } = this.state
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        const textcolor = { color: nightmode ? colors.white : colors.black }
        return (
            <Block style={backgroundcolor}>
                <Block container>
                    <Text h1 bold style={[textcolor, { marginTop: 10 }]}>List of Bulb found</Text>
                    {
                        Object.keys(bulbs).map(i => (
                            <Block flex={false} row space="between" style={styles.row}>
                                <Text bold h3 style={[styles.textSetting, textcolor]}>{bulbs[i].name}</Text>
                            </Block>
                        ))
                    }
                </Block>
            </Block>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        _searchForNewLights: () => {
            return dispatch(SearchForNewLights());
        }
    }
}

const mapStateToProps = (state) => {
    return {
        nightmode: state.nightmode,
        cloud_enable: state.cloud_enable,
        bridgeip: state.bridgeip,
        username: state.username,
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Setting)

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
    },
});