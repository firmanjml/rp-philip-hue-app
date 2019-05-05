import React, { Component } from 'react'
import { Text, StyleSheet, View, Button } from 'react-native'
import { connect } from 'react-redux'
import { fetchAllGroups } from '../redux/actions'
import Spinner from "react-native-loading-spinner-overlay";

const mapStateToProps = state => {
    return {
        groups: state.groups,
        loading: state.loading
    }
}

const mapDispatchToprops = (dispatch, ownProps) => {
    return {
        _fetchAllGroups() {
            return () => dispatch(fetchAllGroups());
        }
    }
}

class TestScreen extends Component {
    componentWillMount() {
        // before calling get group api
        console.log(this.props.groups);

        this.props._fetchAllGroups()();
        // after calling get group api
        console.log(this.props.groups[0].name);
    }

    test() {
        this.props.groups.map((group, index) => {
            console.log(group)
            // display group one by one
            return (
                <View>
                    {
                        // Room component here.
                    }
                </View>
            )
        })
    }

    render() {
        // Example 
        return(
            <View style={styles.container}>
            <Spinner visible={this.props.loading} />
            <View>
                <Text style={{ fontSize: 20 }}>{this.props.groups[0].name}</Text>
                <View style={styles.manualButton}>
                    <Button
                        title="Test"
                        onPress={() => this.test()}
                    />
                </View>
            </View>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButton: {
        marginTop: 50,
    },
    manualButton: {
        marginTop: 50
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToprops
)(TestScreen)
