import C from './constants';
import qs from 'qs';
import axios from 'axios';
import { Constants } from 'expo';
import { Alert } from 'react-native';
import { constant } from '../constants';

/** 
 * ChangeLoading
 * * Change loading state before rendering the information to screen.
 * @param {boolean} visibility This paramter takes in boolean data
*/
export const ChangeLoading = (visibility) => ({
    type: C.CHANGE_LOADING,
    payload: visibility
});

export const ChangeCloudState = (boolean) => ({
    type: C.CHANGE_CLOUD,
    payload: boolean
});

export const ChangeCloudToken = (code = '') => (dispatch) => {
    let b64 = constant.secret.basicToken;
    axios({
        url: `https://api.meethue.com/oauth2/token?code=${code}&grant_type=authorization_code`,
        method: "POST",
        headers : {
            'Authorization': `Basic ${b64}`
        }
    }).then((res) => {
        dispatch({
            type: C.CHANGE_CLOUD_TOKEN,
            payload: {
                token: res.data.access_token,
                refresh_token: res.data.refresh_token
            }
        });
        dispatch(ChangeCloudState(true));
    }).catch((error) => {
        // unauthroize 401, 400
        console.log(error);
    })
};

export const RefreshCloudToken = () => (dispatch, getState) => {
    let b64 = constant.secret.basicToken;
    axios({
        url: "https://api.meethue.com/oauth2/refresh?grant_type=refresh_token",
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${b64}`
        },
        data: qs.stringify({ 'refresh_token': getState().cloud.refresh_token })
    }).then((res) => {
        dispatch({
            type: C.CHANGE_CLOUD_TOKEN,
            payload: {
                token: res.data.access_token,
                refresh_token: res.data.refresh_token
            }
        });
    }).catch((error) => {
        // unauthroize 401, 400
        console.log(error);
    })
}

/** 
 * SwitchBridge
 * * Allow switching into multiple bridges
 * @param {number} index This paramter takes in the index of the bridge.
*/
export const SwitchBridge = (index = 0) => (dispatch) => {
    dispatch({
        type: C.CHANGE_BRIDGE,
        payload: index
    })
}

export const ChangeThemeMode = (boolean) => (dispatch) => {
    dispatch({
        type: C.CHANGE_THEME,
        payload: boolean
    })
}

/** 
 * Authentication
 * * Enable authentication 
 * @param {number} boolean This parameter takes in the boolean
*/
export const ChangeAuthentication = (boolean) => (dispatch) => {
    dispatch({
        type : C.CHANGE_AUTHENTICATION_STATE,
        payload : boolean
    })
}

/** 
 * Hardware Support
 * * Index "1" for Fingerprint (Android, iPhone 5s > iPhone 8), Index "2" for Face ID (iPhone X & newer)
 * @param {number} index This paramter takes in the index of hardware support
*/
export const ChangeHardwareSupport = (index = 0) => (dispatch) => {
    dispatch({
        type : C.CHANGE_HARDWARE_SUPPORT,
        payload : index
    })
}

/** 
 * GetBridgeIP
 * * Discover Bridge IP through NUPNP or set manual IP
 * * https://developers.meethue.com/develop/get-started-2/
 * @param {object} navigation This paramter takes in navigation props
 * @param {boolean} isManual This paramter takes in boolean data
 * @param {string} bridgeip This paramter takes in the bridge ip address if 'isManual' is true.
*/
export const GetBridgeIP = (navigation, isManual = false, bridgeip = '') => async (dispatch, getState) => {
    dispatch(ChangeLoading(true));
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
            dispatch(ChangeLoading(false));
        });
    } else {
        await axios({
            url: 'https://discovery.meethue.com',
            method: 'GET'
        }).then((res) => {
            if (res.data.length > 0) {
                dispatch({
                    type: C.FETCH_BRIDGE_IP,
                    payload: res.data[0].internalipaddress
                })
            }
        }).catch((error) => {
            dispatch(ChangeLoading(false));
            console.log(error)
        }).then(() => {
            dispatch(ChangeLoading(false));
        });
    }
}

export const AddBridge = (bridgeip = "") => (dispatch) => {
    dispatch({
        type: C.ADD_BRIDGE,
        payload: bridgeip
    })
}

/** 
 * GetAllLights
 * * Document 1.1 Get All Light
 * * https://developers.meethue.com/develop/hue-api/lights-api/#get-all-lights
*/
export const GetAllLights = () => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/lights` : `https://api.meethue.com/bridge/${username}/lights`;
    const headers = getState().cloud_enable === true ? {"Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json"} : {"Content-Type": "application/json"};

    dispatch(ChangeLoading(true));
    axios({
        url,
        method: 'GET',
        headers
    }).then((res) => {
        dispatch({
            type: C.FETCH_ALL_LIGHTS,
            payload: res.data
        })
    }).catch((error) => {
        dispatch(ChangeLoading(false));
        // console.log(error);
    }).then(dispatch(ChangeLoading(false)));
};

/** 
 * SearchForNewLights
 * * Document 1.3 Search For New Light
 * * https://developers.meethue.com/develop/hue-api/lights-api/#search-for-new-lights
*/
export const SearchForNewLights = () => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/lights` : `https://api.meethue.com/bridge/${username}/lights`;
    const headers = getState().cloud_enable === true ? {"Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json"} : {"Content-Type": "application/json"};

    axios({
        url,
        method: 'POST',
        headers
    }).catch((error) => {
        console.log(error);
    })
};

/** 
 * SetLampAttributes
 * * Document 1.5 Set Light Attributes
 * * https://developers.meethue.com/develop/hue-api/lights-api/#set-light-state
 * @param {number} lampID This paramter takes in the light ID.
 * @param {object} lampData This paramter takes in the body argument of the request.
*/
export const SetLampAttributes = (lampID, lampData) => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/lights/${lampID}` : `https://api.meethue.com/bridge/${username}/lights/${lampID}`;
    const headers = getState().cloud_enable === true ? {"Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json"} : {"Content-Type": "application/json"};

    dispatch(ChangeLoading(true));
    axios({
        url,
        method: 'PUT',
        headers,
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
                type: C.CHANGE_LIGHT_ATTR,
                id: lampID,
                payload: payload
            })
        } else {
            throw Error('An error has occur');
        }
    }).catch((error) => {
        dispatch(ChangeLoading(false));
        // console.log(error);
    }).then(dispatch(ChangeLoading(false)));
};

