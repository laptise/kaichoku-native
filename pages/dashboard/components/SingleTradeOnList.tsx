import React, { useEffect, useState } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Button, Divider, Text } from "react-native-elements";
import * as Trade from "../../../firebase/firestore/trades";
import themeColor from "../../../components/colors";
interface Props {
  trade: Trade.Class;
  onPress: () => void;
}
export default function SingleTradeOnList({ trade, onPress }: Props) {
  return (
    <Button
      buttonStyle={[request.wrapper]}
      onPress={onPress}
      title={
        (
          <View style={request.row}>
            <Text style={request.title}>{trade.name}</Text>
            <View
              style={{
                marginLeft: "auto",
                flexDirection: "row",
                marginTop: 5,
                height: "110%",
              }}
            >
              <View style={request.innerBadge}>
                <Text style={request.smallInner}>{trade.place}</Text>
              </View>
              <View style={[request.innerBadge, { marginLeft: 5 }]}>
                <Text style={request.smallInner}>{trade.fee}¥</Text>
              </View>
            </View>
          </View>
        ) as any
      }
    ></Button>
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
