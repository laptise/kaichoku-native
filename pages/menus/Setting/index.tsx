import {
  faBell,
  faSignOutAlt,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { setUser } from "../../../store/action";
import { InitialState, Props } from "../../../store/reducer";

function Setting({ state, setUser }: Props) {
  const firebase = state.firebase;
  const auth = firebase.auth();
  const logout = () => {
    auth.signOut();
    setUser(null);
  };
  return (
    <View style={style.container}>
      <TouchableOpacity
        containerStyle={style.singleItem}
        style={style.singleItem}
      >
        <View style={style.itemInner}>
          <FontAwesomeIcon icon={faBell} style={{ marginRight: 5 }} />
          <Text style={style.itemText}>알림설정</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={logout}
        containerStyle={[style.singleItem]}
        style={[style.singleItem, { borderBottomColor: "rgba(0,0,0,0)" }]}
      >
        <View style={style.itemInner}>
          <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: 5 }} />
          <Text style={style.itemText}>로그아웃</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  singleItem: {
    borderBottomWidth: 1,
    width: "100%",
    borderBottomColor: "#ccc",
  },
  itemInner: {
    flexDirection: "row",
    padding: 20,
  },
  itemText: {
    fontSize: 16,
  },
});
function mapStateToProps(state: InitialState): Props {
  return { state };
}

function mapDispatchToProps(dispatch) {
  return {
    setUser(status) {
      dispatch(setUser(status));
    },
  };
}

const App = connect(mapStateToProps, mapDispatchToProps)(Setting);
export default App;
