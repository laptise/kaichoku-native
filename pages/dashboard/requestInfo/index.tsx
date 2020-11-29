import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, RefreshControl } from "react-native";
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
const images = [
  {
    // Simplest usage.
    url: "https://avatars2.githubusercontent.com/u/7970947?v=3&s=460",

    // width: number
    // height: number
    // Optional, if you know the image size, you can set the optimization performance

    // You can pass props to <Image />.
    props: {
      // headers: ...
    },
  },
];
function RequestInfo({ route, navigation, state }: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const { id } = route.params;
  const [result, setResult] = useState(null as Trade.Class);
  const [requester, setRequester] = useState(null as User.Class);
  const dbh = state.firebase.firestore();

  const getResult = async () => {
    return dbh
      .collection("trades")
      .doc(id)
      .withConverter(Trade.Converter)
      .get()
      .then((doc) => doc.data())
      .then((item) => {
        return dbh
          .collection("users")
          .doc(item.requester_id)
          .withConverter(User.Converter)
          .get()
          .then((userDoc) => userDoc.data())
          .then((userData) => {
            setRequester(userData);
            return item;
          });
      })
      .then((item) => {
        setResult(item);
        return result;
      });
  };
  useEffect(() => {
    getResult();
  }, []);
  const catchRequest = function () {};
  if (!result)
    return (
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
        refreshControl={
          <RefreshControl style={{ alignSelf: "center" }} refreshing={true} />
        }
      />
    );
  else
    return (
      <ScrollView>
        <View style={style.wrapper}>
          <View style={style.info}>
            <View
              style={{ padding: 10, backgroundColor: "white", borderRadius: 5 }}
            >
              <Text>
                {result.created_at.getFullYear() +
                  "년" +
                  result.created_at.getMonth() +
                  "월" +
                  result.created_at.getDate() +
                  "일"}
              </Text>
            </View>
            <Text style={[style.title, { marginVertical: 15 }]}>
              {result.title}
            </Text>
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
            <Swiper
              style={style.slider}
              showsButtons={false}
              showsPagination={false}
            >
              <View style={style.slide1}>
                <Text style={style.text}>사진 1</Text>
              </View>
              <View style={style.slide2}>
                <Text style={style.text}>사진 2</Text>
              </View>
              <View style={style.slide3}>
                <Text style={style.text}>사진 3</Text>
              </View>
            </Swiper>
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
                  <Text>7,200</Text>
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
              의뢰내용
            </Text>
            <View style={style.table}>
              <View style={style.tr}>
                <View style={style.th}>
                  <Text>구매장소</Text>
                </View>
                <View style={style.td}>
                  <Text>{result.place}</Text>
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
                  <Text>{result.fee}</Text>
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
              onPress={navigation.navigate("UserInfo", {
                uid: requester.uid,
              })}
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
            <Button
              raised
              containerStyle={{ marginVertical: 20 }}
              buttonStyle={{ backgroundColor: themeColor(1, 0.8) }}
              title="의뢰 받기"
            ></Button>
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
    padding: 20,
    width: "100%",
    alignItems: "center",
  },
  wrapper: {
    height: "100%",
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
