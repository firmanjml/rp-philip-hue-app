import C from '../constants';
import { combineReducers } from 'redux';
import _ from 'lodash';

/** 
 * loading
 * * Redux reducer stores loading data to Redux state.
*/
export const loading = (state = false, action) => {
    if (action.type === C.CHANGE_LOADING) {
        return action.payload;
    } else {
        return state;
    }
}

/** 
 * nightmode
 * * Redux reducer stores nightmode data to Redux state.
*/
export const nightmode = (state = false, action) => {
    if (action.type === C.CHANGE_THEME) {
        return action.payload;
    } else {
        return state
    }
}

/** 
 * authentication
 * * Redux reducer stores authentication data to Redux state.
*/
export const authentication = (state = false, action) => {
    if (action.type === C.CHANGE_AUTHENTICATION_STATE) {
        return action.payload;
    }
    else { 
        return state
    }
}

/** 
 * hardware
 * * Redux reducer stores authentication hardware support data to Redux state.
*/
export const hardwareSupport = (state = 0, action) => {
    if (action.type === C.CHANGE_HARDWARE_SUPPORT) {
        return action.payload;
    }
    else {
        return state
    }
}

/** 
 * bridgeIndex
 * * Redux reducer stores the index of the bridge to Redux state.
*/
export const bridgeIndex = (state = 0, action) => {
    switch (action.type) {
        case C.CHANGE_BRIDGE:
            return action.payload;
        default:
            return state;
    }
}

/** 
 * bridgeip
 * * Redux reducer stores bridge ip address data to Redux state.
*/
export const bridgeip = (state = [], action) => {
    switch (action.type) {
        case C.FETCH_BRIDGE_IP:
            _state = JSON.parse(JSON.stringify(state))
            _state[0] = action.payload;
            return _state;
        case C.ADD_BRIDGE:
            _state = JSON.parse(JSON.stringify(state))
            _state.push(action.payload);
            return _state;
        default:
            return state;
    }
}

/** 
 * username
 * * Redux reducer stores username data it recevied from the API to Redux state.
*/
export const username = (state = [], action) => {
    switch (action.type) {
        case C.FETCH_USERNAME:
            _state = JSON.parse(JSON.stringify(state))
            _state.push(action.payload)
            return _state;
        default:
            return state;
    }
}

/** 
 * config
 * * Redux reducer stores config data it recevied from the API to Redux state.
*/
export const config = (state = {}, action) => {
    switch (action.type) {
        case C.FETCH_CONFIG:
            _state = JSON.parse(JSON.stringify(state));
            _state = action.payload;
            return _state;
        default:
            return state;
    }
}

/** 
 * groups
 * * Redux reducer stores group data it recevied from the API to Redux state
*/
export const groups = (state = {}, action) => {
    switch (action.type) {
        case C.FETCH_ALL_GROUPS:
            _state = JSON.parse(JSON.stringify(state));
            _state = action.payload;
            return _state;
        case C.FETCH_GROUP:
            _state = JSON.parse(JSON.stringify(state));
            _state[action.id] = action.payload;
            return _state;
        case C.CHANGE_GROUP_STATE:
            _state = JSON.parse(JSON.stringify(state));
            _.merge(_state[action.id].action, action.payload);
            return _state;
        case C.CREATE_GROUP:
            _state = JSON.parse(JSON.stringify(state));
            _state[action.id] = action.payload;
            return _state;
        case C.DELETE_GROUP:
            _state = JSON.parse(JSON.stringify(state));
            delete _state[payload]
            return _state;
        default:
            return state;
    }
}

/** 
 * lights
 * * Redux reducer stores light data it recevied from the API to Redux state
*/
export const lights = (state = {}, action) => {
    switch (action.type) {
        case C.FETCH_ALL_LIGHTS:
            _state = JSON.parse(JSON.stringify(state));
            _state = action.payload;
            return _state;
        case C.CHANGE_LIGHT_STATE:
            _state = JSON.parse(JSON.stringify(state));
            _state[action.id].state = action.payload;
            return _state;
        case C.DELETE_LIGHT:
            _state = JSON.parse(JSON.stringify(state));
            delete _state[payload]
            return _state;
        default:
            return state;
    }
}

/** 
 * schedules
 * * Redux reducer stores schedule data it recevied from the API to Redux state
*/
export const schedules = (state = {}, action) => {
    switch (action.type) {
        case C.FETCH_ALL_SCHEDULES:
            _state = JSON.parse(JSON.stringify(state));
            _state = action.payload;
            return _state;
        case C.CREATE_SCHEDULE:
            _state = JSON.parse(JSON.stringify(state))
            _state[action.id] = action.payload;
            return _state;
        default:
            return state;
    }
}

export default combineReducers({
    bridgeIndex,
    bridgeip,
    config,
    groups,
    authentication,
    hardwareSupport,
    lights,
    schedules,
    loading,
    username,
    nightmode
});