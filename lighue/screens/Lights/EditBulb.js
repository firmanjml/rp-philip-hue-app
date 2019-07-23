import React from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import validator from "validator";
import { Button, Block, Text, Input } from "../../components";
import { theme } from "../../constants";
import { SetLampAttributes } from "../../redux/actions";


class EditBulb extends React.Component {
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
    id: 0,
    bulbName: null,
    checked: false
  };

  componentWillMount() {
    this.setState({
      id: this.props.navigation.getParam("id", "1"),
      bulbName: this.props.navigation.getParam("name", "")
    });
  }


  changeName = (value) => {
    this.setState({ bulbName: value })
}

  saveBulbName() {
    this.props._changeLampName(this.state.id,{
      name : this.state.bulbName
    })
  }


  render() {
    const { nightmode } = this.props;
    const { colors } = theme;
    const bordercolor = { borderColor: nightmode ? colors.white : colors.gray2 }
    const textcolor = { color: colors.gray2 }
    const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
    return (
      <Block style={backgroundcolor}>
        <Block container>
          <Text h1 bold color={"white"} style={{ textAlign: "left" }}>Edit Bulb Info</Text>
          <Block style={{ marginTop: 10 }}>
            <Text semibold paragraph white style={{ marginTop: 20 }}>Bulb Name</Text>
            <Input
              style={[styles.textInput, textcolor, bordercolor]}
              value={this.state.bulbName}
              onChangeText={this.changeName}
              returnKeyType={'done'}
            />
          </Block>
          <Block bottom flex={1} style={{ marginBottom: 10 }}>
            <Button
              gradient
              startColor="#0A7CC4"
              endColor="#2BDACD"
              onPress={() => this.saveBulbName()}>
              <Text center semibold white>Save</Text>
            </Button>
          </Block>

        </Block>
      </Block>
    );
  }

}


const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    lights: state.lights,
    nightmode: state.nightmode
  }
}


const mapDispatchToProps = dispatch => {
  return {
    _changeLampName(id, data) {
      return dispatch(SetLampAttributes(id, data));
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
    borderColor: "white",
    textAlign: "left",
    paddingBottom: 10
  },
  line: {
    marginTop: 10,
    marginVertical: 5,
    marginHorizontal: 2,
    borderBottomWidth: 1,
    borderColor: "#E1E3E8"
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditBulb);