/** 
 * SetLampState
 * * Document 1.6 Set Light State
 * * https://developers.meethue.com/develop/hue-api/lights-api/#set-light-state
 * @param {number} lampID This paramter takes in the light ID.
 * @param {object} lampData This paramter takes in the body argument of the request.
*/
export const SetLampState = (lampID, lampData) => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/lights/${lampID}/state` : `https://api.meethue.com/bridge/${username}/lights/${lampID}/state`;
    const headers = getState().cloud_enable === true ? {"Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json"} : {"Content-Type": "application/json"};

    dispatch(ChangeLoading(true));
    axios({
        url,
        method: 'PUT',
        headers,
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
        dispatch(ChangeLoading(false));
        // console.log(error);
    }).then(dispatch(ChangeLoading(false)));
};

/** 
 * DeleteLight
 * * Document 1.7. Delete lights
 * * https://developers.meethue.com/develop/hue-api/lights-api/#del-lights
 * @param {number} lampID This paramter takes in the light ID.
*/
export const DeleteLight = (lampID) => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/lights/${lampID}` : `https://api.meethue.com/bridge/${username}/lights/${lampID}`;
    const headers = getState().cloud_enable === true ? {"Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json"} : {"Content-Type": "application/json"};

    dispatch(ChangeLoading(true));
    axios({
        url,
        method: 'DELETE',
        headers
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
        dispatch(ChangeLoading(false));
        console.log(error);
    }).then(dispatch(ChangeLoading(false)));
};

/** 
 * GetAllGroups
 * * Document 2.1. Get all groups
 * * https://developers.meethue.com/develop/hue-api/groupds-api/#get-all-groups
*/
export const GetAllGroups = () => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/groups` : `https://api.meethue.com/bridge/${username}/groups`;
    const headers = getState().cloud_enable === true ? {"Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json"} : {"Content-Type": "application/json"};

    dispatch(ChangeLoading(true));
    axios({
        url,
        method: 'GET',
        headers
    }).then((res) => {
        dispatch({
            type: C.FETCH_ALL_GROUPS,
            payload: res.data
        })
    }).catch((error) => {
        dispatch(ChangeLoading(false));
        console.log(error);
    }).then(dispatch(ChangeLoading(false)));
};

/** 
 * CreateGroup
 * * Document 2.2. Create group
 * * https://developers.meethue.com/develop/hue-api/groupds-api/#create-group
 * @param {object} groupData This parameter takes in the body argument of the request.
*/
export const CreateGroup = (groupData) => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/groups` : `https://api.meethue.com/bridge/${username}/groups`;
    const headers = getState().cloud_enable === true ? {"Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json"} : {"Content-Type": "application/json"};

    dispatch(ChangeLoading(true));
    axios({
        url,
        method: 'POST',
        headers,
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
        dispatch(ChangeLoading(false));
        console.log(error);
    }).then(dispatch(ChangeLoading(false)));
};

/** 
 * GetGroupAtrributes
 * * Document 2.3. Get group attributes
 * * https://developers.meethue.com/develop/hue-api/groupds-api/#get-group-attr
 * @param {number} groupID This paramter takes in the group ID.
*/
export const GetGroupAtrributes = (groupID) => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/groups/${groupID}` : `https://api.meethue.com/bridge/${username}/groups/${groupID}`;
    const headers = getState().cloud_enable === true ? {"Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json"} : {"Content-Type": "application/json"};

    dispatch(ChangeLoading(true));
    axios({
        url,
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
        dispatch(ChangeLoading(false));
        console.log(error);
    }).then(dispatch(ChangeLoading(false)));
};

