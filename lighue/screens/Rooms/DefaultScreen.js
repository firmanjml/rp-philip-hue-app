import React, { Component } from 'react'
import { Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity, View, RefreshControl, Button } from 'react-native'
import { Card, Badge, Block, Text } from '../../components';
import { theme, constant } from '../../constants';
import Icon from 'react-native-vector-icons';
import { connect } from 'react-redux';
import { GetAllGroups, GetAllLights } from '../../redux/actions';
import { persistor } from "../../redux/store";
import { Constants, Updates } from 'expo';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    MenuProvider,
} from 'react-native-popup-menu';

const { height, width } = Dimensions.get('window');

var interval;
class DefaultScreen extends Component {
    static navigationOptions = {
        header: null
    }

    state = {
        active: 'Rooms',
        categories: [],
        refreshing: false
    }

    componentWillMount() {
        interval = setInterval(() => {
            this.props._fetchAllLights();
            this.props._fetchAllGroups();
        }, 2000)
    }

    // async componentDidMount() {
    //     await this.props._fetchAllGroups();
    //     // console.log(JSON.stringify({ name: Constants.deviceName, height, width }, null, 4))
    // }

    renderTab(tab) {
        const { active } = this.state;
        const isActive = active === tab;

        return (
            <TouchableOpacity
                key={`tab-${tab}`}
                onPress={() => {
                    this.setState({ active: tab })
                }}
                style={[
                    styles.tab,
                    isActive ? styles.active : null
                ]}
            >
                <Text size={16} medium gray={!isActive} secondary={isActive}>
                    {tab}
                </Text>
            </TouchableOpacity>
        )
    }

    renderMenu(tab) {
        if (this.state.active === 'Rooms') {
            return (
                <Menu onSelect={value => this.onMenuRoomSelect(value)}>
                    <MenuTrigger>
                        <Icon.Entypo name="dots-three-horizontal" size={25} color={theme.colors.gray} />
                    </MenuTrigger>
                    <MenuOptions style={{ padding: 15 }} >
                        <MenuOption value={1}><Text h3>Create new room</Text></MenuOption>
                        <View style={styles.divider} />
                        <MenuOption value={2}><Text h3>Debug mode</Text></MenuOption>
                        <View style={styles.divider} />
                        <MenuOption value={3}><Text h3>Settings</Text></MenuOption>
                        <View style={styles.divider} />
                        <MenuOption value={4}><Text h3 red>Clear cache</Text></MenuOption>
                    </MenuOptions>
                </Menu>
            )
        }
        else if (this.state.active === "Lights") {
            return (
                <Menu onSelect={value => this.onMenuLightSelect(value)}>
                    <MenuTrigger>
                        <Icon.Entypo name="dots-three-horizontal" size={25} color={theme.colors.gray} />
                    </MenuTrigger>
                    <MenuOptions style={{ padding: 15 }} >
                        <MenuOption value={1}><Text h3>Search for new bulb</Text></MenuOption>
                        <View style={styles.divider} />
                        <MenuOption value={2}><Text h3>Demo mode</Text></MenuOption>
                        <View style={styles.divider} />
                        <MenuOption value={3}><Text h3>Settings</Text></MenuOption>
                    </MenuOptions>
                </Menu>
            )
        }
    }

    displayLayout() {
        const { navigation, groups } = this.props;
        if (this.state.active === 'Rooms') {
            return (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    // style={{ paddingVertical: theme.sizes.base * 2 }}
                    style={{ paddingVertical: theme.sizes.base }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            title={"Swipe to refresh...."}
                            titleColor={theme.colors.white}
                            onRefresh={async () => {
                                this.setState({ refreshing: true })
                                await this.props._fetchAllGroups();
                                setTimeout(() => {
                                    this.setState({ refreshing: false })
                                }, 800);
                            }} />
                    }>
                    <Block flex={false} row space="between" style={styles.categories}>
                        {
                            Object.entries(groups).length === 0 && groups.constructor === Object ?
                                <Block middle center>
                                    <Text h1 white>No Room Created</Text>
                                </Block>
                                :
                                Object.keys(groups).map(val => (
                                    <TouchableOpacity
                                        key={val}
                                        onPress={() => {
                                            // this.props.navigation.navigate('', {
                                            //     roomId: val
                                            // });
                                            console.log(this.props.groups)
                                        }}>
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
        } else if (this.state.active === "Lights") {
            return (
                <Block>
                    <Text center h3 white>
                        Lights is not available at this moment.
                    </Text>
                    <Text paragraph white center>Please try again later.</Text>
                </Block>
            )
        } else {
            return (
                <Block>
                    <Text center h3 white>
                        Scene is not available at this moment.
                    </Text>
                    <Text paragraph white center>Please try again later.</Text>
                </Block>
            )
        }
    }

    onMenuRoomSelect(value) {
        console.log("DefaultScreen", "press menu " + value);
        if (value == 1) {
            // create Room
            // this.props.navigation.navigate('');
        } else if (value == 2) {
            this.props.navigation.navigate('TestScreen');
        } else if (value == 3) {
            // settings
            this.props.navigation.navigate('Settings');
        }  else {
            persistor.flush();
            persistor.purge();
            setTimeout(() => {
                // this.props.navigation.navigate("StartPage");
                Updates.reload()
            }, 1000);
        }
    }

    onMenuLightSelect(value) {
        if (value == 1) {
            // search new bulb
            // this.props.navigation.navigate('');
            console.log("Press bulb")
        } else if (value == 2) {
            this.props.navigation.navigate("LightDemo")
        } else if (value == 3) {
            this.props.navigation.navigate("Settings")
        }
    }

    render() {
        const { categories } = this.state;
        const tabs = ['Rooms', 'Lights', 'Scene'];

        return (
            <MenuProvider>
                <Block style={{ backgroundColor: theme.colors.background }}>
                    <Block flex={false} center row space="between" style={styles.header}>
                        <Text h1 white>Explore</Text>
                        {this.renderMenu(this.state.active)}
                    </Block>

                    <Block flex={false} row style={styles.tabs}>
                        {tabs.map(tab => this.renderTab(tab))}
                    </Block>
                    {this.displayLayout()}
                </Block>
            </MenuProvider>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        _fetchAllGroups: () => dispatch(GetAllGroups()),
        _fetchAllLights: () => dispatch(GetAllLights())
    }
}
const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        groups: state.groups,
        lights: state.lights,
        username: state.username,
        bridgeip: state.bridgeip
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultScreen);

const styles = StyleSheet.create({
    header: {
        marginTop: 40,
        paddingHorizontal: theme.sizes.base * 2,
    },
    avatar: {
        height: theme.sizes.base * 2.2,
        width: theme.sizes.base * 2.2,
    },
    tabs: {
        backgroundColor: theme.colors.background,
        justifyContent: 'space-around',
        borderBottomColor: theme.colors.gray2,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginVertical: theme.sizes.base,
        marginHorizontal: theme.sizes.base * 2,
    },
    tab: {
        backgroundColor: theme.colors.background,
        paddingBottom: theme.sizes.base
    },
    active: {
        borderBottomColor: theme.colors.secondary,
        borderBottomWidth: 3,
    },
    categories: {
        flexWrap: 'wrap',
        paddingHorizontal: theme.sizes.base * 2,
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
    divider: {
        marginVertical: 5,
        marginHorizontal: 2,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
})
