import React, { useEffect, useState } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBars,
  faChevronRight,
  faPlane,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Divider, Text } from "react-native-elements";
import themeColor from "../components/colors";
import Axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { TextInput } from "react-native-gesture-handler";
import SingleTradeOnList from "../components/SingleTradeOnList";
function Accept({ navigation, acceptableList }) {
  const [questList, setQuestList] = useState(null);
  const getQuestList = () => {
    setQuestList(acceptableList);
    //setQuestList(res.data);
  };

  useEffect(() => {
    getQuestList();
  }, []);
  return (
    <View style={[style.body, { marginTop: 5 }]}>
      <Text style={[style.title, style.inner]}>수락가능한 거래</Text>
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
      <Text style={[style.inner]}>의뢰를 수락하여 판매를 시작해보세요!</Text>
      {questList &&
        questList.map((quest) => (
          <SingleTradeOnList
            trade={quest}
            key={quest.id}
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
