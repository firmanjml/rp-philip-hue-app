import React from "react";
import {
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  BackHandler,
  View,
  Modal, ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import { Button, Block, Text, Input } from "../../components";
import { theme } from "../../constants";
import { SetGroupAttributes, DeleteGroup } from "../../redux/actions";

class EditRoomScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ height: 40, width: 80, justifyContent: "center" }}
        >
          <Image source={require("../../assets/icons/back.png")} />
        </TouchableOpacity>
      )
    };
  };



  state = {
    id: 0,
    roomName: "",
    roomType: "",
    checked: false
  };

  componentWillMount() {
    this.setState({
      id: this.props.navigation.getParam("id", "1"),
      roomName: this.props.navigation.getParam("roomName", ""),
      roomClass: this.props.navigation.getParam("roomClass", "Other")
    });
  }

  // The 3 parts below handles hardware Back Button on Android
  componentDidMount() {
    this.BackHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackPress
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  handleBackPress = () => {
    Alert.alert(
      "You are still editing!",
      "Are you sure you want to exit room editing? This will not save current input.",
      [
        { text: "Keep Editing", onPress: () => { }, style: "cancel" },
        { text: "Exit Anyways", onPress: () => this.props.navigation.goBack() }
      ],
      { cancelable: false }
    );
    return true;
  };

  handleName = text => {
    this.setState({ roomName: text });
  };


  confirmEditRoom() {
    this.props._changeGroupAttribute(this.state.id, {
      "name": this.state.roomName
    }, this.props.navigation);
  }

  returnClassData = (val) => {
    this.setState({
      roomClass: val
    })
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
            <Text>Saving...</Text>
          </View>
        </View>
      </Modal>
    )
  }


  renderRoomType(textcolor) {
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

  confirmDeleteRoom() {
    Alert.alert(
      "Are you sure?",
      "This will remove this group from the bridge",
      [
        { text: "No", onPress: () => { }, style: "cancel" },
        { text: "Yes", onPress: () => this.props._deleteGroup(this.state.id, this.props.navigation) }
      ],
      { cancelable: false }
    );
  }

  render() {
    const { nightmode } = this.props;
    const { colors } = theme;
    const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight };
    const titlecolor = { color: nightmode ? colors.white : colors.black };
    const bordercolor = { borderColor: nightmode ? colors.white : colors.black }
    const textcolor = { color: nightmode ? colors.white : colors.gray3 };
    return (
      <Block style={backgroundcolor}>
        <Block container>
          <Text h1 center bold style={[titlecolor, { textAlign: "left" }]}>Edit Room Info</Text>
          <Block marginTop={30}>
            {this.renderLoadingModal()}
            <Text semibold paragraph style={titlecolor}>
              Room Name
            </Text>
            <Input
              style={[styles.textInput, textcolor, bordercolor]}
              value={this.state.roomName}
              onChangeText={this.handleName}
              placeholderTextColor={theme.colors.gray2}
            />
            <Block flex={false} column style={styles.row}>
              <Text style={[titlecolor]}>Room Type</Text>
              <View style={{ marginTop: 20 }}>
                {this.renderRoomType(textcolor)}
              </View>
              <View style={[styles.divider, bordercolor, { marginTop: 5 }]} />
            </Block>
          </Block>
          <Block bottom flex={1} style={{ marginBottom: 20 }}>
            <Button
              onPress={() => this.confirmEditRoom()}>
              <Text center semibold white>Save</Text>
            </Button>
            <TouchableOpacity
              onPress={() => this.confirmDeleteRoom()}>
              <Text center semibold white style={{ alignSelf: 'center' }}>Delete Room</Text>
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
    );
  }
}

const mapStateToProps = state => {
  return {
    saving: state.saving,
    groups: state.groups,
    lights: state.lights,
    nightmode: state.nightmode
  };
};

const mapDispatchToProps = dispatch => {
  return {
    _changeGroupStateByID(id, data) {
      return dispatch(SetGroupState(id, data));
    },
    _changeGroupAttribute(id, data, navigate) {
      return dispatch(SetGroupAttributes(id, data, navigate));
    },
    _deleteGroup(id, navigation) {
      return dispatch(DeleteGroup(id, navigation))
    }
  };
};

const styles = StyleSheet.create({
  textInput: {
    height: 25,
    borderBottomWidth: 0.5,
    borderRadius: 0,
    borderWidth: 0,
    color: theme.colors.gray2,
    borderColor: "white",
    textAlign: "left",
    paddingBottom: 10
  },
  divider: {
    borderBottomWidth: 0.5
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditRoomScreen);
