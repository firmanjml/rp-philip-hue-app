import C from './constants';
import axios from 'axios';
import { persistor } from './store';
import { Constants } from 'expo';
import { Alert } from 'react-native';

export const changeLoading = visibility => ({
    type: C.CHANGE_LOADING,
    payload: visibility
});

export const fetchBridgeIp = (navigation, isManual = false, bridgeip) => async (dispatch) => {
    dispatch(changeLoading(true));
    if (isManual) {
        await axios({
            url: `http://${bridgeip}/api/nouser/config`,
            method: 'GET'
        }).then((res) => {
            if (res.data.modelid === "BSB001") {
                dispatch({
                    type: C.FETCH_BRIDGE_IP,
                    payload: bridgeip
                })
                navigation.navigate('LinkButton');
            } else {
                throw Error('Invalid IP');
            }
        }).catch((error) => {
            setTimeout(() => {
                Alert.alert(
                    'IP address you entered cannot be reached',
                    "Please try again",
                    [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                    { cancelable: false }
                );
            }, 500);
        }).then(() => {
            dispatch(changeLoading(false));
        });
    } else {
        await axios({
            // url: 'https://discovery.meethue.com',
            url: 'https://api.myjson.com/bins/1eqhrc',
            method: 'GET'
        }).then((res) => {
            dispatch({
                type: C.FETCH_BRIDGE_IP,
                payload: res.data[0].internalipaddress
            })
        }).catch((error) => {
            dispatch(changeLoading(false));
            console.log(error)
        }).then(() => {
            dispatch(changeLoading(false));
        });
    }
}

export const createUser = () => (dispatch, getState) => {
    dispatch(changeLoading(true));
    axios({
        url: `http://${getState().bridgeip}/api`,
        method: 'POST',
        data: {
            devicetype: `Lighue#${Constants.deviceName}`
        }
    }).then((res) => {
        if (res.data[0].success) {
            dispatch({
                type: C.FETCH_USERNAME,
                payload: res.data[0].success.username
            });
        }
    }).catch((error) => {
        dispatch(changeLoading(false));
        console.log(error);
    }).then(dispatch(changeLoading(false)));
};

export const fetchConfig = async (dispatch, getState) => {
    dispatch(changeLoading(true));
    await axios({
        url: `http://${getState().bridgeip}/api/${getState().username}/config`,
        method: 'GET'
    }).then((res) => {
        dispatch({
            type: C.FETCH_CONFIG,
            payload: res.data
        })
    }).catch((error) => {
        dispatch(changeLoading(false));
        console.log(error);
    }).then(dispatch(changeLoading(false)));
};

export const addGroup = (groupData) => (dispatch, getState) => {
    dispatch(changeLoading(true));
    axios({
        url: `http://${getState().bridgeip}/api/${getState().username}/groups`,
        method: 'POST',
        data: groupData
    }).then(res => {
        if (res.data[0].success) {
            dispatch({
                type: C.CREATE_GROUP,
                id: res.data[0].success.id,
                payload: {
                    "name": groupData.name,
                    "lights": groupData.lights,
                    "type": groupData.type,
                    "action": {}
                }
            })
        } else {
            throw Error('Can\'t create a room.');
        }
    }).catch((error) => {
        dispatch(changeLoading(false));
        console.log(error);
    }).then(dispatch(changeLoading(false)));
};

export const fetchAllGroups = (dispatch, getState) => {
    dispatch(changeLoading(true));
    axios({
        url: `http://${getState().bridgeip}/api/${getState().username}/groups`,
        method: 'GET'
    }).then((res) => {
        dispatch({
            type: C.FETCH_ALL_GROUPS,
            payload: res.data
        })
    }).catch((error) => {
        dispatch(changeLoading(false));
        console.log(error);
    }).then(dispatch(changeLoading(false)));
};

export const getGroupStateByID = (groupID) => (dispatch, getState) => {
    dispatch(changeLoading(true));
    axios({
        url: `http://${getState().bridgeip}/api/${getState().username}/groups/${groupID}`,
        method: 'GET',
    }).then(res => {
        if (res.data) {
            dispatch({
                type: C.FETCH_GROUP,
                id: groupID,
                payload: payload
            })
        } else {
            throw Error('An error has occur');
        }
    }).catch((error) => {
        dispatch(changeLoading(false));
        console.log(error);
    }).then(dispatch(changeLoading(false)));
};

export const changeGroupStateByID = (groupID, groupData) => (dispatch, getState) => {
    dispatch(changeLoading(true));
    axios({
        url: `http://${getState().bridgeip}/api/${getState().username}/groups/${groupID}/action`,
        method: 'PUT',
        data: groupData
    }).then(res => {
        var payload = {};
        res.data.map((data) => {
            let key = Object.keys(data.success)[0].substring(Object.keys(data.success)[0].lastIndexOf('/') + 1);
            let value = Object.values(data.success)[0];
            payload[key] = value;
        })
        if (payload) {
            dispatch({
                type: C.CHANGE_GROUP_STATE,
                id: groupID,
                payload: payload
            })
        } else {
            throw Error('An error has occur');
        }
    }).catch((error) => {
        dispatch(changeLoading(false));
        console.log(error);
    }).then(dispatch(changeLoading(false)));
};

export const deleteGroupByID = (groupID) => (dispatch, getState) => {
    dispatch(changeLoading(true));
    axios({
        url: `http://${getState().bridgeip}/api/${getState().username}/groups/${groupID}`,
        method: 'DELETE'
    }).then((res) => {
        if (res.data[0].success) {
            dispatch({
                type: C.DELETE_GROUP,
                payload: groupID
            })
        } else {
            throw Error('An error has occur')
        }
    }).catch((error) => {
        dispatch(changeLoading(false));
        console.log(error);
    }).then(dispatch(changeLoading(false)));
};

export const fetchAllLights = (lights = []) => async (dispatch, getState) => {
    dispatch(changeLoading(true));
    await axios({
        url: `http://${getState().bridgeip}/api/${getState().username}/lights`,
        method: 'GET'
    }).then((res) => {
        dispatch({
            type: C.FETCH_ALL_LIGHTS,
            payload: res.data
        })
    }).catch((error) => {
        dispatch(changeLoading(false));
        console.log(error);
    }).then(dispatch(changeLoading(false)));
};

export const fetchLight = (lampID) => async (dispatch, getState) => {
    dispatch(changeLoading(true));
    await axios({
        url: `http://${getState().bridgeip}/api/${getState().username}/lights/${lampID}`,
        method: 'GET'
    }).then((res) => {
        dispatch({
            type: C.FETCH_LIGHTS,
            payload: res.data
        })
    }).catch((error) => {
        dispatch(changeLoading(false));
        console.log(error);
    }).then(dispatch(changeLoading(false)));
};

export const changeLampStateByID = (lampID, lampData) => (dispatch, getState) => {
    dispatch(changeLoading(true));
    axios({
        url: `http://${getState().bridgeip}/api/${getState().username}/lights/${lampID}/state`,
        method: 'PUT',
        data: lampData
    }).then(res => {
        if (res.data[0].success) {
            dispatch({
                type: C.CHANGE_LIGHT_STATE,
                payload: lampID
            })
        } else {
            throw Error('An error has occur')
        }
    }).catch((error) => {
        dispatch(changeLoading(false));
        console.log(error);
    }).then(dispatch(changeLoading(false)));
};