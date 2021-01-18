import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View, Animated } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ExchangeRate from "./ExchangeRate";
import RequestInfo from "../dashboard/requestInfo";

import { ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler";
import themeColor from "../../components/colors";
import { connect } from "react-redux";
import * as Trade from "../../firebase/firestore/trades";
import { InitialState, Props } from "../../store/reducer";
import SingleTradeOnList from "./components/SingleTradeOnList";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
interface SearchRequestsProps extends Props {
  setTrades: any;
}
function SearchRequests({ setTrades, state }: SearchRequestsProps) {
  const { firebase } = state;
  const firestore = firebase.firestore();
  const auth = firebase.auth();
  const search = async () => {
    const trades = await firestore
      .collection("trades")
      .withConverter(Trade.Converter)
      .where("catcher", "==", null)
      .get()
      .then((snapshot) => {
        return Promise.all(snapshot.docs.map((doc) => doc.data()));
      });
    const results = trades.filter((trade) => trade.requester_id !== auth.currentUser.uid);
    setTrades(results);
  };
  useEffect(() => {
    search();
  }, []);
  return (
    <View
      style={{
        paddingHorizontal: 10,
        backgroundColor: "white",
        marginVertical: 5,
        paddingVertical: 10,
      }}
    >
      <Text style={{ fontSize: 16, color: themeColor(6) }}>의뢰 검색하기</Text>
      <View
        style={{
          flexDirection: "row",
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 7.5,
          marginTop: 5,
        }}
      >
        <TextInput
          style={{
            paddingVertical: 5,
            paddingHorizontal: 10,
            flex: 1,
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: themeColor(4),
            padding: 5,
            borderRadius: 7.5,
            flexDirection: "row",
          }}
          containerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesomeIcon icon={faSearch} color="white" style={{ marginRight: 5 }} />
          <Text style={{ color: "white" }}>검색</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function TradeResultList({ trades, navigation }: Props) {
  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      {trades.map((trade) => (
        <SingleTradeOnList navigation={navigation} trade={trade} />
      ))}
    </ScrollView>
  );
}

function HomeScreen({ state, navigation }: Props) {
  const [trades, setTrades] = useState([] as Trade.Class[]);
  const searchResult = (trades: Trade.Class[]) => {
    console.log(trades);
    setTrades(trades);
  };
  useEffect(() => {}, []);
  return (
    <View style={{ flex: 1, borderRadius: 10 }}>
      <ExchangeRate />
      <SearchRequests state={state} setTrades={searchResult} />
      <TradeResultList navigation={navigation} trades={trades} />
    </View>
  );
}
const HomeScreenContainer = connect(mapStateToProps)(HomeScreen);

const Stack = createStackNavigator();

function Home({ state }: Props) {
  return (
    <View style={css.home}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreenContainer} />
        <Stack.Screen name="RequestInfo" component={RequestInfo} />
      </Stack.Navigator>
    </View>
  );
}

const css = StyleSheet.create({
  home: { height: "100%" },
});

function mapStateToProps(state: InitialState) {
  return { state };
}

const App = connect(mapStateToProps)(Home);
export default App;