/** 
 * SetGroupState
 * * Document 2.5. Set group state
 * * https://developers.meethue.com/develop/hue-api/groupds-api/#set-gr-state
 * @param {number} groupID This paramter takes in the group ID.
 * @param {object} groupData This paramter takes in the body argument of the request.
*/
export const SetGroupState = (groupID, groupData) => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/groups/${groupID}/action` : `https://api.meethue.com/bridge/${username}/groups/${groupID}/action`;
    const headers = getState().cloud_enable === true ? {"Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json"} : {"Content-Type": "application/json"};

    dispatch(ChangeLoading(true));
    axios({
        url,
        method: 'PUT',
        headers,
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
        dispatch(ChangeLoading(false));
        console.log(error);
    }).then(dispatch(ChangeLoading(false)));
};

/** 
 * DeleteGroup
 * * Document 2.6. Delete Group
 * * https://developers.meethue.com/develop/hue-api/groupds-api/#del-group
 * @param {number} groupID This paramter takes in the group ID.
*/
export const DeleteGroup = (groupID) => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/groups/${groupID}` : `https://api.meethue.com/bridge/${username}/groups/${groupID}`;
    const headers = getState().cloud_enable === true ? {"Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json"} : {"Content-Type": "application/json"};

    dispatch(ChangeLoading(true));
    axios({
        url,
        method: 'DELETE',
        headers
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
        dispatch(ChangeLoading(false));
        console.log(error);
    }).then(dispatch(ChangeLoading(false)));
};

/** 
 * CreateUser
 * * Document 7.1. Create user
 * * https://developers.meethue.com/develop/hue-api/7-configuration-api/#create-user
*/
export const CreateUser = () => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];

    dispatch(ChangeLoading(true));
    axios({
        url: `http://${bridgeip}/api`,
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
        dispatch(ChangeLoading(false));
        console.log(error);
    }).then(dispatch(ChangeLoading(false)));
};

/** 
 * GetConfig
 * * Document 7.2. Get configuration
 * * https://developers.meethue.com/develop/hue-api/7-configuration-api/#get-configuration 
*/
export const GetConfig = (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];

    dispatch(ChangeLoading(true));
    axios({
        url: `http://${bridgeip}/api/${username}/config`,
        method: 'GET'
    }).then((res) => {
        dispatch({
            type: C.FETCH_CONFIG,
            payload: res.data
        })
    }).catch((error) => {
        dispatch(ChangeLoading(false));
        console.log(error);
    }).then(dispatch(ChangeLoading(false)));
};

/** 
 * GetSchedules
 * * Document 3.1. Get schedules
 * * https://developers.meethue.com/develop/hue-api/3-schedules-api/#get-all-schedules 
*/
export const GetSchedules = () => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/schedules` : `https://api.meethue.com/bridge/${username}/schedules`;
    const headers = getState().cloud_enable === true ? {"Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json"} : {"Content-Type": "application/json"};
    
    dispatch(ChangeLoading(true));
    axios({
        url,
        method: 'GET',
        headers
    }).then((res) => {
        dispatch({
            type: C.FETCH_ALL_SCHEDULES,
            payload: res.data
        })
    }).catch((error) => {
        dispatch(ChangeLoading(false));
        console.log(error);
    }).then(dispatch(ChangeLoading(false)));
};

/** 
 * CreateSchedules
 * * Document 3.2. Create schedules
 * * https://developers.meethue.com/develop/hue-api/3-schedules-api/#create-schedule
 * @param {object} scheduleData This parameter takes in the body argument of the request.
*/
export const CreateSchedules = (scheduleData) => (dispatch, getState) => {
    const i = getState().bridgeIndex;
    const bridgeip = getState().bridgeip[i];
    const username = getState().username[i];
    const url = getState().cloud_enable === false ? `http://${bridgeip}/api/${username}/schedules` : `https://api.meethue.com/bridge/${username}/schedules`;
    const headers = getState().cloud_enable === true ? {"Authorization": `Bearer ${getState().cloud.token}`, "Content-Type": "application/json"} : {"Content-Type": "application/json"};

    dispatch(ChangeLoading(true));
    axios({
        url,
        method: 'POST',
        headers,
        data: scheduleData
    }).then(res => {
        if (res.data[0].success) {
            dispatch({
                type: C.CREATE_SCHEDULE,
                id: res.data[0].success.id,
                payload: scheduleData
            })
        } else {
            throw Error('Can\'t create a schedule');
        }
    }).catch((error) => {
        dispatch(ChangeLoading(false));
        console.log(error);
    }).then(dispatch(ChangeLoading(false)));
};