import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Block, Text } from '../components';
import { theme, constant } from '../constants';

import { connect } from 'react-redux'
import Layout from '../constants/Layout';
import AppIntroSlider from 'react-native-app-intro-slider';

import { GetAllLights, GetAllGroups } from '../redux/actions'

var interval;
class Splash extends Component {

    componentWillMount() {
        interval = setInterval(() => {
            this.props._fetchAllLights();
            this.props._fetchAllGroups()
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(interval);
    }

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
        this.props.navigation.navigate("ListRoom");
    }
    render() {
        return <AppIntroSlider renderItem={this._renderItem} slides={constant.splash_slider} onDone={this._onDone} />;
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        _fetchAllLights() {
            return dispatch(GetAllLights())
        },
        _fetchAllGroups: () => dispatch(GetAllGroups()),
        
    }
}

export default connect(
    null,
    mapDispatchToProps
)(Splash)

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