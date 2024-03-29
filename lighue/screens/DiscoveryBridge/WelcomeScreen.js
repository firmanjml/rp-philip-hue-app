import React, { Component } from 'react';
import { Animated, Image, FlatList, StyleSheet } from 'react-native';
import { Block, Text, Button } from '../../components';
import { theme } from '../../constants';
import Layout from '../../constants/Layout';
import SnackBar from 'rn-snackbar';
import { connect } from 'react-redux';
import { GetBridgeIP } from '../../redux/actions';

class WelcomeScreen extends Component {
    static navigationOptions = {
        header: null
    }
    scrollX = new Animated.Value(0);

    state = {
        pairBtn: 'Searching....',
        manualBtn: false
    }

    async componentWillMount() {
        await this.props._GetBridgeIP();
        if (this.props.bridgeip) {
            SnackBar.show('New Hue Bridge Found!', { duration: 2000 });
            this.setState({ pairBtn: 'Pair now' });
        }
    }

    renderIllustrations() {
        const { illustrations } = this.props;
        return (
            <FlatList
                horizontal
                pagingEnabled
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                showEventThrottle={16}
                snapToAlignment='center'
                data={illustrations}
                extraDate={this.state}
                keyExtractor={(item, index) => `${item.id}`}
                renderItem={({ item }) => (
                    <Image
                        source={item.source}
                        resizeMode='contain'
                        style={{ width: Layout.window.width, height: Layout.window.height / 2, overflow: 'visible' }}
                    />
                )}
                onScroll={
                    Animated.event([{
                        nativeEvent: {
                            contentOffset: {
                                x: this.scrollX
                            }
                        }
                    }])
                }
            />
        )
    }

    renderDots() {
        const { illustrations } = this.props;
        const stepPosition = Animated.divide(this.scrollX, Layout.window.width);
        return (
            <Block row center middle style={styles.stepsContainer}>
                {illustrations.map((item, index) => {
                    const opacity = stepPosition.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [0.4, 1, 0.4],
                        extrapolate: 'clamp',
                    });

                    return (
                        <Block
                            animated
                            flex={false}
                            key={`step-${index}`}
                            color="gray"
                            style={[styles.steps, { opacity }]}
                        />
                    )
                })}
            </Block>
        )
    }

    renderPairBtn() {
        const {navigation, bridgeip} = this.props;
        if (bridgeip) {
            return (
                <Button color="#0194FD" onPress={() => navigation.navigate('LinkButton')}>
                        <Text center bold>Pair Bridge</Text>
                    </Button>
            )
        } else {
            return (
                <Button color="grey" onPress={() => navigation.navigate('ManualIP')}>
                        <Text center bold>Searching</Text>
                </Button>
            )
       }  
    }

    render() {
        const { navigation, nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight };
        const textcolor = { color: nightmode ? colors.white : colors.black }
        return (
            <Block style={backgroundcolor}>
                <Block center bottom flex={0.4}>
                    <Text h1 center bold style={textcolor}>
                        Lighue
                    </Text>
                    <Text h3 gray2 style={{ marginTop: theme.sizes.padding / 2 }}>
                        Enjoy the smart experience
                    </Text>
                </Block>
                <Block center middle>
                    {this.renderIllustrations()}
                    {this.renderDots()}
                </Block>
                <Block middle flex={0.5} margin={[0, theme.sizes.padding * 2]}>
                    {this.renderPairBtn()}
                    <Button shadow onPress={() => navigation.navigate('ManualIP')}>
                        <Text center black bold>Manual Search</Text>
                    </Button>
                </Block>
            </Block>
        )
    }
}

WelcomeScreen.defaultProps = {
    illustrations: [
        {
            id: 1, source: require('../../assets/images/illustration_1.png')
        },
        {
            id: 2, source: require('../../assets/images/illustration_2.png')
        },
        {
            id: 3, source: require('../../assets/images/illustration_3.png')
        }
    ]
}

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        bridgeip: state.bridgeip,
        nightmode: state.nightmode
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        _GetBridgeIP() {
            return dispatch(GetBridgeIP());
        }
    }
}

const styles = StyleSheet.create({
    stepsContainer: {
        position: 'absolute',
        bottom: theme.sizes.base * 3,
        right: 0,
        left: 0
    },
    steps: {
        width: 5,
        height: 5,
        borderRadius: 5,
        marginHorizontal: 2.5
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen);