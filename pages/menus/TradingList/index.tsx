import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { StyleSheet, Text, View, Animated } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { InitialState, Props } from "../../../store/reducer";
import * as Trade from "../../../firebase/firestore/trades";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { faCommentDots, faInfo } from "@fortawesome/free-solid-svg-icons";

class TextSet {
  type: "sell" | "buy";
  title: string;
  constructor(type: "sell" | "buy", title: string) {
    this.type = type;
    this.title = title;
  }
}
function Badge({ count }) {
  return (
    <View style={style.unreadMessages}>
      <Text
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: 11,
          textAlign: "center",
        }}
      >
        {count}
      </Text>
    </View>
  );
}

function TradingList({ state, route, navigation }: Props) {
  const textSetList = [
    new TextSet("sell", "판매중인 거래"), //
    new TextSet("buy", "구매중인거래"),
  ];
  const textSet = route.params.type === "sell" ? textSetList[0] : textSetList[1];
  const [trades, setTrades] = useState([] as Trade.Class[]);
  const firebase = state.firebase;
  const firestore = firebase.firestore();
  const auth = firebase.auth();
  const tradeIds: string[] = route.params.tradeIds;
  const singleRequestData = async (tradeId: string) => {
    const tradeRef = firestore.collection("trades").withConverter(Trade.Converter).doc(tradeId);
    const trade = await tradeRef.get().then((doc) => doc.data());
    return trade;
  };
  const unreadMessages = route.params.type === "sell" ? "catcherUnread" : "requesterUnread";
  const getTrades = async () => {
    setTrades([]);
    const trades = await Promise.all(
      tradeIds.map(async (tradeId) => {
        const trade = await singleRequestData(tradeId);
        return trade;
      })
    );
    setTrades(trades);
  };
  useEffect(() => {
    const docs = firestore
      .collection("trades")
      .where(firebase.firestore.FieldPath.documentId(), "in", tradeIds)
      .withConverter(Trade.Converter);

    docs.onSnapshot((snapshot) => {
      const trades = snapshot.docs.map((doc) => {
        doc.ref.collection("messages").onSnapshot((snapshot) => {
          return doc.data();
        });
        return doc.data();
      });
      setTrades(trades);
    });
    return function cleanup() {
      docs.onSnapshot(() => {});
    };
  }, []);
  return (
    <ScrollView>
      <View style={style.containter}>
        <Text>{textSet.title}</Text>
        {trades.map((trade) => (
          <View style={style.singleTrade} key={trade.id}>
            <Text>{trade.name}</Text>
            <View style={style.toolbox}>
              <TouchableOpacity
                containerStyle={style.singleTool}
                onPress={() =>
                  navigation.navigate("Messenger", {
                    tradeId: trade.id,
                    type: route.params.type,
                  })
                }
              >
                <FontAwesomeIcon icon={faCommentDots} size={18} />
                {typeof trade[unreadMessages] === "number" && trade[unreadMessages] > 0 ? (
                  <Badge count={trade[unreadMessages]} />
                ) : (
                  true
                )}
              </TouchableOpacity>
              <TouchableOpacity
                containerStyle={style.singleTool}
                onPress={() =>
                  navigation.navigate("TradeStatus", { tradeId: trade.id, type: route.params.type })
                }
              >
                <FontAwesomeIcon icon={faInfo} size={18} />
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
    padding: 20,
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    margin: 20,
  },
  unreadMessages: {
    top: -10,
    right: -15,
    position: "absolute",
    backgroundColor: "red",
    width: 15,
    height: 15,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  toolbox: { flexDirection: "row" },
  singleTool: {
    marginHorizontal: 10,
  },
  singleTrade: {
    padding: 10,
    marginVertical: 5,
    color: "white",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

function mapStateToProps(state: InitialState): Props {
  return { state };
}
const App = connect(mapStateToProps)(TradingList);
export default App;
