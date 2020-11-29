// ActionCreator

import * as User from "../firebase/firestore/users";

export const SET_FIREBASE = "SET_FIREBASE";
export const setFirebase = (firebase) => {
  return {
    type: SET_FIREBASE,
    firebase,
  };
};

export const SET_MENU_VIEW = "SET_MENU_VIEW";
export const setMenuView = (status: Boolean) => {
  return {
    type: SET_MENU_VIEW,
    status,
  };
};

export const POST_LOGIN = "POST_LOGIN";
export const postLogin = (token: string) => {
  return {
    type: POST_LOGIN,
    token,
  };
};

export const SET_UID = "SET_UID";
export const setUid = (uid: string) => {
  return {
    type: SET_UID,
    uid,
  };
};

export const SET_TOKEN = "SET_TOKEN";
export const setToken = (token: string) => {
  return {
    type: SET_TOKEN,
    token,
  };
};

export const LOG_OUT = "LOG_OUT";
export const logOut = () => {
  return {
    type: LOG_OUT,
  };
};

export const SET_USER = "SET_USER";
export const setUser = (userInfo: User.Class) => {
  return {
    type: SET_USER,
    userInfo,
  };
};

export const SET_DBH = "DBH";
export const setDbh = (dbh) => {
  return {
    type: SET_DBH,
    dbh,
  };
};
