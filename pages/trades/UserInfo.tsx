import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import themeColor from "../../colors";
import Accept from "../dashboard/Accepttable";
import Requset from "../dashboard/Request";
import AddNewRequest from "./AddNewRequest";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import RequestInfo from "./RequestInfo";
import { Button } from "react-native-elements";
import countries, { Country } from "../../data/countries";
import { TIMESTAMPToJsDate } from "../../functions";
import MaskedView from "@react-native-community/masked-view";
import { InitialState, Props } from "../../store/reducer";
class User {
  uid: number;
  nation: Country;
  comment: string;
  entryDate: Date;
  nickname: string;
  constructor(data) {
    this.uid = data.uid;
    this.nation = countries.find((country) => country.code === data.country_no);
    this.comment = data.comment;
    this.nickname = data.nickname;
    this.entryDate = data.entryDate;
  }
}
function UserInfo({ route, navigation, state }: Props) {
  //route.params.id
  const [user, setUser] = useState(null as User);
  useEffect(() => {
    state.firebase
      .firestore()
      .collection("users")
      .doc(route.params.uid)
      .get()
      .then((res) => res.data())
      .then((res) => {
        res.uid = route.params.uid;
        res.entryDate = res.entryDate.toDate();
        return res;
      })
      .then((res) =>
        state.firebase
          .firestore()
          .collection("countries")
          .doc(`${res.countryCode}`)
          .get()
          .then((countryRes) => {
            res.nation = countryRes.data().name;
            return res;
          })
      )
      .then((res) => {
        setUser(res as any);
        return user;
      });
  }, []);
  if (user)
    return (
      <View style={style.container}>
        <MaskedView
          style={{
            height: 100,
            width: 100,
          }}
          maskElement={
            <View
              style={{
                borderRadius: 100,
                backgroundColor: "gray",
                height: "100%",
                width: "100%",
              }}
            ></View>
          }
        >
          {/* Shows behind the mask, you can put anything here, such as an image */}
          <Image
            style={{ height: "100%", width: "100%" }}
            source={{
              uri: "https://reactnative.dev/img/tiny_logo.png",
            }}
          />
        </MaskedView>
        <View
          style={{
            alignItems: "center",
            backgroundColor: "white",
            marginVertical: 20,
            padding: 10,
            paddingTop: 0,
            borderRadius: 10,
          }}
        >
          <Text style={[style.content]}>{user.nickname} 🇲🇽</Text>
          <Text>
            {user.entryDate.getFullYear()}년 {user.entryDate.getMonth() + 1}월{" "}
            {user.entryDate.getDate()}일부터 이용함
          </Text>
          <Text>NATION : {user.nation}</Text>
        </View>
        <Text
          style={{
            alignSelf: "flex-start",
            fontWeight: "bold",
            fontSize: 16,
            marginLeft: 10,
          }}
        >
          자기소개
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
          <Text>{user.comment}</Text>
        </View>
        <Text
          style={{
            alignSelf: "flex-start",
            fontWeight: "bold",
            fontSize: 16,
            marginLeft: 10,
          }}
        >
          거래정보
        </Text>
        <View
          style={{
            margin: 10,
            borderRadius: 5,
            backgroundColor: "white",
            width: "100%",
          }}
        >
          <View style={[style.tr]}>
            <View style={[style.th]}>
              <Text>거래건수</Text>
            </View>
            <View style={[style.td]}>
              <Text>102건</Text>
            </View>
          </View>
          <View style={[style.tr, { borderBottomWidth: 0 }]}>
            <View style={[style.th]}>
              <Text>평점</Text>
            </View>
            <View style={[style.td]}>
              <Text>★★★★☆</Text>
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
          거래후기
        </Text>
        <View
          style={{
            margin: 10,
            borderRadius: 5,
            backgroundColor: "white",
            width: "100%",
          }}
        >
          <View style={[style.tr]}>
            <View style={[style.th]}>
              <Text>거래건수</Text>
            </View>
            <View style={[style.td]}>
              <Text>102건</Text>
            </View>
          </View>
          <View style={[style.tr, { borderBottomWidth: 0 }]}>
            <View style={[style.th]}>
              <Text>평점</Text>
            </View>
            <View style={[style.td]}>
              <Text>★★★★☆</Text>
            </View>
          </View>
        </View>
      </View>
    );
  else return <View style={style.container}></View>;
}

const style = StyleSheet.create({
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
});

export default UserInfo;
