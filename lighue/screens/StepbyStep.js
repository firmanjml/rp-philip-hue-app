import React, { Component } from 'react';

import { View, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Block, Text } from '../components';
import { theme, constant } from '../constants';

import { WebBrowser } from 'expo';

import Layout from '../constants/Layout';
import AppIntroSlider from 'react-native-app-intro-slider';


export default class Splash extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft:
                <TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ height: 40, width: 80, justifyContent: 'center' }}>
                        <Image source={require('../assets/images/back.png')} />
                    </TouchableOpacity>
                </TouchableOpacity>,
            gesturesEnabled: false
        }
    }

    _renderItem = (item) => {
        return (
            // <Block style={[{backgroundColor: theme.colors.background},styles.slide]}>
            //     <Block margin={[0, theme.sizes.base * 2]}>
            //         <Block style={{ marginTop: 10, backgroundColor: 'red' }} >
            //             <Text style={styles.title}>{item.title}</Text>
            //             <Text medium style={styles.text}>{item.text}</Text>
            //             <TouchableOpacity onPress={() => Linking.openURL('https://www.technobezz.com/how-to-find-your-router-ip-address/')}>
            //                 <Text medium style={styles.text}>{item.url}</Text>
            //             </TouchableOpacity>
            //         </Block>
            //     </Block>
            //     <Block style={styles.imageBlock}>
            //             <Image
            //                 resizeMethod='auto'
            //                 source={item.image}
            //                 style={styles.image} />
            //         </Block>
            // </Block>

            <View style={styles.slide}>
                <View style={styles.margin}>
                    <View style={{ marginTop: 10}} >
                        <Text style={styles.title}>{item.title}</Text>
                        <Text medium style={styles.text}>{item.text}</Text>
                        <TouchableOpacity onPress={this._handlePressButtonAsync}>
                            <Text medium style={[styles.text,{textDecorationLine: 'underline'}]}>{item.url}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.imageBlock}>
                        <Image
                            resizeMethod='auto'
                            source={item.image}
                            style={styles.image} />
                    </View>
            </View>
        );
    }
    _onDone = () => {
        this.props.navigation.goBack();
    }

    _handlePressButtonAsync = async () => {
        await WebBrowser.openBrowserAsync('https://www.technobezz.com/how-to-find-your-router-ip-address/');
      };
    
    render() {
        return <AppIntroSlider renderItem={this._renderItem} slides={constant.step_slider} onDone={this._onDone} />;
    }
}

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: theme.colors.background
    },
    margin: {
        marginLeft: theme.sizes.base * 2,
        marginRight: theme.sizes.base * 2
    },
    imageBlock: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop : 10
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
        fontWeight: '200',
        textAlign: 'left',
        fontSize: 15,
        color: 'white',
        marginTop: 10
    },
    list: {
        textAlign: 'center'
    }
});