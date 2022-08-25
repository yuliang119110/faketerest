import { combineReducers } from 'redux';
import metadataReducer from './metadata/metadata';
import userDataReducer from './user-data/user-data';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userData']
};

const rootReducer = combineReducers({
  metadata: metadataReducer,
  userData: userDataReducer
});

export default persistReducer(persistConfig, rootReducer);
