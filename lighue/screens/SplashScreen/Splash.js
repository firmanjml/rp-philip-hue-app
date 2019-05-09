import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Block, Text } from '../../components';
import { theme } from '../../constants';

import Layout from '../../constants/Layout';

import AppIntroSlider from 'react-native-app-intro-slider';

const slides = [
    {
        key: '1',
        title: 'Control your light\nbulb with ease',
        text: 'with the Lighue app, you can control your added light bulb from couch, bed, toilet or anywhere else.',
        image: require('../../assets/images/bulb_whiteedit.png')
    },
    {
        key: '2',
        title: 'Set your home\nfrom anywhere',
        text: 'with the Lighue app, you can control your home from anyone you want, you can enjoy your time without thinking about your home.',
        image: require('../../assets/images/home_whiteedit.png')
    },
    {
        key: '3',
        title: 'Automated\nSchedules',
        text: 'with the Lighue app, you can create a schedule that helps you to control light bulb, even when you are tired from work or school.',
        image: require('../../assets/images/smart_whiteedit.png')
    }
];

export default class Splash extends Component {
    _renderItem = (item) => {
        return (
            <View style={styles.slide}>
                <View style={styles.imageBlock}>
                    <Image 
                    resizeMethod='auto' 
                    source={item.image} 
                    style={styles.image} />
                </View>
                <Block marginTop={20} margin={[0, theme.sizes.base * 3]}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text medium style={styles.text}>{item.text}</Text>
                </Block>
            </View>
        );
    }
    _onDone = () => {
        this.props.navigation.navigate("createUserName");
    }
    render() {
        return <AppIntroSlider renderItem={this._renderItem} slides={slides} onDone={this._onDone} />;
    }
}

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    imageBlock: {
        marginTop : 20
    },
    image: {
        width: Layout.window.width,
        height: Layout.window.height / 2.5,
        resizeMode : 'contain'
    },
    title: {
        textAlign: 'left',
        fontWeight: '200',
        color: 'white',
        fontSize: 30
    },
    text: {
        marginTop : 20,
        textAlign: 'left',
        fontSize: 15,
        color: 'white'
    }
});