import { Plugins } from '@capacitor/core';
import { Group } from '../models/Group';

const { Storage } = Plugins;

const dataUrl = '/assets/data/data.json';
const locationsUrl = '/assets/data/locations.json';

const HAS_LOGGED_IN = 'hasLoggedIn';
const USERNAME = 'username';
const USERID = 'userId';
const GIFTID = 'giftId';
const GROUPID = 'groupId';
const NEED_TO_RELOAD = 'reload';

export const getConfData = async () => {
  const response = await Promise.all([
    fetch(dataUrl),
    fetch(locationsUrl)]);
  const responseData = await response[0].json();
  const groups = responseData.groups as Group[];
  const locations = await response[1].json() as Location[];
  
  const data = {
    locations,
    groups
  }
  return data;
}

export const getUserData = async () => {
  const response = await Promise.all([
    Storage.get({ key: HAS_LOGGED_IN }),
    Storage.get({ key: USERNAME }),
    Storage.get({ key: USERID }),
    Storage.get({ key: GIFTID }),
    Storage.get({ key: GROUPID }),
    Storage.get({ key: NEED_TO_RELOAD })]);
  const isLoggedin = await response[0].value === 'true';
  const username = await response[1].value || undefined;
  const userId = await response[2].value || undefined;
  const giftId = await response[3].value || undefined;
  const groupId = await response[4].value || undefined;
  const reload = response[5].value === 'true';
  const data = {
    isLoggedin,
    username,
    userId,
    giftId,
    groupId,
    reload
  }
  return data;
}

export const setIsLoggedInData = async (isLoggedIn: boolean) => {
  await Storage.set({ key: HAS_LOGGED_IN, value: JSON.stringify(isLoggedIn) });
}

export const setUsernameData = async (username?: string) => {
  if (!username) {
    await Storage.remove({ key: USERNAME });
  } else {
    await Storage.set({ key: USERNAME, value: username });
  }
}

export const setUserIdData = async (userId?: string) => {
  if (!userId) {
    await Storage.remove({ key: USERID });
  } else {
    await Storage.set({ key: USERID, value: userId });
  }
}

export const setGiftIdData = async (giftId?: string) => {
  if (!giftId) {
    await Storage.remove({ key: GIFTID });
  } else {
    await Storage.set({ key: GIFTID, value: giftId });
  }
}

export const setGroupIdData = async (groupId?: string) => {
  if (!groupId) {
    await Storage.remove({ key: GROUPID });
  } else {
    await Storage.set({ key: GROUPID, value: groupId });
  }
}

export const setReloadData = async (reload: boolean) => {
  await Storage.set({ key: NEED_TO_RELOAD, value: JSON.stringify(reload) });
}



