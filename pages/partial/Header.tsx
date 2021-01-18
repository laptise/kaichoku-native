import React, { useEffect, useState } from "react";
import { postLogin, setMenuView, setRequested, setCatched } from "../../store/action";
import { Button, StyleSheet, Text, View, Animated } from "react-native";
import { connect } from "react-redux";
import { InitialState, Props } from "../../store/reducer";
import themeColor from "../../components/colors";
import * as Trade from "../../firebase/firestore/trades";

function Header({ state, setMenuView, setCatched, setRequested }: Props) {
  const firebase = state.firebase;
  const firestore = firebase.firestore();
  const auth = firebase.auth();
  const [user, setUser] = useState(false);

  useEffect(() => {
    state.firebase
      .firestore()
      .collection("trades")
      .where("catcher", ">", "")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.update({ "steps.1": { at: new Date(2020, 7, 7) } });
        });
      });
    state.firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setUser(false);
      } else {
        setUser(true);
      }
    });
    const tradesRef = firestore.collection("trades");
    const catchedRequestRefs = tradesRef.where("catcher", "==", auth.currentUser.uid);
    catchedRequestRefs.onSnapshot((snapshot) => {
      const trades = snapshot.docs.map((doc) => doc.data() as Trade.Class);
      setCatched(trades);
    });
    const requestedRefs = tradesRef.where("requester_id", "==", auth.currentUser.uid);
    requestedRefs.onSnapshot((snapshot) => {
      const trades = snapshot.docs.map((doc) => doc.data() as Trade.Class);
      setRequested(trades);
    });
    return () => {
      catchedRequestRefs.onSnapshot(() => {});
      requestedRefs.onSnapshot(() => {});
    };
  }, []);
  return (
    <View style={styles.header}>
      <Text style={styles.text}>
        <Text style={{ color: themeColor(1), ...styles.text }}>직접하는 </Text>
        <Text style={{ color: "white", ...styles.text }}>해외직구,</Text>
        <Text> 해직</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    zIndex: 1,
    shadowColor: "#000",
    paddingBottom: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.84,
    elevation: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  navButton: {
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
  },
  text: {
    paddingLeft: 10,
    flex: 8,
    fontSize: 20,
    textShadowColor: "rgba(255,255,255,0.7)",
    textShadowOffset: { height: 0, width: 0 },
    textShadowRadius: 1,
  },
});

function mapStateToProps(state) {
  return { state };
}

function mapDispatchToProps(dispatch) {
  return {
    setMenuView(status) {
      dispatch(setMenuView(status));
    },
    setRequested(trades) {
      dispatch(setRequested(trades));
    },
    setCatched(trades) {
      dispatch(setCatched(trades));
    },
  };
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(Header);
export default AppContainer;
