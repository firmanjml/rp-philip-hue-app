import React from "react";
import {
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  Picker
} from "react-native";
import { connect } from "react-redux";
import validator from "validator";
import { Button, Block, Text, Input } from "../../components";
import { theme } from "../../constants";
import { GetAllGroups } from "../../redux/actions";
import { SetGroupState } from "../../redux/actions";
import { GetAllLights } from "../../redux/actions";


class EditRoomScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ height: 40, width: 80, justifyContent: "center" }}
          >
            <Image source={require("../../assets/icons/back.png")} />
          </TouchableOpacity>
        </TouchableOpacity>
      )
    };
  };

  state = {
    id: null,
    roomNameOld: null,
    roomNameNew: null,
    roomType: null,
    checked: false
  };

  componentWillMount() {
    this.setState({ id: this.props.navigation.getParam("id", "1") });
  }

  componentDidMount() {
    this.setState({
      roomNameOld: this.props.groups[this.state.id].name
    });
  }

  handleName = text => {
    this.setState({ roomNameNew: text });
  };

  updateRoom = room => {
    this.setState({ roomType: room });
  };

  render() {
    return (
      <Block style={styles.container}>
        <Block container>
          <Text h1 center bold color={"white"} style={{ textAlign: "left" }}>
            {this.props.groups[this.state.id].name}
          </Text>
          <Block marginTop={30}>
            <Text semibold paragraph white>
              Room Name
            </Text>
            <Input
              style={styles.textInput}
              onChangeText={this.handleName}
              placeholder={this.state.roomNameOld}
              placeholderTextColor={theme.colors.gray2}
            />

            <Text semibold paragraph white>
              Room Type
            </Text>
            <Picker
              selectedValue={this.state.room}
              onValueChange={this.updateRoom}
              style={{ color: "white" }}
            >
              <Picker.Item label="Living Room" value="living_room" />
              <Picker.Item label="Recreation" value="recreation" />
              <Picker.Item label="Terrace" value="terrace" />
              <Picker.Item label="Kitchen" value="kitchen" />
              <Picker.Item label="Office" value="office" />
              <Picker.Item label="Garden" value="garden" />
              <Picker.Item label="Dining" value="dining" />
              <Picker.Item label="Gym" value="gym" />
              <Picker.Item label="Driveway" value="driveway" />
              <Picker.Item label="Bedroom" value="bedroom" />
              <Picker.Item label="Hallway" value="hallway" />
              <Picker.Item label="Carport" value="carport" />
              <Picker.Item label="Kids Bedroom" value="kids_room" />
              <Picker.Item label="Toilet" value="toilet" />
              <Picker.Item label="Other" value="other" />
              <Picker.Item label="Bathroom" value="bathroom" />
              <Picker.Item label="Front Door" value="front_door" />
              <Picker.Item label="Nursery" value="nursery" />
              <Picker.Item label="Garage" value="garage" />
            </Picker>

            <Text semibold paragraph white>
              Class
            </Text>

            <Text semibold paragraph white>
              Number of Light(s)
            </Text>
          </Block>

          <Block bottom flex={1} style={{ marginBottom: 10 }}>
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
                    { cancelable: false }
                  );
                }
              }}
            >
              <Text center semibold white>
                Save
              </Text>
            </Button>
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
    lights: state.lights
  };
};

const mapDispatchToProps = dispatch => {
  return {
    _GetAllGroups() {
      return dispatch(GetAllGroups());
    },
    _fetchAllLights() {
      return dispatch(GetAllLights());
    },
    _changeGroupStateByID(id, data) {
      return dispatch(SetGroupState(id, data));
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
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditRoomScreen);

