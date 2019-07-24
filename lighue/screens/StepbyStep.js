import React, { Component } from 'react';

import { View, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Block, Text } from '../components';
import { theme, constant } from '../constants';

import { WebBrowser } from 'expo';
import {connect} from 'react-redux';

import Layout from '../constants/Layout';
import AppIntroSlider from 'react-native-app-intro-slider';


class StepbyStep extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft:
                <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ height: 40, width: 80, justifyContent: 'center' }}>
                        <Image source={require('../assets/icons/back.png')} />
                </TouchableOpacity>,
            gesturesEnabled: false
        }
    }

    _renderItem = (item) => {
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight };
        const textcolor = { color: nightmode ? colors.white : colors.black }
        return (
            <Block style={backgroundcolor} >
                <Block container style={styles.slide}>
                    <View style={{ marginTop: 10 }} >
                        <Text style={[styles.title,textcolor]}>{item.title}</Text>
                        <Text medium style={[styles.text,textcolor]}>{item.text}</Text>
                        <TouchableOpacity onPress={this._handlePressButtonAsync}>
                            <Text medium style={[styles.text,textcolor,{ textDecorationLine: 'underline' }]}>{item.url}</Text>
                        </TouchableOpacity>
                    </View>
                </Block>
                {/* <View style={styles.imageBlock}>
                    <Image
                        resizeMethod='auto'
                        source={item.image}
                        style={styles.image} />
                </View> */}
            </Block>
        );
    }
    _onDone = () => {
        this.props.navigation.goBack();
    }

    _handlePressButtonAsync = async () => {
        await WebBrowser.openBrowserAsync('https://www.technobezz.com/how-to-find-your-router-ip-address/');
    };

    render() {
        return <AppIntroSlider renderItem={this._renderItem} slides={constant.step_slider} onDone={this._onDone} bottomButton/>;
    }
}

const mapStateToProps = (state) => {
    return {
        nightmode: state.nightmode
    }
}

export default connect(mapStateToProps, null)(StepbyStep);

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        alignItems: 'center',
    },
    imageBlock: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    image: {
        width: Layout.window.width,
        height: Layout.window.height / 2.5,
        resizeMode: 'contain'
    },
    title: {
        textAlign: 'left',
        fontWeight: '200',
        fontSize: 30
    },
    text: {
        fontWeight: '200',
        textAlign: 'left',
        fontSize: 15,
        marginTop: 10
    },
    list: {
        textAlign: 'center'
    }
});