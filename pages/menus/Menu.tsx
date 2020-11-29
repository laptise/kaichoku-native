import React from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import themeColor from "../../components/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-native-elements";

function Menu() {
  return (
    <View style={style.wrapper}>
      <View style={style.row}>
        <Button
          containerStyle={[
            style.box,
            { backgroundColor: "rgba(255,255,255,1)" },
          ]}
          buttonStyle={style.boxButton}
          title="22"
        />
        <View style={style.box}>
          <Text>da</Text>
        </View>
        <View style={style.box}>
          <Text>da</Text>
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
  box: {
    flex: 1,
    padding: 0,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  boxButton: {
    width: "100%",
    backgroundColor: "rgba(0,0,0,0)",
    color: "black",
    height: "100%",
  },
});
export default Menu;
