import React, { useEffect, useState } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBars,
  faChevronRight,
  faPlane,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Divider, Text } from "react-native-elements";
import themeColor from "../../../components/colors";
import { LinearGradient } from "expo-linear-gradient";
import { TextInput } from "react-native-gesture-handler";
import SingleTradeOnList from "../components/SingleTradeOnList";
import * as Trade from "../../../firebase/firestore/trades";
function Accept({ navigation, acceptableList }) {
  const [questList, setQuestList] = useState(null);
  const getQuestList = () => {
    setQuestList(acceptableList);
    console.log(questList);
    //setQuestList(res.data);
  };
  useEffect(() => {
    getQuestList();
  }, []);
  return (
    <View style={[style.body, { marginTop: 5 }]}>
      <Text style={[style.title, style.inner]}>의뢰중인 거래</Text>
      <Divider
        style={[
          style.inner,
          {
            height: 1.5,
            width: "80%",
            backgroundColor: themeColor(1, 0.7),
          },
        ]}
      />
      <Text style={[style.inner]}>아직 의뢰중인 거래가 없습니다!</Text>

      {questList &&
        questList.map((quest: Trade.Class) => (
          <SingleTradeOnList
            key={quest.id}
            trade={quest}
            onPress={() => navigation.navigate("RequestInfo", { id: quest.id })}
          />
        ))}
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
export default Accept;
