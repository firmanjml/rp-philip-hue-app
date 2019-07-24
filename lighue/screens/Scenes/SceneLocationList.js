import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, Modal, ScrollView, Dimensions, Platform } from 'react-native'
import { Block, Text, Card, Badge } from '../../components';
import { theme, constant } from '../../constants';
import { connect } from 'react-redux';
import { BlurView } from 'expo';
const { height, width } = Dimensions.get('window');

class SceneLocationList extends Component {
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
        location: ["Room", "Individual Bulb"],
        roomModal: false,
        bulbModal: false
    }

    redirection(value) {
        if (value == "Room") {
            this.setState({
                roomModal: true
            })
        }
        else if (value == "Individual Bulb") {
            this.setState({
                bulbModal: true
            })
        }
    }

    renderList() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const textcolor = { color: nightmode ? colors.gray2 : colors.black }
        return (
            Object.keys(this.state.location).map(val => (
                <TouchableOpacity
                    key={val}
                    onPress={() => this.redirection(this.state.location[val])}>
                    <Text bold style={[styles.text, textcolor]}>{this.state.location[val]}</Text>
                </TouchableOpacity>
            )));
    }

    renderListRoom() {
        const { groups, nightmode } = this.props;
        const { colors } = theme;
        const textcolor = { color: nightmode ? colors.white : colors.black }
        const marginTop = { marginTop: Platform.OS == "android" ? 20 : 0 }
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                // style={{ paddingVertical: theme.sizes.base * 2 }}
                style={{ paddingVertical: theme.sizes.base }}>
                <Block flex={false} row space="between" style={[styles.categories, marginTop]}>
                    {
                        Object.entries(groups).length === 0 && groups.constructor === Object ?
                            <Block middle center>
                                <Text h3 style={textcolor}>
                                    No Rooms created
                                    </Text>
                                <TouchableOpacity
                                    onPress={() => this.setState({ roomModal: false })}>
                                    <Text h3 style={{ marginTop: 5, color: '#20D29B' }}>Go Back</Text>
                                </TouchableOpacity>
                            </Block>
                            :
                            Object.keys(groups).map(val => (
                                <TouchableOpacity
                                    key={val}
                                    onPress={() => this.redirectionRoom(val)}>
                                    <Card center middle shadow style={styles.category}>
                                        <Badge margin={[0, 0, 15]} size={50} color="rgba(41,216,143,0.20)">
                                            {
                                                constant.room_class.indexOf(groups[val].class) > -1
                                                    ?
                                                    <Image style={{ width: constant.class_base64[groups[val].class].width, height: constant.class_base64[groups[val].class].height }} source={{ uri: constant.class_base64[groups[val].class].uri }} />
                                                    :
                                                    <Image style={{ width: constant.class_base64["Other"].width, height: constant.class_base64["Other"].height }} source={{ uri: constant.class_base64["Other"].uri }} />
                                            }
                                        </Badge>
                                        <Text medium height={30} style={styles.roomText}>{groups[val].name.length > 12 ? groups[val].name.substring(0, 12) + "..." : groups[val].name}</Text>
                                        <Text gray caption>{groups[val].lights ? groups[val].lights.length : '0'} bulbs</Text>
                                    </Card>
                                </TouchableOpacity>
                            ))
                    }
                </Block>
            </ScrollView>
        )
    }

    renderModalRoom() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        return (
            <Modal animationType={"fade"}
                transparent={true}
                onRequestClose={() => this.setState({ roomModal: !this.state.roomModal })}
                visible={this.state.roomModal}>
                <BlurView tint="dark" intensity={100} style={StyleSheet.absoluteFill}>
                    <Block container>
                        <Text h1 style={[titlecolor, { fontWeight: 'bold' }]}>Choose room</Text>
                        <Block flex={false} row style={[styles.tabs]}>
                            {this.renderListRoom()}
                        </Block>
                    </Block>
                </BlurView>
            </Modal>
        )
    }

    redirectionRoom = (val) => {
        this.props.navigation.navigate("AddScenes",
            {
                locationType: "Room",
                locationID: val
            })
        this.setState({ roomModal: false })
    }

    renderListBulb() {
        const { lights, nightmode } = this.props;
        const { colors } = theme;
        const textcolor = { color: nightmode ? colors.white : colors.black }
        const marginTop = { marginTop: Platform.OS == "android" ? 20 : 0 }
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ paddingVertical: theme.sizes.base }}>
                <Block flex={false} column style={[styles.categories, marginTop]}>
                    {
                        Object.entries(lights).length === 0 && groups.constructor === Object ?
                            <Block middle center>
                                <Text h1 style={textcolor}>No Bulb is found</Text>
                            </Block>
                            :
                            Object.keys(lights).map(val => (
                                <TouchableOpacity
                                    key={val}
                                    onPress={() => this.redirectionBulb(val)}>
                                    <Block flex={false} row space="between" style={{ marginTop: 30, marginBottom: 30 }}>
                                        <Text h2 style={[styles.textControl, textcolor]}>{lights[val].name}</Text>
                                        <Text h2 style={[styles.textControl, textcolor]}>></Text>
                                    </Block>
                                </TouchableOpacity>
                            ))
                    }
                </Block>
            </ScrollView>
        )
    }

    redirectionBulb = (val) => {
        this.props.navigation.navigate("AddScenes",
            {
                locationType: "Bulb",
                locationID: val
            })
        this.setState({ bulbModal: false })
    }

    renderModalBulb() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        return (
            <Modal animationType={"fade"}
                transparent={true}
                visible={this.state.bulbModal}
                onRequestClose={() => this.setState({ bulbModal: !this.state.bulbModal })}>
                <BlurView tint="dark" intensity={100} style={StyleSheet.absoluteFill}>
                    <Block container>
                        <Text h1 style={[titlecolor, { fontWeight: 'bold' }]}>Choose bulb</Text>
                        <Block flex={false} row style={styles.tabs}>
                            {this.renderListBulb()}
                        </Block>
                    </Block>
                </BlurView>
            </Modal>
        )
    }

    render() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        return (
            <Block style={backgroundcolor}>
                <Block container>
                    {this.renderModalRoom()}
                    {this.renderModalBulb()}
                    <Text h1 bold style={[titlecolor, { marginTop: 10 }]}>Add Scenes to?</Text>
                    <Block flex={1} column style={{ justifyContent: 'space-between', marginBottom: 50, marginTop: 50 }}>
                        {this.renderList()}
                    </Block>
                </Block>
            </Block>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        nightmode: state.nightmode,
        groups: state.groups,
        lights: state.lights
    }
}

export default connect(
    mapStateToProps,
    null
)(SceneLocationList)

const styles = StyleSheet.create({
    row: {
        marginTop: 20,
    },
    text: {
        fontSize: 30,
        textAlign: 'center'
    },
    categories: {
        flexWrap: 'wrap',
        marginBottom: theme.sizes.base * 3.5,
    },
    category: {
        minWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
        maxWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
        maxHeight: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    },
    roomText: {
        fontSize: (width <= 350) ? 9 : (width < 380) ? 12 : 14
    },
});