import React, { useEffect, useState } from "react";
import { postLogin, setMenuView, setRequested, setCatched } from "../../store/action";
import { Button, StyleSheet, Text, View, Animated } from "react-native";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { FontAwesome } from "@expo/vector-icons";
import { InitialState, Props } from "../../store/reducer";
import { faBars, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import themeColor from "../../components/colors";
import * as Trade from "../../firebase/firestore/trades";

function Header({ state, setMenuView, setCatched, setRequested }: Props) {
  const firebase = state.firebase;
  const firestore = firebase.firestore();
  const auth = firebase.auth();
  const [user, setUser] = useState(false);

  useEffect(() => {
    // state.firebase
    //   .firestore()
    //   .collection("trades")
    //   .where("catcher", ">", "")
    //   .get()
    //   .then((snapshot) => {
    //     snapshot.forEach((doc) => {
    //       doc.ref
    //         .collection("tradeStatus")
    //         .doc("catched")
    //         .set({ at: new Date(2020, 11, 9), action: "catched" });
    //     });
    //   });
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
        <Text style={{ color: themeColor(1) }}>직접하는 </Text>
        <Text style={{ color: themeColor(6) }}>해외직구,</Text>
        <Text> 해직</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    zIndex: 1,
    backgroundColor: "white",
    height: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.84,
    elevation: 1,
    flexDirection: "row",
    alignItems: "center",
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
