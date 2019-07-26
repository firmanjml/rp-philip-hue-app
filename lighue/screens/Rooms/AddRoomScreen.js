import React from "react";
import { StyleSheet, Image, Alert, TouchableOpacity, View, BackHandler, ScrollView, Modal, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import CheckBox from 'react-native-check-box';
import { Button, Block, Text, Input } from "../../components";
import { theme } from "../../constants";
import { CreateGroup, SetLampState } from "../../redux/actions";

class AddRoomScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    name: null,
    roomClass: null,
    lightSelected: null,
  };

  // The 3 parts below handles hardware Back Button on Android

  componentWillMount() {
    this.loopBulb();
  }
  componentDidMount() {
    this.BackHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    Alert.alert(
      'You are still editing!',
      'Are you sure you want to exit room creation? This will not save current input.',
      [
        { text: "Keep Editing", onPress: () => { }, style: 'cancel' },
        { text: "Exit Anyways", onPress: () => this.props.navigation.goBack() },
      ],
      { cancelable: false },
    );
    return true;
  }

  lightBulbSelected = {};

  loopBulb() {
    for (var key in this.props.lights) {
      this.lightBulbSelected[key] = {
        selected: false
      }
    }
  }

  updateBulb = (val) => {
    const newBoolean = !this.lightBulbSelected[val].selected;
    this.lightBulbSelected[val].selected = newBoolean
    this.forceUpdate()
  }

  renderListBulb(titlecolor, checkboxcolor) {
    const { lights, _ChangeLampStateByID } = this.props;
    const { lightBulbSelected } = this;
    return (
      Object.entries(lightBulbSelected).length === 0 && lightBulbSelected.constructor === Object ?
        <Block middle center>
          <Text h1 style={titlecolor}>No Bulb Found</Text>
        </Block>
        :
        Object.keys(lightBulbSelected).map((val, index) => (
          <View key={index} style={styles.lampRow}>
            <TouchableOpacity
              key={val}
              onPress={() => _ChangeLampStateByID(val, {
                "alert": "select"
              })}>
              <Text paragraph style={[{ alignSelf: 'center' }, titlecolor]}>{lights[val].name}</Text>
            </TouchableOpacity>
            <CheckBox
              onClick={() => this.updateBulb(val)}
              isChecked={lightBulbSelected[val].selected}
              checkedCheckBoxColor="#1CD0A1"
              uncheckedCheckBoxColor={checkboxcolor}
            />
          </View>
        ))
    );
  }

  renderButton() {
    return (
      <Button
        gradient
        startColor="#0A7CC4"
        endColor="#2BDACD"
        onPress={() => this.createGroup()}>
        <Text center semibold white>Save</Text>
      </Button>
    )
  }

  async modifyLightSelected() {
    var light = [];
    for (var key in this.lightBulbSelected) {
      if (this.lightBulbSelected[key].selected) {
        light.push(key)
      }
    }
    this.setState({
      lightSelected: light
    })
  }

  async createGroup() {
    await this.modifyLightSelected();
    this.props._CreateGroup({
      name: this.state.name,
      lights: this.state.lightSelected,
      type: "Room",
      class: this.state.roomClass
    },
      this.props.navigation);
  }

  handleName = (text) => {
    this.setState({ name: text });
  };

  updateRoom = (room) => {
    this.setState({ roomClass: room });
  };

  updateSelected = (val) => {
    const newBoolean = !this.lightBulbSelected[val].selected;
    this.lightBulbSelected[val].selected = newBoolean
    this.forceUpdate()
  }

  returnClassData = (val) => {
    this.setState({
      roomClass: val
    })
  }

  renderRoomType(textcolor) {
    if (this.state.roomClass != null) {
      return (
        <Block flex={false} row space="between">
          <Text style={[textcolor]}>{this.state.roomClass}</Text>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('RoomType', { returnData: this.returnClassData.bind(this) });
            }}>
            <Text style={{ color: '#20D29B' }}>Edit</Text>
          </TouchableOpacity>
        </Block>
      )
    }
    else {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('RoomType', { returnData: this.returnClassData.bind(this) });
          }}>
          <Text style={{ color: theme.colors.gray2 }}>Choose room type</Text>
        </TouchableOpacity>
      )
    }
  }

  renderBackButton() {
    const { navigation } = this.props;
    return (
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ height: 40, width: 80, justifyContent: "center" }}>
        <Image source={require("../../assets/icons/back.png")} />
      </TouchableOpacity>
    )
  }

  renderSave() {
    const { nightmode } = this.props;
    const { colors } = theme;
    const textcolor = { color: nightmode ? colors.white : colors.black }
    if (this.state.name != null || this.state.roomClass != null) {
      return (
        <TouchableOpacity
          onPress={() => this.createGroup()}>
          <Text style={[textcolor, { justifyContent: 'center' }]}>Save</Text>
        </TouchableOpacity>
      )
    }
  }

  renderLoadingModal() {
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={this.props.saving}
        onRequestClose={() => { console.log('close modal') }}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator
              animating={this.props.saving}
              color="#00ff00" />
            <Text>Adding..</Text>
          </View>
        </View>
      </Modal>
    )
  }


  render() {
    const { nightmode } = this.props;
    const { colors } = theme;
    const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
    const titlecolor = { color: nightmode ? colors.white : colors.black }
    const textcolor = { color: nightmode ? colors.white : colors.gray2 }
    const bordercolor = { borderColor: nightmode ? colors.white : colors.black }
    const checkboxcolor = nightmode ? "white" : "black"
    return (
      <Block style={backgroundcolor}>
        <View style={styles.header}>
          {this.renderBackButton()}
          {this.renderLoadingModal()}
          {this.renderSave()}
        </View>
        <Block containerNoHeader>
          <Text h1 bold style={titlecolor}>Create New Room</Text>
          <ScrollView>
            <Block flex={false} column style={styles.row}>
              <Text bold style={titlecolor}>Name</Text>
              <Input
                style={[styles.textInput, textcolor, bordercolor]}
                onChangeText={this.handleName}
                placeholder={"Insert Room Name"}
                placeholderTextColor={theme.colors.gray2}
              />
            </Block>
            <Block flex={false} column style={styles.row}>
              <Text bold style={titlecolor}>Room Type</Text>
              <View style={{ marginTop: 20 }}>
                {this.renderRoomType(textcolor)}
              </View>
              <View style={[styles.divider, bordercolor, { marginTop: 5 }]} />
            </Block>
            <Block flex={false} column style={styles.row}>
              <View>
                <Text bold style={[{ marginTop: 10 }, titlecolor]}>Assign Bulb To Room</Text>
                <Text bold style={{ marginTop: 2, color: theme.colors.gray2 }}>Tap one of the bulb to make it blink</Text>
              </View>
              <View style={{ marginTop: 20 }}>
                {this.renderListBulb(titlecolor, checkboxcolor)}
              </View>
            </Block>
          </ScrollView>
        </Block>
      </Block>
    );
  }
}

const mapStateToProps = state => {
  return {
    groups: state.groups,
    lights: state.lights,
    nightmode: state.nightmode,
    saving: state.saving
  };
};

const mapDispatchToProps = dispatch => {
  return {
    _CreateGroup(groupData, navigation) {
      return dispatch(CreateGroup(groupData, navigation));
    },
    _ChangeLampStateByID(id, lampData) {
      return dispatch(SetLampState(id, lampData))
    }
  };
};

const styles = StyleSheet.create({
  textInput: {
    height: 25,
    borderBottomWidth: 0.5,
    borderRadius: 0,
    borderWidth: 0,
    color: "white",
    borderColor: "white",
    textAlign: "left",
    paddingBottom: 10
  },
  lampRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30
  },
  row: {
    marginTop: 20,
  },
  divider: {
    borderBottomWidth: 0.5
  },
  header: {
    marginTop: 30,
    paddingHorizontal: theme.sizes.base * 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddRoomScreen)
