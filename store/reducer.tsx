import * as firebase from "firebase";
import { act } from "react-dom/test-utils";
import { Class as User } from "../firebase/firestore/users";
import { Class as Trade } from "../firebase/firestore/trades";
import { TrackHTMLAttributes } from "react";
interface UnreadMessages {
  purchasing: number;
  selling: number;
}
export interface InitialState {
  uid: string;
  price: number;
  token: string;
  user: firebase.User;
  menuView: boolean;
  dbh: any;
  firebase: typeof firebase;
  catchedTrades: Trade[];
  requestedTrades: Trade[];
  catcherUnread: number;
  requesterUnread: number;
}
const initialState: InitialState = {
  uid: null,
  price: 0,
  token: "",
  user: null,
  menuView: false,
  dbh: null,
  firebase: null,
  catchedTrades: [],
  requestedTrades: [],
  catcherUnread: 0,
  requesterUnread: 0,
};

export interface Props {
  navigation?: any;
  trades?: Trade[];
  trade?: Trade;
  state?: InitialState;
  route?: any;
  user?: User;
  setToken?: (token: string) => void;
  setMenuView?: (boolean: boolean) => void;
  setUser?: (user: User) => void;
  setFirebase?: (firebase) => void;
  setUid?: (uid: string) => void;
  postLogin?: (token: string) => void;
  setDbh?: (db: typeof firebase.firestore) => void;
  setRequested?: (trades: Trade[]) => void;
  setCatched?: (trades: Trade[]) => void;
}

function getUnreadMessageCount(trades: Trade[], entry: string) {
  return trades.reduce((acc, trade) => acc + trade[entry], 0);
}

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_FIREBASE":
      return Object.assign({}, state, { firebase: action.firebase });
    case "SET_CATCHED":
      return Object.assign({}, state, {
        catchedTrades: action.trades,
        catcherUnread: getUnreadMessageCount(action.trades, "catcherUnread"),
      });
    case "SET_REQUESTED":
      return Object.assign({}, state, {
        requestedTrades: action.trades,
        requesterUnread: getUnreadMessageCount(action.trades, "requesterUnread"),
      });
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
