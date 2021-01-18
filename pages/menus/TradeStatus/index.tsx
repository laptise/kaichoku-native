import React, { Component, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { StyleSheet, Text, View, Image } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { InitialState, Props } from "../../../store/reducer";
import * as Trade from "../../../firebase/firestore/trades";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import TradeProgress from "./TradeProgess";

interface TradeStatusProps extends Props {
  trade: Trade.Class;
  type: string;
}

function TradeStatus({ navigation, route, state }: Props) {
  const type = route.params.type;
  const { firebase } = state;
  const firestore = firebase.firestore();
  const auth = firebase.auth();
  const { tradeId } = route.params;
  const [trade, setTrade] = useState(null as Trade.Class);
  const getTrade = async () => {
    const tradeRef = firestore.collection("trades").doc(tradeId);
    const statusRef = tradeRef.collection("tradeStatus");
    const trade = await tradeRef
      .withConverter(Trade.Converter)
      .get()
      .then((doc) => doc.data());
    const status = await statusRef
      .withConverter(Trade.tradeStatusConverter)
      .get()
      .then((snapshot) =>
        snapshot.docs.map((doc) => {
          return doc.data();
        })
      );
    // trade.tradeStatus = status;
    setTrade(trade);
    return trade;
  };
  useEffect(() => {
    getTrade();
  }, []);
  return (
    <ScrollView style={style.container}>
      {trade && type && (
        <>
          <Header state={state} trade={trade} type={type} />
          <Body state={state} trade={trade} navigation={navigation} type={type} />
        </>
      )}
    </ScrollView>
  );
}

function Header({ trade, type }: TradeStatusProps) {
  const isSell = type === "sell";
  return (
    <View style={[style.paddings, style.header]}>
      <Text style={{ alignSelf: "flex-start" }}>{isSell ? "판매중인 거래" : "구매중인 거래"}</Text>
      <Text style={{ fontSize: 24 }}>{trade.title}</Text>
    </View>
  );
}

function Body({ trade, type, navigation, state }: TradeStatusProps) {
  return (
    <View>
      {trade.images && trade.images.length > 0 && (
        <View style={style.slide}>
          <Image style={{ width: "100%" }} source={{ uri: trade.images[0] }} />
        </View>
      )}
      <Text style={{ marginVertical: 10 }}>진행상황</Text>
      <View style={{ height: 400, borderWidth: 1, borderRadius: 10, paddingVertical: 10 }}>
        <TradeProgress state={state} trade={trade} currnetStep={3} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
        <Text style={{ marginVertical: 10 }}>판매위치</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("MapDetail");
          }}
        >
          <Text>크게 보기</Text>
        </TouchableOpacity>
      </View>
      {trade.placeInfo && (
        <View style={{ height: 200, borderWidth: 1, borderRadius: 10 }}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={style.map}
            onLongPress={(e) => console.log(e.nativeEvent.coordinate)}
            showsMyLocationButton={true}
            showsCompass={true}
            followsUserLocation={true}
            showsUserLocation={true}
          />
        </View>
      )}
      <View style={{ height: 200, borderWidth: 1, borderRadius: 10 }}></View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  paddings: {
    padding: 10,
  },
  header: {
    alignItems: "center",
  },
  slide: {
    padding: 10,
    width: "100%",
    aspectRatio: 1,
  },
});

function mapStateToProps(state: InitialState): Props {
  return { state };
}

const App = connect(mapStateToProps)(TradeStatus);
export default App;
