import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native'
import { Block, Text, Card, Badge } from '../../components';
import { theme, constant } from '../../constants';
import { connect } from 'react-redux';

const { height, width } = Dimensions.get('window');

class LocationList extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft:
                <TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ height: 40, width: 80, justifyContent: 'center' }}>
                        <Image source={require('../../assets/icons/back.png')} />
                    </TouchableOpacity>
                </TouchableOpacity>
        }
    }

    state = {
        location: ["Home", "Room", "Individual Bulb"],
        roomModal: false,
        bulbModal: false
    }

    redirection(value) {
        const { navigation } = this.props;
        if (this.state.location[value] == "Home") {
            navigation.state.params.returnData(this.state.location[value])
            navigation.goBack()
        }
        else if (this.state.location[value] == "Room") {
            // navigation.state.params.returnData(this.state.location[value])
            // navigation.goBack()
            this.setState({ roomModal: true })
        }
        else {
            // navigation.state.params.returnData(this.state.location[value])
            // navigation.goBack()
            // navigation.navigate("BulbListScreen")
            this.setState({ bulbModal: true })
            console.log(this.state.bulbModal)
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
                    onPress={() => this.redirection(val)}>
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
                                <Text h1 style={textcolor}>No Room Created</Text>
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
                                                    <Image source={constant.class_img[groups[val].class]} />
                                                    :
                                                    <Image source={constant.class_img["Other"]} />
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

    redirectionRoom = (val) => {
        const { navigation } = this.props;
        navigation.state.params.returnData("room", val)
        navigation.goBack()
        this.setState({ roomModal: false })
    }

    renderModalRoom() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        return (
            <Modal animationType={"slide"}
                transparent={false}
                visible={this.state.roomModal}
                onRequestClose={() => console.log("Modal has been closed.")}>
                <Block style={backgroundcolor}>
                    <Block container>
                        <Text h1 style={[titlecolor, { fontWeight: 'bold' }]}>Choose room</Text>
                        <Block flex={false} row style={[styles.tabs, backgroundcolor]}>
                            {this.renderListRoom()}
                        </Block>
                    </Block>
                </Block>
            </Modal>
        )
    }

    renderListBulb() {
        const { lights, nightmode } = this.props;
        const { colors } = theme;
        const textcolor = { color: nightmode ? colors.white : colors.black }
        const marginTop = { marginTop: Platform.OS == "android" ? 20 : 0 }
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                // style={{ paddingVertical: theme.sizes.base * 2 }}
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
                                    <Block flex={false} row space="between" style={{ marginTop: 10, marginBottom: 30 }}>
                                        <Text bold style={[styles.textControl, textcolor]}>{lights[val].name}</Text>
                                        <Text bold style={[styles.textControl, textcolor]}>></Text>
                                    </Block>
                                </TouchableOpacity>
                            ))
                    }
                </Block>
            </ScrollView>
        )
    }

    redirectionBulb = (val) => {
        const { navigation } = this.props;
        navigation.state.params.returnData("bulb", val)
        navigation.goBack()
        this.setState({ bulbModal: false })
    }

    renderModalBulb() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        return (
            <Modal animationType={"slide"}
                transparent={false}
                visible={this.state.bulbModal}
                onRequestClose={() => this.setState({ bulbModal: !this.state.bulbModal })}>
                <Block style={backgroundcolor}>
                    <Block container>
                        <Text h1 style={[titlecolor, { fontWeight: 'bold' }]}>Choose bulb</Text>
                        <Block flex={false} row style={[styles.tabs, backgroundcolor]}>
                            {this.renderListBulb()}
                        </Block>
                    </Block>
                </Block>
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
                    <Text h1 bold style={[titlecolor, { marginTop: 10 }]}>Where to control?</Text>
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
)(LocationList)

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