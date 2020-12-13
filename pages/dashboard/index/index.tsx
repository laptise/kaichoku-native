import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, View, Animated, RefreshControl } from "react-native";
import { connect } from "react-redux";
import themeColor from "../../../components/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-native-elements";
import { InitialState, Props } from "../../../store/reducer";
import { ScrollView } from "react-native-gesture-handler";
import TradeList from "./TradeList";
import * as Trade from "../../../firebase/firestore/trades";

function TradesMain({ navigation, state }: Props) {
  const [AcceptableList, setAcceptableList] = useState([] as Trade.Class[]);
  const [catchedList, setCatchedList] = useState([] as Trade.Class[]);
  const [TradingsList, setTradingsList] = useState([] as Trade.Class[]);
  const [RequestingList, setRequestingList] = useState([] as Trade.Class[]);
  const [refreshing, setRefreshing] = useState(false);
  const auth = state.firebase && state.firebase.auth();
  const db = state.firebase.firestore();
  const load = async () => {
    setRequestingList([]);
    setCatchedList([]);
    setAcceptableList([]);
    const currentUser = auth.currentUser;
    const allRequests = await db
      .collection("trades")
      .withConverter(Trade.Converter)
      .get()
      .then((res) => res.docs.map((item) => item.data()))
      .then((arr) => {
        return arr;
      });
    const myRequest = allRequests.filter(
      (item) => !item.catcher && item.requester_id === currentUser.uid
    );
    const catchedRequest = allRequests.filter(
      (item) =>
        item.catcher &&
        (item.catcher === currentUser.uid ||
          item.requester_id === currentUser.uid)
    );
    const acceptableList = allRequests.filter(
      (item) => !item.catcher && item.requester_id !== currentUser.uid
    );
    setRequestingList(myRequest);
    setCatchedList(catchedRequest);
    setAcceptableList(acceptableList);
  };
  useEffect(() => {
    load();
  }, []);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    return load().then(() => setRefreshing(false));
  }, []);
  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ flex: 1 }}>
          {catchedList.length > 0 && (
            <TradeList
              title="진행중인 거래"
              navigation={navigation}
              trades={catchedList}
              tradeType="catched"
              statusMessage={[
                "수락된 거래가 없습니다!",
                "거래가 진행중입니다. 틈틈히 확인해주세요!",
              ]}
              themeColor={"black"}
            />
          )}
          {RequestingList.length > 0 && (
            <TradeList
              title="의뢰중인 거래"
              navigation={navigation}
              trades={RequestingList}
              tradeType="requesting"
              statusMessage={[
                "아직 의뢰중인 거래는 없습니다! ",
                "의뢰중인 거래입니다. 누군가 의뢰를 받아줄때까지 잠시만 기다려주세요.",
              ]}
              themeColor={"black"}
            />
          )}
          {AcceptableList.length > 0 && (
            <TradeList
              title="수락가능한 거래"
              navigation={navigation}
              trades={AcceptableList}
              tradeType="acceptable"
              statusMessage={[
                "현재 수락가능한 거래가 없습니다. 나중에 다시 확인해주세요.",
                "수락가능한 거래입니다. 거래를 수락해염",
              ]}
              themeColor={themeColor(7, 0.7)}
            />
          )}
        </View>
      </ScrollView>
      <Button
        icon={<FontAwesomeIcon size={30} icon={faPlus} color={themeColor(1)} />}
        raised
        containerStyle={{
          position: "absolute",
          bottom: 30,
          left: 30,
          borderRadius: "100%" as any,
        }}
        onPress={() => navigation.navigate("NewRequest")}
        type="outline"
        buttonStyle={{
          borderRadius: "100%" as any,
          height: 65,
          width: 65,
          borderColor: "rgba(0,0,0,0)",
        }}
      />
    </>
  );
}

function mapStateToProps(state: InitialState) {
  return { state };
}

const TradesMainContainer = connect(mapStateToProps)(TradesMain);
const css = StyleSheet.create({
  home: { height: "100%", position: "relative" },
  addNewButton: {
    position: "relative",
    zIndex: 100,
    top: 110,
    left: 1,
    right: 0,
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
  title: {
    fontSize: 20,
  },
});

export default TradesMainContainer;
