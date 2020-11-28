import * as firebase from "firebase";

export interface InitialState {
  uid: string;
  price: number;
  token: string;
  user: firebase.User;
  menuView: boolean;
  dbh: any;
  firebase: typeof firebase;
}
const initialState: InitialState = {
  uid: null,
  price: 0,
  token: "",
  user: null,
  menuView: false,
  dbh: null,
  firebase: null,
};

export interface Props {
  navigation?: any;
  state?: InitialState;
  route?: any;
  setToken?: Function;
  setMenuView?: Function;
  setUser?: Function;
  setFirebase?: Function;
  setUid?: Function;
  postLogin?: Function;
}

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_FIREBASE":
      return Object.assign({}, state, { firebase: action.firebase });
    case "SET_UID":
      return Object.assign({}, state, { uid: action.uid });
    case "SET_DBH":
      return Object.assign({}, state, { dbh: action.dbh });
    case "POST_LOGIN":
      return Object.assign({}, state, { token: action.token });
    case "SET_TOKEN":
      return Object.assign({}, state, { token: action.token });
    case "SET_USER":
      return Object.assign({}, state, { user: action.userInfo });
    case "LOG_OUT":
      return Object.assign({}, state, {
        user: { email: null, nickName: null },
        token: null,
      });
    case "SET_MENU_VIEW":
      return Object.assign({}, state, { menuView: action.status });
    default:
      return state;
  }
}
