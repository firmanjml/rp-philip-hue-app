import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, Button, Modal } from 'react-native'
import { Block, Text, Input } from '../../components';
import { theme } from '../../constants';
import { connect } from 'react-redux';
import { ImagePicker, Permissions, Constants } from 'expo';
import CameraScreen from './Camera'

class AddScenes extends Component {
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
        name: null,
        image: null,
        hasCameraPermission: null,
        cameraModal: false
    };

    componentDidMount() {
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            const { statusCamera } = await Permissions.askAsync(Permissions.CAMERA);
            if (status !== 'granted' && statusCamera !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
        this.setState({ hasCameraPermission: statusCamera === 'granted' });
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
        });

        console.log(result);

        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    };

    changeNameText = (value) => {
        this.setState({ name: value })
    }

    renderInput() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const bordercolor = { borderColor: nightmode ? colors.white : colors.gray2 }
        const textcolor = { color: nightmode ? colors.gray2 : colors.black }
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        return (
            <Block>
                <Text bold h3 style={[styles.textControl, titlecolor, styles.row]}>Name</Text>
                <Input
                    style={[styles.textInput, textcolor, bordercolor]}
                    editable={true}
                    value={this.state.name}
                    placeholderTextColor={nightmode ? colors.gray2 : colors.black}
                    onChangeText={this.changeNameText}
                />
            </Block>
        )
    }

    renderCamera() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                style={{position: 'absolute'}}
                visible={this.state.cameraModal}>
                <CameraScreen/>
            </Modal>
        )
    }

    render() {
        let { image } = this.state;
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        return (
            <Block style={backgroundcolor}>
                <Block container>
                    <Text h1 bold style={[titlecolor, { marginTop: 10 }]}>Add Scenes</Text>
                    {this.renderInput()}
                    <Button
                        title="Pick an image from camera roll"
                        onPress={this._pickImage}
                    />
                    {image &&
                        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                </Block>
            </Block>
        )
    }

}


const mapStateToProps = (state) => {
    return {
        nightmode: state.nightmode,
    }
}

export default connect(
    mapStateToProps,
    null
)(AddScenes)

const styles = StyleSheet.create({
    row: {
        marginTop: 20,
    },
    textSetting: {
        fontSize: 24,
        color: 'black',
        alignSelf: "center"
    },
    textInput: {
        height: 30,
        borderBottomWidth: .5,
        borderRadius: 0,
        borderWidth: 0,
        textAlign: 'left',
        paddingBottom: 10
    },
});