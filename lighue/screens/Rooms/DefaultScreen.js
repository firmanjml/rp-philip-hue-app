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
import { SetLampState } from '../../redux/actions';
import { GetAllGroups, GetAllLights, GetConfig, ChangeSaving, SearchForNewLights } from '../../redux/actions';
import DialogInput from 'react-native-dialog-input';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

import { ColorizeRows } from '../../components/ColorConvert';

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
    }

    componentWillMount() {
        this.props._fetchEverything(true);
        this.props._changeSavingToFalse(false);
        setInterval(() => {
            this.props._fetchEverything();
            this.checkBridgeStatus()
        }, 3000)
    }

    setTapBridgeInfo() {
        this.state.tapBridgeInfo === 4 ? this.setState({ tapBridgeInfo: 0 }) : this.setState({ tapBridgeInfo: this.state.tapBridgeInfo + 1 });
        console.log(this.props.lights[1])
    }

    checkBridgeStatus() {
        if (!this.props.status && !this.state.alertStatus && !this.props.cloud_enable) {
            this.setState({
                alertStatus: true
            })
            Alert.alert(
                'No connection to Philips Hue Bridge',
                "Please try to reconnect",
                [{
                    text: 'Cancel',
                    onPress: () => { this.setState({ alertStatus: false }) },
                    style: 'cancel',
                },
                {
                    text: "Reconnect",
                    onPress: () => {
                        {
                            this.setState({ alertStatus: false }),
                                this.props._fetchEverything(true),
                                console.log("reconnect")
                        }
                    }
                }],
                { cancelable: false }
            );
        }
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
                    this.setState({ active: tab })
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
        const { navigation, groups, nightmode, lights, schedules, _changeLightState } = this.props;
        const { colors } = theme;
        const refreshtextcolor = nightmode ? colors.white : colors.black
        const textcolor = { color: nightmode ? colors.white : colors.black }
        const graytextcolor = { color: nightmode ? colors.gray2 : colors.black }
        const marginTop = { marginTop: Platform.OS == "android" ? 20 : 0 }

        if (this.state.active === 'ROOMS') {
            return (
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
                                <View style={[styles.bulbRow, { backgroundColor: ColorizeRows(lights[key].state.xy[0], lights[key].state.xy[1], lights[key].state.bri) }]}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props._fetchAllLights();
                                            setTimeout(() => {
                                                navigation.navigate('ControlBulb', {
                                                    id: key
                                                });
                                            }, 700);
                                            console.log(lights)
                                        }}>
                                        <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text googlemedium style={{ fontSize: 21, marginLeft: 20, color: 'white' }}>{lights[key].name.length > 15 ? lights[key].name.substring(0, 15) + "..." : lights[key].name}</Text>
                                            <View style={{ marginRight: 20 }}>
                                                <ToggleSwitch
                                                    offColor="#DDDDDD"
                                                    onColor={theme.colors.secondary}
                                                    onToggle={(value) => {
                                                        _changeLightState(key, {
                                                            "on": value,
                                                        })
                                                    }}
                                                    isOn={lights[key].state.on}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ marginLeft: 20 }}>
                                            <Text style={{ marginTop: 5, color: 'white' }}>Brightness {Math.round((lights[key].state.bri * 100) / 254)}%</Text>
                                            <Text style={{ marginTop: 5, color: 'white' }}>Saturation {Math.round((lights[key].state.sat * 100) / 254)}%</Text>
                                            <View style={{ marginTop: 10, flexDirection: 'row' }}>
                                                <MaterialIcons name="room" size={20} color='white'></MaterialIcons>
                                                <Text style={{ marginLeft: 5, color: 'white' }}>Room</Text>
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

                    <View style={{ paddingHorizontal: theme.sizes.base * 2 }}>
                        <Text bold style={[textcolor, { fontSize: 21, marginBottom: 10 }]}>List of Schedules</Text>
                        <ScrollView>
                            {
                                Object.keys(schedules).map((val, index) => {
                                    const str = schedules[val].name.split("#");
                                    return (
                                        <View key={index} style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity
                                                onPress={() => this.props.navigation.navigate("ViewSchedule", {
                                                    id: val
                                                })}>
                                                {str[1] == null ?
                                                    <Text style={[textcolor, { fontSize: 21, alignSelf: 'center', marginTop: 10, marginBottom: 10 }]}>{`${str[0]}`}</Text>
                                                    :
                                                    <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10, marginBottom: 10 }}>
                                                        <Text style={[textcolor, { fontSize: 21 }]}>{`${str[0]}`}</Text>
                                                        <Text style={[graytextcolor, { fontSize: 21 }]}>{` - ${str[1]}`}</Text>
                                                    </View>
                                                }
                                            </TouchableOpacity>
                                            <View style={styles.divider} />
                                        </View>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>

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
                    <Text h1 googlebold>Explore</Text>
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
        config: state.config
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