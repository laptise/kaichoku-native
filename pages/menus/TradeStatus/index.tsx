import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { StyleSheet, Text, View, Animated } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { InitialState, Props } from "../../../store/reducer";
import * as Trade from "../../../firebase/firestore/trades";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { faCommentDots, faInfo } from "@fortawesome/free-solid-svg-icons";

function Header({ trade }: { trade: Trade.Class }) {
  return (
    <View style={style.paddings}>
      <Text style={{ fontSize: 18 }}>{trade.title}</Text>
    </View>
  );
}

function TradeStatus({ navigation, route, state }: Props) {
  console.log(route.params.type);
  const { firebase } = state;
  const firestore = firebase.firestore();
  const auth = firebase.auth();
  const { tradeId } = route.params;
  const [trade, setTrade] = useState(null as Trade.Class);
  const getTrade = async () => {
    const trade = await firestore
      .collection("trades")
      .doc(tradeId)
      .withConverter(Trade.Converter)
      .get()
      .then((doc) => doc.data());
    setTrade(trade);
    return trade;
  };
  useEffect(() => {
    getTrade();
  }, []);
  return (
    <View style={style.container}>
      <Header trade={trade} />
    </View>
  );
}

function mapStateToProps(state: InitialState): Props {
  return { state };
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  paddings: {
    padding: 10,
  },
});

const App = connect(mapStateToProps)(TradeStatus);
export default App;
