import React from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBars,
  faChevronRight,
  faPlane,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Divider } from "react-native-elements";
import themeColor from "../components/colors";
function Requset(props) {
  return (
    <View style={[style.body, { marginTop: 5 }]}>
      <Text style={[style.title, style.inner]}>진행중인 거래</Text>
      <Divider
        style={[
          style.inner,
          {
            height: 1.5,
            width: "100%",
            backgroundColor: themeColor(6, 0.7),
          },
        ]}
      />
      <Text style={[style.inner]}>
        현재진행중인 거래는 없습니다. 새롭게 거래를 시작해보세요!
      </Text>
    </View>
  );
}

const style = StyleSheet.create({
  inner: {
    marginVertical: 5,
  },
  body: {
    backgroundColor: "white",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 15,
  },
  button: {
    backgroundColor: "white",
    borderWidth: 0,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
  },
});
export default Requset;
