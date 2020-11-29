import React, { useEffect, useState } from "react";
import { postLogin, setMenuView } from "../../store/action";
import { Button, StyleSheet, Text, View, Animated } from "react-native";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { FontAwesome } from "@expo/vector-icons";
import { InitialState, Props } from "../../store/reducer";
import { faBars, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import themeColor from "../../components/colors";
import {
  faHome,
  faEllipsisH,
  faStream,
} from "@fortawesome/free-solid-svg-icons";

function Header({ state, setMenuView }: Props) {
  const buttonStyle = {
    position: "absolute",
    right: 15,
    top: 50,
  };
  const [user, setUser] = useState(false);
  useEffect(() => {
    if (state.menuView) {
      buttonStyle.right = 35;
    } else {
      buttonStyle.right = 15;
    }
    state.firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setUser(false);
      } else {
        setUser(true);
      }
    });
  });

  return (
    <View style={styles.header}>
      <Text style={styles.text}>
        <Text style={{ color: themeColor(1) }}>직접하는 </Text>
        <Text style={{ color: themeColor(6) }}>해외직구,</Text>
        <Text> 해직</Text>
      </Text>
      {!user && (
        <View style={styles.navButton}>
          <FontAwesome.Button
            color="black"
            style={{ backgroundColor: "white" }}
            onPress={() => setMenuView(!state.menuView)}
            size={22}
            name="bars"
          />
        </View>
      )}
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
  };
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(Header);
export default AppContainer;
