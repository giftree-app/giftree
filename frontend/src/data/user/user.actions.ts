import { getUserData, setIsLoggedInData, setUsernameData, setUserIdData, setGiftIdData, setGroupIdData, setReloadData } from '../dataApi';
import { ActionType } from '../../util/types';
import { UserState } from './user.state';


export const loadUserData = () => async (dispatch: React.Dispatch<any>) => {
  dispatch(setLoading(true));
  const data = await getUserData();
  dispatch(setData(data));
  dispatch(setLoading(false));
}

export const setLoading = (isLoading: boolean) => ({
  type: 'set-user-loading',
  isLoading
} as const);

export const setData = (data: Partial<UserState>) => ({
  type: 'set-user-data',
  data
} as const);

export const logoutUser = () => async (dispatch: React.Dispatch<any>) => {
  await setIsLoggedInData(false);
  dispatch(setUsername());
};

export const setIsLoggedIn = (loggedIn: boolean) => async (dispatch: React.Dispatch<any>) => {
  await setIsLoggedInData(loggedIn);
  return ({
    type: 'set-is-loggedin',
    loggedIn
  } as const)
};

export const setUsername = (username?: string) => async (dispatch: React.Dispatch<any>) => {
  await setUsernameData(username);
  return ({
    type: 'set-username',
    username
  } as const);
};

export const setUserId = (userId?: string) => async (dispatch: React.Dispatch<any>) => {
  await setUserIdData(userId);
  return ({
    type: 'set-userid',
    userId
  } as const);
};

export const setGiftId = (giftId?: string) => async (dispatch: React.Dispatch<any>) => {
  await setGiftIdData(giftId);
  return ({
    type: 'set-giftid',
    giftId
  } as const);
};

export const setGroupId = (groupId?: string) => async (dispatch: React.Dispatch<any>) => {
  await setGroupIdData(groupId);
  return ({
    type: 'set-groupid',
    groupId
  } as const);
};


export const setReload = (reload: boolean) => async (dispatch: React.Dispatch<any>) => {
  await setReloadData(reload);
  return ({
    type: 'set-reload',
    reload
  } as const);
};


export const setDarkMode = (darkMode: boolean) => ({
  type: 'set-dark-mode',
  darkMode
} as const);

export type UserActions =
  | ActionType<typeof setLoading>
  | ActionType<typeof setData>
  | ActionType<typeof setIsLoggedIn>
  | ActionType<typeof setReload>
  | ActionType<typeof setUsername>
  | ActionType<typeof setUserId>
  | ActionType<typeof setGiftId>
  | ActionType<typeof setGroupId>
  | ActionType<typeof setDarkMode>
