import C from './constants';
import axios from 'axios';
import { Constants } from 'expo';
import { Alert } from 'react-native';

/** 
 * changeLoading
 * * Change loading state before rendering the information to screen.
 * @param {boolean} visibility This paramter takes in boolean data
*/
export const changeLoading = visibility => ({
    type: C.CHANGE_LOADING,
    payload: visibility
});

/** 
 * GetBridgeIP
 * * Discover Bridge IP through NUPNP or set manual IP
 * * https://developers.meethue.com/develop/get-started-2/
 * @param {object} navigation This paramter takes in navigation props
 * @param {boolean} isManual This paramter takes in boolean data
 * @param {string} bridgeip This paramter takes in the bridge ip address if 'isManual' is true.
*/
export const GetBridgeIP = (navigation, isManual = false, bridgeip = '') => async (dispatch) => {
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

/** 
 * GetAllLights
 * * Document 1.1 Get All Light
 * * https://developers.meethue.com/develop/hue-api/lights-api/#get-all-lights
*/
export const GetAllLights = (dispatch, getState) => {
    dispatch(changeLoading(true));
    axios({
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

/** 
 * SetLampState
 * * Document 1.6 Set Light State
 * * https://developers.meethue.com/develop/hue-api/lights-api/#set-light-state
 * @param {number} lampID This paramter takes in the light ID.
 * @param {object} lampData This paramter takes in the body argument of the request.
*/
export const SetLampState = (lampID, lampData) => (dispatch, getState) => {
    dispatch(changeLoading(true));
    axios({
        url: `http://${getState().bridgeip}/api/${getState().username}/lights/${lampID}/state`,
        method: 'PUT',
        data: lampData
    }).then(res => {
        var payload = {};
        res.data.map((data) => {
            let key = Object.keys(data.success)[0].substring(Object.keys(data.success)[0].lastIndexOf('/') + 1);
            let value = Object.values(data.success)[0];
            payload[key] = value;
        })
        if (payload) {
            dispatch({
                type: C.CHANGE_LIGHT_STATE,
                id: lampID,
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

/** 
 * DeleteLight
 * * Document 1.7. Delete lights
 * * https://developers.meethue.com/develop/hue-api/lights-api/#del-lights
 * @param {number} lampID This paramter takes in the light ID.
*/
export const DeleteLight = (lampID) => (dispatch, getState) => {
    dispatch(changeLoading(true));
    axios({
        url: `http://${getState().bridgeip}/api/${getState().username}/lights/${lampID}`,
        method: 'DELETE'
    }).then((res) => {
        if (res.data[0].success) {
            dispatch({
                type: C.DELETE_LIGHT,
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

/** 
 * GetAllGroups
 * * Document 2.1. Get all groups
 * * https://developers.meethue.com/develop/hue-api/groupds-api/#get-all-groups
*/
export const GetAllGroups = (dispatch, getState) => {
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

/** 
 * CreateGroup
 * * Document 2.2. Create group
 * * https://developers.meethue.com/develop/hue-api/groupds-api/#create-group
 * @param {object} groupData This paramter takes in the body argument of the request.
*/
export const CreateGroup = (groupData) => (dispatch, getState) => {
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

/** 
 * GetGroupAtrributes
 * * Document 2.3. Get group attributes
 * * https://developers.meethue.com/develop/hue-api/groupds-api/#get-group-attr
 * @param {number} groupID This paramter takes in the group ID.
*/
export const GetGroupAtrributes = (groupID) => (dispatch, getState) => {
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

/** 
 * SetGroupState
 * * Document 2.5. Set group state
 * * https://developers.meethue.com/develop/hue-api/groupds-api/#set-gr-state
 * @param {number} groupID This paramter takes in the group ID.
 * @param {object} groupData This paramter takes in the body argument of the request.
*/
export const SetGroupState = (groupID, groupData) => (dispatch, getState) => {
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

/** 
 * DeleteGroup
 * * Document 2.6. Delete Group
 * * https://developers.meethue.com/develop/hue-api/groupds-api/#del-group
 * @param {number} groupID This paramter takes in the group ID.
*/
export const DeleteGroup = (groupID) => (dispatch, getState) => {
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

/** 
 * CreateUser
 * * Document 7.1. Create user
 * * https://developers.meethue.com/develop/hue-api/7-configuration-api/#create-user
*/
export const CreateUser = () => (dispatch, getState) => {
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
                type: C.CHANGE_USERNAME,
                payload: res.data[0].success.username
            });
        }
    }).catch((error) => {
        dispatch(changeLoading(false));
        console.log(error);
    }).then(dispatch(changeLoading(false)));
};

/** 
 * GetConfig
 * * Document 7.2. Get configuration
 * * https://developers.meethue.com/develop/hue-api/7-configuration-api/#get-configuration 
*/
export const GetConfig = async (dispatch, getState) => {
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