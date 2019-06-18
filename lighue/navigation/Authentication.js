import React from 'react';
import { StyleSheet, Platform, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { theme } from '../constants';
import { Text } from '../components';

import { connect } from 'react-redux'
import { LocalAuthentication } from 'expo';

class Authentication extends React.Component {

    state = {
        authenticate: null
    }

    componentDidMount() {
        this.authentication();
    }

    authentication = async () => {
        this.setState({
            authenticate: "loading"
        })

        if (Platform.OS == "ios") {
            let result = await LocalAuthentication.authenticateAsync("Authenticate with your finger");
            if (result.success) {
                this.props.navigation.navigate("ListRoom")
            }
            else {
                this.setState({ authenticate: false })
            }
        }
        else {
            // android work in progress
            // this.setState({ status: "Waiting for authentication" })
            // let result = await LocalAuthentication.authenticateAsync("Authenticate for Lighue");
            // if (result.success) {
            //     this.setState({
            //         authenticate: result.success,
            //         status: ""
            //     })
            // } else {
            //     this.setState({ authenticate: result.success })
            // }
        }
    }

    renderView() {
        const { authenticate } = this.state;
        const { nightmode } = this.props;
        const { colors } = theme;
        const textcolor = { color: nightmode ? colors.white : colors.black }
        if (authenticate == 'loading') {
            return (
                <ActivityIndicator />
            )
        }
        else if (authenticate == false) {
            return (
                <View style={{ justifyContent: 'center' }}>
                    <Text h2 bold style={[{ textAlign: 'center' }, textcolor]}>You are not authenticated.</Text>
                    <Text h3 style={[{ textAlign: 'center' }, textcolor]}>Please try again</Text>
                    <TouchableOpacity
                        onPress={this.authentication}>
                        <Text h3 style={{ textAlign: 'center', marginTop: 20, color: '#20D29B' }}>Retry authentication</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    render() {
        const { nightmode } = this.props;
        const { colors } = theme;
        const backgroundcolor = { backgroundColor: nightmode ? colors.background : colors.backgroundLight };
        return (
            <View style={[styles.container, backgroundcolor]}>
                {this.renderView()}
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        nightmode: state.nightmode,
        hardwareSupport: state.hardwareSupport
    }
}

export default connect(
    mapStateToProps,
    null
)(Authentication)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    }
})

