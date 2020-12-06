import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, View, Animated } from "react-native";
import { Text } from "react-native-elements";
import { Divider } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import themeColor from "../../components/colors";
function ExchangeRate() {
  const [JPYRate, SetJPYRate] = useState(0);
  const [KRWRate, SetKRWRate] = useState(0);
  const refreshRate = useRef();
  const [timeStamp, setTimeStamp] = useState(null as Date);
  let KRWFromJPY = Math.round((KRWRate / JPYRate) * 1000);
  let JPYFromKRW = Math.round((JPYRate / KRWRate) * 10000);
  const getExchangeRate = async () => {
    await Axios.get("https://api.exchangeratesapi.io/latest")
      .then((res) => {
        SetJPYRate(res.data.rates.JPY);
        SetKRWRate(res.data.rates.KRW);
      })
      .then(() => setTimeStamp(new Date()));
  };
  useEffect(() => {
    getExchangeRate();
  }, []);
  return (
    <View
      style={{
        justifyContent: "center",
        backgroundColor: "white",
        minHeight: 140,
        alignItems: "center",
      }}
    >
      {timeStamp && (
        <>
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
                marginTop: 10,
              }}
            >
              현재환율
            </Text>
            <TouchableOpacity
              onPress={() =>
                new Date().valueOf() - timeStamp.valueOf() > 5000 &&
                getExchangeRate()
              }
            >
              <View
                style={{
                  marginTop: 5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 12, textAlign: "center", marginRight: 5 }}
                >
                  {timeStamp.getFullYear()}년{timeStamp.getMonth() + 1}월
                  {timeStamp.getDate()}일 {timeStamp.getHours()}시
                  {timeStamp.getMinutes()}분 취득
                </Text>
                {new Date().valueOf() - timeStamp.valueOf() > 5000 && (
                  <FontAwesomeIcon size={10} icon={faSyncAlt} />
                )}
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Divider
              style={{
                backgroundColor: themeColor(1),
                height: 1.5,
                width: "30%",
              }}
            />
            <Divider
              style={{
                backgroundColor: themeColor(6),
                height: 1.5,
                width: "30%",
              }}
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
        </>
      )}
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
