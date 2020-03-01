import React, { Component } from 'react'
import {
    Dimensions,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
    RefreshControl,
    Platform,
    Modal,
    ActivityIndicator,
    Alert
} from 'react-native'
import { Card, Badge, Block, Text } from '../../components';
import { theme, constant } from '../../constants';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import ToggleSwitch from "../../components/ToggleSwitch";
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { SetLampState, SetGroupState } from '../../redux/actions';
import { GetAllGroups, GetAllLights, GetConfig, ChangeSaving, SearchForNewLights } from '../../redux/actions';
import DialogInput from 'react-native-dialog-input';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

const { width } = Dimensions.get('window');

class DefaultScreen extends Component {
    static navigationOptions = {
        header: null
    }

    state = {
        tapBridgeInfo: 0,
        dialogModal: false,
        active: 'ROOMS',
        categories: [],
        refreshing: false,
        alertStatus: false,
        houseOn : true
    }

    componentWillMount() {
        this.props._fetchEverything();
        setInterval(() => {
            this.props._fetchEverything();
        }, 5000)
    }

    setTapBridgeInfo() {
        this.state.tapBridgeInfo === 4 ? this.setState({ tapBridgeInfo: 0 }) : this.setState({ tapBridgeInfo: this.state.tapBridgeInfo + 1 });
        console.log(this.props.capabilities)
    }

