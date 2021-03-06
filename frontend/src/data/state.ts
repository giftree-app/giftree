import { combineReducers } from './combineReducers';
import { userReducer } from './user/user.reducer';

export const initialState: AppState = {
  user: {
    darkMode: false,
    isLoggedin: false,
    loading: false,
    reload: false
  }
};

export const reducers = combineReducers({
  user: userReducer
});

export type AppState = ReturnType<typeof reducers>;