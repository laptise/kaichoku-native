import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  InteractionManager,
  Image,
  Dimensions,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { InitialState, Props } from "../../../store/reducer";
import * as Trade from "../../../firebase/firestore/trades";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { faCommentDots, faInfo } from "@fortawesome/free-solid-svg-icons";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

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
    trade.tradeStatus = status;
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
          <Header trade={trade} type={type} />
          <Body trade={trade} navigation={navigation} type={type} />
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

function Body({ trade, type, navigation }: TradeStatusProps) {
  return (
    <View>
      {trade.images && trade.images.length > 0 && (
        <View style={style.slide}>
          <Image style={{ width: "100%" }} source={{ uri: trade.images[0] }} />
        </View>
      )}
      <Text style={{ marginVertical: 10 }}>진행상황</Text>
      <View style={{ height: 200, borderWidth: 1, borderRadius: 10, paddingVertical: 10 }}>
        <TradeProgress trade={trade} currnetStep={3} />
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

function TradeProgress({ currnetStep, trade }: { currnetStep: number; trade: Trade.Class }) {
  useEffect(() => {}, []);
  const titles = [
    "의뢰 등록",
    "의뢰 수락",
    "물품 구매",
    "물품 발송",
    "물품 출국",
    "물품 통관",
    "국내 발송",
    "국내 도착",
  ];
  return (
    <ScrollView>
      {titles.map((title, index) => (
        <Progress
          key={index}
          name={title}
          status={trade.tradeStatus[index]}
          index={index}
          current={trade.tradeStatus.length}
        />
      ))}
    </ScrollView>
  );
}

function Progress({
  name,
  index,
  current,
  status,
}: {
  name: string;
  index: number;
  status: Trade.TradeStatus;
  current?: number;
}) {
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
      flexDirection: "column",
      width: 100,
      left: 120,
    },
  });
  const past = index < current;
  const isCurrent = index === current;
  const [view, setView] = useState(false);

  return (
    <>
      <View
        style={style.proress}
        onTouchStart={() => setView(true)}
        onTouchEnd={() => setView(false)}
      >
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          {index !== 0 && <View style={[style.bar]} />}
          <View style={style.dotPlate}>
            {status && <View style={[style.dot, { backgroundColor: "gray" }]}></View>}
            {isCurrent && <Animated.View style={[style.dot, { backgroundColor: "red" }]} />}
            {view && (
              <View style={style.description}>
                {status ? (
                  <>
                    <Text>{`${status.at.getFullYear()}년${status.at.getMonth()}월${status.at.getDate()}일`}</Text>
                    <Text>{`${status.at.getHours()}시${status.at.getMinutes()}분${status.at.getSeconds()}초`}</Text>
                  </>
                ) : (
                  <Text>{isCurrent && "아직입니다"}</Text>
                )}
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

function mapStateToProps(state: InitialState): Props {
  return { state };
}

const App = connect(mapStateToProps)(TradeStatus);
export default App;
