import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { StyleSheet, Text, View, Animated, Image } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus, faExchangeAlt, faPen } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Props, InitialState } from "../../store/reducer";
import * as Trade from "../../firebase/firestore/trades";
import * as User from "../../firebase/firestore/users";
import MaskedView from "@react-native-community/masked-view";
import { TouchableOpacity } from "react-native-gesture-handler";

function ProfileZone({ state, navigation }: Props) {
  const [user, setUser] = useState(null as User.Class);
  const currentUser = state.firebase.auth().currentUser;
  const getUser = async () => {
    const user = await state.firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid)
      .withConverter(User.Converter)
      .get()
      .then((doc) => doc.data());
    setUser(user);
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <View style={style.container}>
      {user && (
        <View style={style.box}>
          <View
            style={{
              position: "absolute",
              top: 10,
              right: 15,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <FontAwesomeIcon icon={faPen} size={14} style={{ marginRight: 5 }} />
              <Text>수정</Text>
            </TouchableOpacity>
          </View>
          <MaskedView
            style={{
              height: 60,
              marginHorizontal: 10,
              width: 60,
            }}
            maskElement={
              <View
                style={{
                  borderRadius: 100,
                  backgroundColor: "gray",
                  height: 60,
                  width: 60,
                }}
              ></View>
            }
          >
            <Image
              style={{ height: 60, width: 60 }}
              source={{
                uri: "https://reactnative.dev/img/tiny_logo.png",
              }}
            />
          </MaskedView>
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>{user.nickname}</Text>
            <Text>{user.email}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
const style = StyleSheet.create({
  container: {
    height: 90,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  box: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
  },
});
function mapStateToProps(state: InitialState): Props {
  return { state };
}
const App = connect(mapStateToProps)(ProfileZone);

export default App;
