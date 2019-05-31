import React from "react";
import {
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  Picker,
  View,
  FlatList
} from "react-native";
import { connect } from "react-redux";
import CheckBox from 'react-native-check-box';
import validator from "validator";
import { Button, Block, Text, Input } from "../../components";
import { theme } from "../../constants";
import { CreateGroup, GetAllLights } from "../../redux/actions";

class AddRoomScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Are you sure?',
                'Go back',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  { text: 'OK', onPress: () => navigation.goBack() },
                ],
                { cancelable: true },
              )
            }}
            style={{ height: 40, width: 80, justifyContent: "center" }}
          >
            <Image source={require("../../assets/icons/back.png")} />
          </TouchableOpacity>
        </TouchableOpacity>
      )
    };
  };

  state = {
    name: null,
    room: null,
    isChecked: false,
    lightSelected: []
  };

  renderListBulb() {
    const { lights } = this.props;
    return (
      Object.entries(lights).length === 0 && groups.constructor === Object ?
        <Block middle center>
          <Text h1 style={{ color: "white" }}>No Bulb Found</Text>
        </Block>
        :
        Object.keys(lights).map(val => (
          <View style={styles.lampRow}>
            <Text paragraph style={{ color: 'white', alignSelf: 'center' }}>{lights[val].name}</Text>
            <CheckBox
              onClick={() => {
                this.setState({
                  isChecked: !this.state.isChecked
                })
              }}
              isChecked={this.state.isChecked}
              checkedCheckBoxColor="#1CD0A1"
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
        onPress={() => {
          if (validator.isAlphanumeric(this.handleName)) {
            this.props._CreateGroup(this.props.groupData);
          } else {
            Alert.alert(
              "Invalid Name Format",
              "Please re-enter the empty fields",
              [{ text: "OK", onPress: () => console.log("OK Pressed") }],
              { cancelable: true }
            );
          }
        }}>
        <Text center semibold white>Save</Text>
      </Button>
    )
  }

  selectedValue = () => {
    this.setState({ checked: !this.state.checked })
  }


  handleName = (text) => {
    this.setState({ name: text });
  };

  updateRoom = (room) => {
    this.setState({ room: room });
  };

  // handleCheckBox = () => {
  //   this.setState({ checked: !this.state.checked })
  // };

  renderPicker() {
    return (
      <Picker
        selectedValue={this.state.room}
        onValueChange={this.updateRoom}
        style={{ color: "white" }}
      >
        <Picker.Item label="Living Room" value="Living Room" />
        <Picker.Item label="Recreation" value="Recreation" />
        <Picker.Item label="Terrace" value="Terrace" />
        <Picker.Item label="Kitchen" value="Kitchen" />
        <Picker.Item label="Office" value="Office" />
        <Picker.Item label="Garden" value="Garden" />
        <Picker.Item label="Dining" value="Dining" />
        <Picker.Item label="Gym" value="Gym" />
        <Picker.Item label="Driveway" value="Driveway" />
        <Picker.Item label="Bedroom" value="Bedroom" />
        <Picker.Item label="Hallway" value="Hallway" />
        <Picker.Item label="Carport" value="Carport" />
        <Picker.Item label="Kids Bedroom" value="Kids Room" />
        <Picker.Item label="Toilet" value="Toilet" />
        <Picker.Item label="Other" value="Other" />
        <Picker.Item label="Bathroom" value="Bathroom" />
        <Picker.Item label="Front Door" value="Front Door" />
        <Picker.Item label="Nursery" value="Nursery" />
        <Picker.Item label="Garage" value="Garage" />
      </Picker>
    )
  }

  render() {
    return (
      <Block style={styles.container}>
        <Block container>
          <Text h1 bold color={"white"} style={{ textAlign: "left" }}>Create new room</Text>
          <Block style={{ marginTop: 10 }}>
            <Text semibold paragraph white style={{ marginTop: 20 }}>Name</Text>
            <Input
              style={styles.textInput}
              onChangeText={this.handleName}
              placeholder={"Insert Room Name"}
              placeholderTextColor={theme.colors.gray2}
            />
            <Text semibold paragraph white style={{ marginTop: 10 }}>Room Type</Text>
            {this.renderPicker()}
            <Text semibold paragraph white style={{ marginTop: 10 }}>Assign Bulb To Room</Text>
            <Block style={{ marginTop: 20 }}>
              {this.renderListBulb()}
            </Block>
          </Block>
          <Block bottom flex={1} style={{ marginBottom: 10 }}>
            {this.renderButton()}
          </Block>
        </Block>
      </Block>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.loading,
    groups: state.groups,
    lights: state.lights,
    nightmode: state.nightmode
  };
};

const mapDispatchToProps = dispatch => {
  return {
    _CreateGroup(groupData) {
      return dispatch(CreateGroup(groupData));
    }
  };
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background
  },
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
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddRoomScreen)
