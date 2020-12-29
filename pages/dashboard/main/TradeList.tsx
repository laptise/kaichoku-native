import React, { useEffect, useState } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { Button, Divider, Text } from "react-native-elements";
import themeColor from "../../../components/colors";
import SingleTradeOnList from "../components/SingleTradeOnList";
import * as Trade from "../../../firebase/firestore/trades";
import { Props } from "../../../store/reducer";

interface NewProps extends Props {
  trades: Trade.Class[];
  tradeType?: "acceptable" | "requesting" | "catched";
  title: string;
  /**[label when not exist,label when exist]*/
  statusMessage: [string, string];
  themeColor: string;
}
function TradeList({
  navigation,
  trades,
  tradeType,
  title,
  statusMessage,
  themeColor,
}: NewProps) {
  const [questList, setQuestList] = useState([] as Trade.Class[]);
  const getQuestList = () => {
    setQuestList(trades);
    //setQuestList(res.data);
  };
  useEffect(() => {
    getQuestList();
  }, []);
  return (
    <View style={[style.body, { marginTop: 5 }]}>
      <Text style={[style.title, style.inner]}>{title}</Text>
      <Divider
        style={[
          style.inner,
          {
            height: 1.5,
            width: "80%",
            backgroundColor: themeColor,
          },
        ]}
      />
      <Text style={[style.inner]}>
        {trades.length === 0 ? statusMessage[0] : statusMessage[1]}
      </Text>

      {questList &&
        questList.map((quest: Trade.Class) => (
          <SingleTradeOnList
            trade={quest}
            themeColor={themeColor}
            key={quest.id}
            onPress={() =>
              navigation.navigate("RequestInfo", {
                id: quest.id,
                type: tradeType,
              })
            }
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
export default TradeList;
