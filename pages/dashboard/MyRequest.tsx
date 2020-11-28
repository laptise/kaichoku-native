import React, { useEffect, useState } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBars,
  faChevronRight,
  faPlane,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Divider, Text } from "react-native-elements";
import themeColor from "../../colors";

import { LinearGradient } from "expo-linear-gradient";
import { TextInput } from "react-native-gesture-handler";
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
        questList.map((quest) => (
          <Button
            key={quest.id}
            buttonStyle={[request.wrapper]}
            onPress={() => navigation.navigate("RequestInfo", { id: quest.id })}
            title={
              (
                <View style={request.row}>
                  <Text style={request.title}>{quest.name}</Text>
                  <View
                    style={{
                      marginLeft: "auto",
                      flexDirection: "row",
                      marginTop: 5,
                      height: "110%",
                    }}
                  >
                    <View style={request.innerBadge}>
                      <Text style={request.smallInner}>{quest.place}</Text>
                    </View>
                    <View style={[request.innerBadge, { marginLeft: 5 }]}>
                      <Text style={request.smallInner}>{quest.fee}¥</Text>
                    </View>
                  </View>
                </View>
              ) as any
            }
          ></Button>
        ))}
    </View>
  );
}

const request = StyleSheet.create({
  innerBadge: {
    backgroundColor: "white",
    borderRadius: 5,
  },
  wrapper: {
    alignItems: "center",
    width: "100%",
    height: 40,
    justifyContent: "center",
    backgroundColor: "#efa169",
    borderRadius: 7.5,
    marginVertical: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  body: {
    borderRadius: 10,
    padding: 5,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  innerBagde: {
    backgroundColor: "red",
    borderRadius: 5,
  },
  smallInner: {
    fontSize: 13,
    flexDirection: "column",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 3,
    color: themeColor(1, 0.8),
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    color: "white",
    alignItems: "center",
    padding: 5,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: {
      height: 0,
      width: 0,
    },
    textShadowRadius: 1,
  },
});

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
