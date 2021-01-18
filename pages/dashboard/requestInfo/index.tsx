import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Image, RefreshControl, ActivityIndicator } from "react-native";
import { Divider, Button } from "react-native-elements";
import { connect } from "react-redux";
import themeColor from "../../../components/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import MaskedView from "@react-native-community/masked-view";
import Swiper from "react-native-swiper";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { ScrollView } from "react-native-gesture-handler";
import { InitialState, Props } from "../../../store/reducer";
import * as Trade from "../../../firebase/firestore/trades";
import * as User from "../../../firebase/firestore/users";
import RequesterInfoArea from "./components/RequesterInfoArea";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";

function RequestInfo({ route, navigation, state }: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = route.params;
  const questType: "acceptable" | "requesting" | "catched" = route.params && route.params.type;
  const [result, setResult] = useState(null as Trade.Class);
  const [requester, setRequester] = useState(null as User.Class);
  const dbh = state.firebase.firestore();
  const markerRef = useRef(null);
  const catchRequest = async () => {
    const userId = state.firebase.auth().currentUser.uid;
    const docRef = dbh.collection("trades").doc(id);
    await docRef.update({ catcher: userId });
    console.log("done");
  };
  const getResult = async () => {
    const TradeData = await dbh
      .collection("trades")
      .doc(id)
      .withConverter(Trade.Converter)
      .get()
      .then((doc) => doc.data());
    const UserData = await dbh
      .collection("users")
      .doc(TradeData.requester_id)
      .withConverter(User.Converter)
      .get()
      .then((userDoc) => userDoc.data());
    setRequester(UserData);
    setResult(TradeData);
  };
  useEffect(() => {
    getResult();
  }, []);
  if (!result)
    return (
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
        refreshControl={<RefreshControl style={{ alignSelf: "center" }} refreshing={true} />}
      />
    );
  else
    return (
      <ScrollView contentContainerStyle={{ justifyContent: "flex-start" }}>
        <View style={style.wrapper}>
          <View style={style.info}>
            <View style={{ padding: 10, backgroundColor: "white", borderRadius: 5 }}>
              <Text>
                {result.created_at.getFullYear() +
                  "년" +
                  result.created_at.getMonth() +
                  "월" +
                  result.created_at.getDate() +
                  "일"}
              </Text>
            </View>
            <Text style={[style.title, { marginVertical: 15 }]}>{result.title}</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>상품명</Text>
            <Divider
              style={{
                backgroundColor: "black",
                height: 1,
                width: "30%",
                marginVertical: 10,
              }}
            />
            <View style={[style.target, { marginBottom: 30 }]}>
              <Text style={[style.title]}>{result.name}</Text>
            </View>

            {result.images && result.images.length > 0 && (
              <>
                <Text
                  style={{
                    alignSelf: "flex-start",
                    fontWeight: "bold",
                    fontSize: 16,
                    marginLeft: 10,
                  }}
                >
                  사진
                </Text>
                <Text>{loading}</Text>
                <Swiper style={style.slider} showsButtons={false} showsPagination={false}>
                  {result.images.map((url, index) => (
                    <View style={{ position: "relative" }} key={index}>
                      <Image
                        onLoadStart={() => setLoading(true)}
                        onLoadEnd={() => setLoading(false)}
                        key={index}
                        style={{ width: "100%", height: "100%" }}
                        source={{ uri: url }}
                      />
                      {loading && (
                        <ActivityIndicator
                          size="large"
                          style={{
                            position: "absolute",
                            alignSelf: "center",
                            top: "48%",
                          }}
                        />
                      )}
                    </View>
                  ))}
                </Swiper>
              </>
            )}
            <Text
              style={{
                alignSelf: "flex-start",
                fontWeight: "bold",
                fontSize: 16,
                marginLeft: 10,
                marginTop: 10,
              }}
            >
              상품정보
            </Text>
            <View style={style.table}>
              <View style={style.tr}>
                <View style={style.th}>
                  <Text>카테고리</Text>
                </View>
                <View style={style.td}>
                  <Text>의류-상의-외투</Text>
                </View>
              </View>
              <View style={style.tr}>
                <View style={style.th}>
                  <Text>상품명</Text>
                </View>
                <View style={style.td}>
                  <Text>{result.name}</Text>
                </View>
              </View>
              <View style={style.tr}>
                <View style={style.th}>
                  <Text>브랜드</Text>
                </View>
                <View style={style.td}>
                  <Text>유니클로</Text>
                </View>
              </View>
              <View style={style.tr}>
                <View style={style.th}>
                  <Text>정가</Text>
                </View>
                <View style={style.td}>
                  <Text>{result.price.toLocaleString()}</Text>
                </View>
              </View>
            </View>

            <Text
              style={{
                alignSelf: "flex-start",
                fontWeight: "bold",
                fontSize: 16,
                marginLeft: 10,
                marginBottom: 10,
              }}
            >
              의뢰내용
            </Text>
            {result.placeInfo && (
              <>
                {/* <Text
                  style={{
                    alignSelf: "flex-start",
                    fontWeight: "bold",
                    fontSize: 16,
                    marginLeft: 10,
                  }}
                >
                  구매처 정보
                </Text> */}
                <MapView
                  onRegionChangeComplete={() =>
                    markerRef && markerRef.current && markerRef.current.showCallout()
                  }
                  provider={PROVIDER_GOOGLE}
                  region={{
                    ...result.placeInfo.location,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  style={{
                    width: "100%",
                    aspectRatio: 1,
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 10,
                  }}
                >
                  <Marker coordinate={result.placeInfo.location} ref={markerRef}>
                    <Callout
                      style={{ padding: 5, borderRadius: 10, maxWidth: "80%", minHeight: 60 }}
                    >
                      <Text style={{ fontWeight: "bold" }}>{result.placeInfo.name}</Text>
                      <Text style={{ fontSize: 13 }}>{result.placeInfo.address}</Text>
                    </Callout>
                  </Marker>
                </MapView>
              </>
            )}
            <View style={style.table}>
              <View style={style.tr}>
                <View style={style.th}>
                  <Text>구매장소</Text>
                </View>
                <View style={style.td}>
                  <Text>{result.placeInfo ? result.placeInfo.name : result.place}</Text>
                </View>
              </View>
              <View style={style.tr}>
                <View style={style.th}>
                  <Text>URL</Text>
                </View>
                <View style={style.td}>
                  <Text>https://google.com</Text>
                </View>
              </View>
              <View style={style.tr}>
                <View style={style.th}>
                  <Text>비고/특이사항</Text>
                </View>
                <View style={style.td}>
                  <Text>선착순</Text>
                </View>
              </View>
              <View style={style.tr}>
                <View style={style.th}>
                  <Text>수수료</Text>
                </View>
                <View style={style.td}>
                  <Text>{result.fee.toLocaleString()}</Text>
                </View>
              </View>
            </View>
            <Text
              style={{
                alignSelf: "flex-start",
                fontWeight: "bold",
                fontSize: 16,
                marginLeft: 10,
              }}
            >
              의뢰자정보
            </Text>
            <RequesterInfoArea
              action={() => {
                navigation.navigate("UserInfo", {
                  uid: requester.uid,
                });
              }}
              navigation={navigation}
              user={requester}
            />
            <Text
              style={{
                alignSelf: "flex-start",
                fontWeight: "bold",
                fontSize: 16,
                marginLeft: 10,
              }}
            >
              의뢰자의 말
            </Text>
            <View
              style={{
                margin: 10,
                borderRadius: 5,
                backgroundColor: "white",
                padding: 10,
                width: "100%",
              }}
            >
              <Text>제발사다주세요 ㅇㅁㅇㅁㅇㅁ</Text>
            </View>
            {questType === "acceptable" && (
              <Button
                raised
                onPress={catchRequest}
                containerStyle={{ marginVertical: 20 }}
                buttonStyle={{ backgroundColor: themeColor(1, 0.8) }}
                title="의뢰 받기"
              />
            )}
            {questType === "requesting" && (
              <Button
                raised
                onPress={catchRequest}
                containerStyle={{ marginVertical: 20 }}
                buttonStyle={{ backgroundColor: themeColor(1, 0.8) }}
                title="의뢰 관리"
              />
            )}
          </View>
        </View>
      </ScrollView>
    );
}

function ItemInfo(props) {
  return (
    <View style={[style.tr]}>
      <View style={[style.th, { flexDirection: "row" }]}>
        <FontAwesomeIcon icon={props.icon} style={{ marginRight: 5 }} />
        <Text>{props.title}</Text>
      </View>
      <View style={style.td}>
        <Text style={{ fontSize: 16 }}>{props.content}</Text>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  radiusShadow: {
    padding: 5,
    borderRadius: 15,
  },
  info: {
    borderRadius: 10,
    paddingHorizontal: 20,
    width: "100%",
    alignItems: "center",
  },
  wrapper: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  target: {
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
  },
  table: {
    margin: 10,
    borderRadius: 5,
    backgroundColor: "white",
    width: "100%",
  },
  th: {
    padding: 10,
  },
  td: {
    padding: 10,
    marginLeft: "auto",
  },
  tr: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  container: {
    padding: 20,
    alignItems: "center",
  },
  content: {
    fontSize: 24,
    marginVertical: 5,
    fontWeight: "bold",
  },
  slider: {
    height: 300,
    marginVertical: 10,
  },
  slide1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB",
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97CAE5",
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#92BBD9",
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
});

function mapStateToProps(state: InitialState) {
  return { state };
}

const AppContainer = connect(mapStateToProps)(RequestInfo);
export default AppContainer;
