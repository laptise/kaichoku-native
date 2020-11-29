import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { connect } from "react-redux";
import MaskedView from "@react-native-community/masked-view";
import { InitialState, Props } from "../../../store/reducer";
import * as User from "../../../firebase/firestore/users";
import * as Country from "../../../firebase/firestore/country";
function UserInfo({ route, state }: Props) {
  //route.params.id
  const [user, setUser] = useState(null as User.Class);
  const [country, setCountry] = useState(null as Country.Class);
  useEffect(() => {
    state.firebase
      .firestore()
      .collection("users")
      .doc(route.params.uid)
      .withConverter(User.Converter)
      .get()
      .then((res) => setUser(res.data()))
      .then(() =>
        state.firebase
          .firestore()
          .collection("countries")
          .doc(String(user.countryCode))
          .withConverter(Country.Converter)
          .get()
          .then((res) => setCountry(res.data()))
      );
  }, []);
  if (user && country)
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
          <Text>NATION : {country.name}</Text>
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

function mapStateToProps(state: InitialState) {
  return { state };
}

const AppContainer = connect(mapStateToProps)(UserInfo);

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

export default AppContainer;
