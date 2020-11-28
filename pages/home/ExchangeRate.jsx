import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, View, Animated } from "react-native";
import { Text } from "react-native-elements";
import { Divider } from "react-native-elements";
import themeColor from "../dashboard/components/colors";
function ExchangeRate() {
  const [JPYRate, SetJPYRate] = useState(0);
  const [KRWRate, SetKRWRate] = useState(0);
  let KRWFromJPY = Math.round((KRWRate / JPYRate) * 1000);
  let JPYFromKRW = Math.round((JPYRate / KRWRate) * 10000);
  useEffect(() => {
    Axios.get("https://api.exchangeratesapi.io/latest").then((res) => {
      SetJPYRate(res.data.rates.JPY);
      SetKRWRate(res.data.rates.KRW);
    });
  });
  return (
    <View
      style={{
        justifyContent: "center",
        backgroundColor: "white",
        minHeight: 120,
        alignItems: "center",
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          현재환율
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Divider
          style={{ backgroundColor: themeColor(1), height: 1.5, width: "30%" }}
        />
        <Divider
          style={{ backgroundColor: themeColor(6), height: 1.5, width: "30%" }}
        />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            borderColor: "#ccc",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              color: themeColor(6, 1),
            }}
          >
            10,000₩
          </Text>
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              color: themeColor(1, 1),
            }}
          >
            {String(JPYFromKRW).toLocaleString()}¥
          </Text>
        </View>
      </View>
    </View>
  );
}

const css = StyleSheet.create({
  title: {
    fontSize: 20,
    marginVertical: 10,
  },
});
export default ExchangeRate;
