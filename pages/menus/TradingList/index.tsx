import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { StyleSheet, Text, View, Animated } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { InitialState, Props } from "../../../store/reducer";
import * as Trade from "../../../firebase/firestore/trades";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";

class TextSet {
  type: "sell" | "buy";
  title: string;
  constructor(type: "sell" | "buy", title: string) {
    this.type = type;
    this.title = title;
  }
}

function TradingList({ state, route, navigation }: Props) {
  const textSetList = [
    new TextSet("sell", "판매중인 거래"), //
    new TextSet("buy", "구매중인거래"),
  ];
  const textSet =
    route.params.type === "sell" ? textSetList[0] : textSetList[1];
  const [trades, setTrades] = useState([] as Trade.Class[]);
  const firebase = state.firebase;
  const firestore = firebase.firestore();
  const auth = firebase.auth();
  const tradeIds: string[] = route.params.tradeIds;
  const getTrades = async () => {
    setTrades([]);
    const trades = await Promise.all(
      tradeIds.map(async (tradeId) => {
        const trade = await firestore
          .collection("trades")
          .withConverter(Trade.Converter)
          .doc(tradeId)
          .get()
          .then((doc) => doc.data());
        return trade;
      })
    );
    setTrades(trades);
  };
  useEffect(() => {
    getTrades();
  }, []);
  return (
    <ScrollView>
      <View style={style.containter}>
        <Text>{textSet.title}</Text>
        {trades.map((trade) => (
          <View style={style.singleTrade} key={trade.id}>
            <Text>{trade.name}</Text>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Messenger", { tradeId: trade.id })
                }
              >
                <FontAwesomeIcon icon={faCommentDots} size={22} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
const style = StyleSheet.create({
  containter: {
    padding: 10,
    flex: 1,
  },
  singleTrade: {
    padding: 10,
    marginVertical: 5,
    color: "white",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

function mapStateToProps(state: InitialState): Props {
  return { state };
}
const App = connect(mapStateToProps)(TradingList);
export default App;
