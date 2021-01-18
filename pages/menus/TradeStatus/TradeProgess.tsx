import React, { Component, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import * as Trade from "../../../firebase/firestore/trades";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import themeColor from "../../../components/colors";
import GoodsPurchase from "./ProgressUpdate/GoodsPurchase";
import GoodsSent from "./ProgressUpdate/GoodsSent";
import { InitialState } from "../../../store/reducer";

export interface ModalProps {
  viewState: [boolean, React.Dispatch<boolean>];
  action?: any;
  state?: InitialState;
  trade: Trade.Class;
  viewMode: boolean;
}
function TradeProgress({
  trade,
  state,
}: {
  currnetStep: number;
  trade: Trade.Class;
  state: InitialState;
}) {
  const [goodsPurchaseView, setGoodsPurchaseView] = useState(false);
  const [goodsSentView, setGoodsSentView] = useState(false);
  useEffect(() => {
    console.log(trade.steps[2]);
  }, []);
  const dataset = (index: number) => {
    return {
      status: trade.steps[index],
      index,
      current: trade.steps.length + 1,
    };
  };
  return (
    <ScrollView>
      {
        <GoodsPurchase
          trade={trade}
          state={state}
          viewState={[goodsPurchaseView, setGoodsPurchaseView]}
          viewMode={trade.steps.length >= 2}
        />
      }
      {
        <GoodsSent
          trade={trade}
          state={state}
          viewState={[goodsSentView, setGoodsSentView]}
          viewMode={trade.steps.length >= 3}
        />
      }

      {trade?.steps[0] && <Progress name={"의뢰 등록"} data={dataset(0)} />}
      {trade?.steps[0] && <Progress name={"의뢰 수락"} data={dataset(1)} />}
      {trade?.steps[1] && (
        <Progress name={"물품 구매"} data={dataset(2)}>
          <TouchableOpacity onPress={() => setGoodsPurchaseView(true)}>
            <View style={{ backgroundColor: themeColor(5), padding: 5, borderRadius: 10 }}>
              <Text style={{ color: "white" }}>
                {trade?.steps.length >= 2 ? "구매정보확인" : "등록"}
              </Text>
            </View>
          </TouchableOpacity>
        </Progress>
      )}
      {trade?.steps[2] && (
        <Progress name={"물품 발송"} data={dataset(3)}>
          <TouchableOpacity onPress={() => setGoodsSentView(true)}>
            <View style={{ backgroundColor: themeColor(5), padding: 5, borderRadius: 10 }}>
              <Text style={{ color: "white" }}>
                {trade?.steps.length >= 3 ? "발송정보확인" : "발송등록"}
              </Text>
            </View>
          </TouchableOpacity>
        </Progress>
      )}
      {trade?.steps[3] && <Progress name={"물품 도착/확인"} data={dataset(4)} />}
    </ScrollView>
  );
}

function Progress({
  children,
  name,
  data,
}: {
  children?: JSX.Element;
  name: string;
  data: {
    status: Trade.Step;
    index: number;
    current: number;
  };
  current?: number;
  RegisterButton?: JSX.Element;
}) {
  const { index } = data;
  const { status } = data;
  const { current } = data;
  const style = StyleSheet.create({
    proress: {
      width: 150,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      position: "relative",
    },
    dotPlate: {
      width: 20,
      height: 20,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: "black",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    dot: {
      width: 10,
      height: 10,
      backgroundColor: "black",
      borderRadius: 20,
    },
    bar: {
      width: 7,
      height: 60,
      borderWidth: 1,
      borderTopWidth: 0,
      borderBottomWidth: 0,
    },
    rightBar: {
      width: 5,
      height: 60,
      backgroundColor: "green",
    },
    description: {
      position: "absolute",
      top: 0,
      flexDirection: "row",
      marginLeft: "auto",
      width: 200,
      left: 120,
    },
  });
  const isCurrent = index === current;
  const [view, setView] = useState(false);
  useEffect(() => setView(true), []);
  return (
    <>
      <View style={style.proress}>
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          {index !== 0 && <View style={[style.bar]} />}
          <View style={style.dotPlate}>
            {status && <View style={[style.dot, { backgroundColor: "gray" }]}></View>}
            {isCurrent && <View style={[style.dot, { backgroundColor: "red" }]}></View>}
            {view && (
              <View style={style.description}>
                <View style={{ flex: 1 }}>
                  {status?.at && (
                    <>
                      <Text>{`${status.at.getFullYear()}년${status.at.getMonth()}월${status.at.getDate()}일`}</Text>
                      <Text>{`${status.at.getHours()}시${status.at.getMinutes()}분${status.at.getSeconds()}초`}</Text>
                    </>
                  )}
                </View>
                {children && <View style={{ flex: 1 }}>{children}</View>}
              </View>
            )}
          </View>
          <View style={[style.bar]} />
        </View>
        <Text style={{ marginLeft: 10, alignSelf: index === 0 ? "flex-start" : "center" }}>
          {name}
        </Text>
      </View>
    </>
  );
}

export default TradeProgress;
