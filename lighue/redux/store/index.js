import reducer from './reducers';
import thunk from 'redux-thunk';
import initialState from '../initiateState'
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';

const persistorConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: autoMergeLevel2
};

const pReducer = persistReducer(persistorConfig, reducer);

export const reduxStore = createStore(
    pReducer,
    initialState,
    applyMiddleware(thunk)
);

export const persistor = persistStore(reduxStore);