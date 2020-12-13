import { faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

function Wallet() {
  return (
    <View style={style.container}>
      <OverView />
      <TradeHistory />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  textWhite: {
    color: "white",
    fontWeight: "bold",
  },
  area: {
    padding: 20,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "center",
  },
  overviewTools: {
    top: 20,
    right: 20,
    position: "absolute",
    flexDirection: "row",
  },
  overviewSmall: {
    position: "absolute",
    top: 20,
    left: 20,
    fontSize: 14,
  },
  singleTool: {
    marginLeft: 10,
    padding: 7.5,
    marginTop: -7.5,
    borderRadius: 10,
    backgroundColor: "black",
  },
  balance: {
    fontSize: 54,
    width: "100%",
    textAlign: "center",
    fontWeight: "200",
  },
  balanceDetail: {
    bottom: 20,
    left: 20,
    position: "absolute",
    flexDirection: "row",
  },
  detailSingle: {
    flex: 1,
  },
  singleHistory: {
    flexDirection: "row",
    marginBottom: 5,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  singleHistoryText: {
    fontSize: 16,
  },
});

class History {
  amount: number;
  trader: string;
  id: number;
  constructor(id: number, amount: number, trader: string) {
    this.id = id;
    this.amount = amount;
    this.trader = trader;
  }
}
function TradeHistory() {
  const histories: History[] = [
    new History(0, 3000, "KIM"),
    new History(1, -1500, "LEE"),
    new History(2, -1130, "LEE"),
  ];
  return (
    <View
      style={[style.area, { marginTop: 0, height: "auto", paddingTop: 50 }]}
    >
      <Text style={style.overviewSmall}>거래내역</Text>
      {histories.map((history, index) => (
        <View
          key={index}
          style={[
            style.singleHistory,
            {
              borderColor:
                index === histories.length - 1 ? "rgba(0,0,0,0)" : "#ccc",
            },
          ]}
        >
          <Text
            style={[
              style.singleHistoryText,
              { color: history.amount > 0 ? "green" : "red" },
            ]}
          >
            {history.amount > 0 && "+"}
            {history.amount.toLocaleString()}
          </Text>
          <Text style={[style.singleHistoryText, { marginLeft: "auto" }]}>
            {history.trader}
          </Text>
        </View>
      ))}
    </View>
  );
}

function OverView() {
  return (
    <View style={[style.area, { paddingTop: 50, paddingBottom: 70 }]}>
      <Text style={style.overviewSmall}>이용가능잔고</Text>
      <View style={style.overviewTools}>
        <TouchableOpacity
          containerStyle={style.singleTool}
          style={{ flexDirection: "row" }}
        >
          <FontAwesomeIcon style={style.textWhite} icon={faUserSlash} />
          <Text style={[style.textWhite, { marginLeft: 5 }]}>송금</Text>
        </TouchableOpacity>
        <TouchableOpacity
          containerStyle={style.singleTool}
          style={{ flexDirection: "row" }}
        >
          <FontAwesomeIcon style={style.textWhite} icon={faUserSlash} />
          <Text style={[style.textWhite, { marginLeft: 5 }]}>출금</Text>
        </TouchableOpacity>
      </View>
      <Text style={style.balance}>₩ 40,000</Text>
      <View style={style.balanceDetail}>
        <View style={style.detailSingle}>
          <Text style={{ textAlign: "center" }}>거래 완료시</Text>
          <Text style={{ textAlign: "center" }}>+ 4,300 ₩</Text>
        </View>
        <View style={style.detailSingle}>
          <Text style={{ textAlign: "center" }}>출금 대기중</Text>
          <Text style={{ textAlign: "center" }}>0 ₩</Text>
        </View>
      </View>
    </View>
  );
}

export default Wallet;