    renderLoadingModal() {
        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={this.props.loading}
                onRequestClose={() => { console.log('close modal') }}>
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator
                            animating={this.props.loading}
                            color="#00ff00" />
                    </View>
                </View>
            </Modal>
        )
    }

    renderTab(tab, backgroundcolor) {
        const { active } = this.state, isActive = active === tab;
        return (
            <TouchableOpacity
                key={`tab-${tab}`}
                onPress={() => {
                    this.setState({ active: tab });
                }}
                style={[
                    styles.tab,
                    backgroundcolor,
                    isActive ? styles.active : null
                ]}>
                <Text size={16} bold gray={!isActive} secondary={isActive}>
                    {tab}
                </Text>
            </TouchableOpacity>
        )
    }

    renderMenu(tab) {
        if (this.state.active === 'ROOMS') {
            return (
                <Menu onSelect={value => this.onMenuRoomSelect(value)}>
                    <MenuTrigger>
                        <Ionicons name="ios-menu" size={30} color="white" />
                    </MenuTrigger>
                    <MenuOptions style={{ padding: 15 }} >
                        <MenuOption value={1}><Text black h3>Create new room</Text></MenuOption>
                        <View style={styles.divider} />
                        <MenuOption value={3}><Text black h3>Settings</Text></MenuOption>
                    </MenuOptions>
                </Menu>
            )
        }
        else if (this.state.active === "LIGHTS") {
            return (
                <Menu onSelect={value => this.onMenuLightSelect(value)}>
                    <MenuTrigger>
                        <Ionicons name="ios-menu" size={30} color="white" />
                    </MenuTrigger>
                    <MenuOptions style={{ padding: 15 }} >
                        <MenuOption value={1}><Text black h3>Search for new bulb</Text></MenuOption>
                        <View style={styles.divider} />
                        <MenuOption value={2}><Text black h3>Manual bulb search</Text></MenuOption>
                        <View style={styles.divider} />
                        <MenuOption value={3}><Text black h3>Settings</Text></MenuOption>
                    </MenuOptions>
                </Menu>
            )
        }
        else if (this.state.active === "SCHEDULES") {
            return (
                <Menu onSelect={value => this.onMenuScheduleSelect(value)}>
                    <MenuTrigger>
                        <Ionicons name="ios-menu" size={30} color="white" />
                    </MenuTrigger>
                    <MenuOptions style={{ padding: 15 }} >
                        <MenuOption value={1}><Text black h3>Add Schedules</Text></MenuOption>
                        <View style={styles.divider} />
                        <MenuOption value={2}><Text black h3>Settings</Text></MenuOption>
                    </MenuOptions>
                </Menu>
            )
        }
    }

    displayLayout() {
        const { navigation, groups, nightmode, lights, schedules, _changeLightState, _changeGroupStateByID } = this.props;
        const { colors } = theme;
        const refreshtextcolor = nightmode ? colors.white : colors.black
        const textcolor = { color: nightmode ? colors.white : colors.black }
        const graytextcolor = { color: nightmode ? colors.gray2 : colors.black }
        const marginTop = { marginTop: Platform.OS == "android" ? 10 : 0 }

        if (this.state.active === 'ROOMS') {
            return (
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: theme.sizes.base * 2 }}>
                        <Text header bold style={{color : 'white', alignSelf : 'center'}}>Whole Home</Text>
                        <ToggleSwitch
                            offColor="#DDDDDD"
                            onColor={theme.colors.secondary}
                            onToggle={(value) => {
                                _changeGroupStateByID(0, {
                                    "on": value,
                                  });
                                  this.setState({houseOn : !this.state.houseOn})
                            }}
                            isOn={this.state.houseOn}
                        />
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{ paddingVertical: theme.sizes.base }}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                title={"Swipe to refresh...."}
                                titleColor={refreshtextcolor}
                                onRefresh={async () => {
                                    this.setState({ refreshing: true })
                                    await this.props._fetchAllGroups();
                                    setTimeout(() => {
                                        this.setState({ refreshing: false })
                                    }, 800);
                                }} />
                        }>
                        <Block flex={false} row space="between" style={[styles.categories, marginTop]}>
                            {
                                Object.entries(groups).length === 0 && groups.constructor === Object ?
                                    <Block middle center>
                                        <Text h1 bold style={[textcolor]}>
                                            No Room created
                                    </Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                navigation.navigate('AddRoom');
                                            }}>
                                            <Text h2 style={{ marginTop: 5, color: '#20D29B' }}>Add Rooms</Text>
                                        </TouchableOpacity>
                                    </Block>
                                    :
                                    Object.keys(groups).map(val => (
                                        <TouchableOpacity
                                            key={val}
                                            onPress={() => {
                                                this.props._fetchAllGroups(),
                                                    setTimeout(() => {
                                                        navigation.navigate('ControlRoom', {
                                                            id: val,
                                                            class: groups[val].class > -1 ? groups[val].class : "Other"
                                                        });
                                                    }, 700);
                                            }}>
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
                </View>
            )
        } else if (this.state.active === "LIGHTS") {
            return (
                Object.entries(lights).length === 0 && lights.constructor === Object ?
                    <Block style={{ paddingHorizontal: theme.sizes.base * 2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text h1 bold style={[textcolor]}>No light is found.</Text>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('SearchBulbScreen')}>
                            <Text h2 style={{ marginTop: 5, color: '#20D29B' }}>Search for new lights</Text>
                        </TouchableOpacity>
                    </Block>
                    :
                    <View style={{ paddingHorizontal: theme.sizes.base * 2 }}>
                        <FlatList
                            keyExtractor={(item) => item}
                            data={Object.keys(lights)}
                            renderItem={({ item: key }) => (
                                <View style={[styles.bulbRow, { backgroundColor: 'white' }]}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props._fetchAllLights();
                                            setTimeout(() => {
                                                navigation.navigate('ControlBulb', {
                                                    id: key
                                                });
                                            }, 700);
                                        }}>
                                        <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text googlemedium black style={{ fontSize: 16, marginLeft: 20 }}>{lights[key].name.length > 25 ? lights[key].name.substring(0, 15) + "..." : lights[key].name}</Text>
                                            <View style={{ marginRight: 20 }}>
                                                <ToggleSwitch
                                                    offColor="#DDDDDD"
                                                    onColor={theme.colors.secondary}
                                                    onToggle={(value) => {
                                                        _changeLightState(key, {
                                                            "on": value,
                                                        });
                                                        this.props._fetchEverything();
                                                    }}
                                                    isOn={lights[key].state.on}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ marginLeft: 20 }}>
                                            <Text gray style={{ marginTop: 5 }}>Brightness : {Math.round((lights[key].state.bri * 100) / 254)}%</Text>
                                            <Text gray style={{ marginTop: 5 }}>Saturation : {Math.round((lights[key].state.sat * 100) / 254)}%</Text>
                                            <View style={{ marginTop: 10, flexDirection: 'row' }}>
                                                <MaterialIcons name="room" size={20} color='gray'></MaterialIcons>
                                                <Text gray style={{ marginLeft: 5 }}>Room</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                            }
                        />
                    </View>
            )
        } else if (this.state.active === "SCHEDULES") {
            return (
                Object.entries(schedules).length === 0 && lights.constructor === Object ?
                    <Block style={{ paddingHorizontal: theme.sizes.base * 2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text h1 bold style={[textcolor]}>No schedules created.</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('AddSchedules')}>
                            <Text h2 style={{ marginTop: 5, color: '#20D29B' }}>Add schedules</Text>
                        </TouchableOpacity>
                    </Block>
                    :
                    <FlatList
                        keyExtractor={(item) => item}
                        data={Object.keys(schedules)}
                        renderItem={({ item: key }) => (
                            <View style={{ paddingHorizontal: theme.sizes.base * 2 }}>
                                <TouchableOpacity onPress={() => navigation.navigate('ViewSchedule', { id: key })}>
                                    <View style={{
                                        backgroundColor: 'white',
                                        paddingBottom: 20,
                                        paddingTop: 20,
                                        marginBottom: 20,
                                        borderRadius: 10
                                    }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 20, marginRight: 20 }}>
                                            <Text googlemedium black style={[{ fontSize: 16, alignSelf: 'center' }]}>{`${schedules[key].name.split("#")[0]} (${schedules[key].name.split("#")[1]})`}</Text>
                                            <ToggleSwitch
                                                offColor="#DDDDDD"
                                                onColor={theme.colors.secondary}
                                                onToggle={() => console.log("haloo")}
                                                isOn={schedules[key].status}
                                            />
                                        </View>
                                        <Text gray style={[{ fontSize: 15, marginLeft: 20, marginTop: 10 }]}>{`${schedules[key].description}`}</Text>
                                        <Text gray style={[{ fontSize: 15, marginLeft: 20, marginTop: 10 }]}>Location : {schedules[key].command.address.split("/")[3] == "groups" ? "Room" : schedules[key].command.address.split("/")[3] == "lights" ? "Bulb" : "House"}</Text>
                                        <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}>
                                            <Ionicons name="ios-alarm" size={20} color="gray"></Ionicons>
                                            <Text googlemedium gray style={[{ fontSize: 15, marginLeft: 10 }]}>{`${schedules[key].time}`}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                    />

            )
        }
    }

    onMenuRoomSelect(value) {
        if (value == 1) {
            this.props.navigation.navigate('AddRoom');
        } else if (value == 2) {
            this.props.navigation.navigate('TestScreen');
        } else if (value == 3) {
            this.props.navigation.navigate('Settings');
        }
    }

    onMenuScheduleSelect(value) {
        if (value == 1) {
            this.props.navigation.navigate('AddSchedules');
        } else if (value == 2) {
            this.props.navigation.navigate('Settings');
        }
    }

    onMenuLightSelect(value) {
        if (value == 1) {
            this.props.navigation.navigate('SearchBulbScreen');
        } else if (value == 2) {
            // this.props.navigation.navigate("LightDemo");
            this.setState({ dialogModal: true });
        } else if (value == 3) {
            this.props.navigation.navigate("Settings")
        }
    }

    onMenuSceneSelect(value) {
        if (value == 1) {
            this.props.navigation.navigate("AddScenes")
        } else if (value == 2) {
            this.props.navigation.navigate("Settings")
        }
    }

    _renderModal() {
        return (
            <DialogInput
                isDialogVisible={this.state.dialogModal}
                title={"Manual Search"}
                message={"Please enter the 6 digit sn"}
                hintInput={"34AFBE"}
                submitInput={(sn) => {
                    this.setState({ dialogModal: false });
                    if (sn.length == 6) {
                        this.props.navigation.navigate('SearchBulbScreen', {
                            "sn": sn
                        });
                    } else {
                        Alert.alert("Validation error", "Please enter 6 digit",
                            [{ text: "OK" }],
                            { cancelable: false })
                    }

                }}
                closeDialog={() => this.setState({ dialogModal: false })}
            />
        )
    }

    render() {
        const tabs = ['ROOMS', 'LIGHTS', 'SCHEDULES'];
        const { nightmode, config } = this.props;
        const { tapBridgeInfo } = this.state;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        return (
            <Block style={backgroundcolor}>
                <Block flex={false} center row space="between" style={styles.header}>
                    {this.renderLoadingModal()}
                    <Text h1 bold>Explore</Text>
                    {this.renderMenu(this.state.active)}
                </Block>
                <Block flex={false} style={{
                    paddingHorizontal: theme.sizes.base * 2,
                    marginTop: 5
                }}>
                    <TouchableOpacity onPress={() => this.setTapBridgeInfo()}>
                        <Text googleregular>{tapBridgeInfo === 0 ? `Bridge Name : ${config.name}` : tapBridgeInfo === 1 ? `IP Address : ${config.ipaddress}` : tapBridgeInfo === 2 ? `Bridge ID : ${config.bridgeid}` : tapBridgeInfo === 3 ? config.modelid : config.modelid}</Text>
                    </TouchableOpacity>

                </Block>
                <Block flex={false} row style={[styles.tabs, backgroundcolor]}>
                    {tabs.map(tab => this.renderTab(tab))}
                </Block>
                {this.displayLayout()}
                {this._renderModal()}
            </Block>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        _fetchAllGroups: () => dispatch(GetAllGroups()),
        _fetchAllLights: () => dispatch(GetAllLights()),
        _changeLightState(id, data) {
            return dispatch(SetLampState(id, data));
        },
        _changeGroupStateByID(id, data) {
            return dispatch(SetGroupState(id, data));
          },
        _fetchEverything(isLoading) {
            return dispatch(GetConfig(isLoading));
        },
        _changeSavingToFalse(boolean) {
            return dispatch(ChangeSaving(boolean))
        }
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        schedules: state.schedules,
        groups: state.groups,
        status: state.status,
        lights: state.lights,
        nightmode: state.nightmode,
        loading: state.loading,
        cloud_enable: state.cloud_enable,
        config: state.config,
        capabilities: state.capabilities
    }
}



const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background
    },
    header: {
        marginTop: 25,
        paddingHorizontal: theme.sizes.base * 2,
    },
    avatar: {
        height: theme.sizes.base * 2.2,
        width: theme.sizes.base * 2.2,
    },
    tabs: {
        marginTop: 25,
        justifyContent: 'space-around',
        borderBottomColor: theme.colors.gray2,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginVertical: theme.sizes.base,
        marginHorizontal: theme.sizes.base * 2,
    },
    tab: {
        paddingBottom: theme.sizes.base / 3
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
    bulbRow: {
        marginBottom: 20,
        paddingBottom: 15,
        borderRadius: 10
    },
    category: {
        minWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
        maxWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
        maxHeight: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    },
    roomText: {
        fontSize: (width <= 350) ? 9 : (width < 380) ? 12 : 14,
        color: 'black'
    },
    divider: {
        marginVertical: 5,
        marginHorizontal: 2,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(DefaultScreen);