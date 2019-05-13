import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Block, Text } from '../../components';
import { theme, constant } from '../../constants';
import Layout from '../../constants/Layout';
import AppIntroSlider from 'react-native-app-intro-slider';


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
        return <AppIntroSlider renderItem={this._renderItem} slides={constant.splash_slider} onDone={this._onDone} />;
    }
}

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    imageBlock: {
        marginTop: 20
    },
    image: {
        width: Layout.window.width,
        height: Layout.window.height / 2.5,
        resizeMode: 'contain'
    },
    title: {
        textAlign: 'left',
        fontWeight: '200',
        color: 'white',
        fontSize: 30
    },
    text: {
        marginTop: 20,
        textAlign: 'left',
        fontSize: 15,
        color: 'white'
    }
});