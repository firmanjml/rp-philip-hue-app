import React, { Component } from 'react'
import { Image, StyleSheet, TouchableOpacity, Button } from 'react-native'
import { Block, Text } from '../../components';
import { theme } from '../../constants';
import { connect } from 'react-redux';
import { ImagePicker, Permissions, Constants, Camera } from 'expo';

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
        image: null,
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
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

    render() {
        let { image } = this.state;
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight }
        const titlecolor = { color: nightmode ? colors.white : colors.black }
        return (
            <Block style={backgroundcolor}>
                <Camera style={{ flex: 1 }} type={this.state.type}>
                    <Block container>

                        <Text h1 bold style={[titlecolor, { marginTop: 10 }]}>Add Scenes</Text>
                        <Button
                            title="Pick an image from camera roll"
                            onPress={this._pickImage}
                        />
                        <Button
                            title="Click to take picture"
                            onPress={this._pickImage}
                        />
                        {image &&
                            <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                    </Block>
                </Camera>
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
    }
});