import React, { createRef, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import firebase from "../../firebase";
import { Props } from "../../store/reducer";
import { User, UserConverter } from "../../models/firestore";
import { table, LabelInput } from "../../style";
import themeColor from "../dashboard/components/colors";
import countries, { Country } from "../../data/countries";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";

function Singup({ navigation, state }: Props) {
  const auth = state.firebase.auth();
  const db = state.firebase.firestore();
  const [email, setEmail] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [password, setPassword] = useState(null);
  const [countryNameInput, setCountryNameInput] = useState(null as string);
  const [country, setCountry] = useState(null as Country);
  const form = {
    email,
    nickname,
    country,
    password,
  };
  const register = () => {
    auth
      .createUserWithEmailAndPassword(form.email, form.password)
      .catch(console.log)
      .then((res: firebase.auth.UserCredential) => {
        const user = res.user;
        return db
          .collection("users")
          .withConverter(UserConverter)
          .doc(user.uid)
          .set(
            new User(
              null,
              form.country.code,
              user.email,
              new Date(),
              form.nickname
            )
          );
      })
      .then(() => {
        return true;
      });
  };
  const input = useRef(null);
  const [focused, setFocused] = useState(false);

  return (
    <ScrollView>
      <View style={{ flex: 1, alignItems: "center", padding: 20 }}>
        <LabelInput
          title="이메일주소"
          state={[email, setEmail]}
          textContentType="emailAddress"
        />
        <LabelInput title="닉네임" state={[nickname, setNickname]} />
        <LabelInput
          title="패스워드"
          secureTextEntry={true}
          textContentType="password"
          state={[password, setPassword]}
        />
        <LabelInput
          title="패스워드확인"
          secureTextEntry={true}
          textContentType="password"
          state={[nickname, setNickname]}
        />
        <View style={{ width: "100%", margin: 0, padding: 0 }}>
          <Text style={[table.label]}>국가/지역</Text>
          {country ? (
            <View
              style={[
                table.table,
                table.th,
                {
                  borderColor: focused ? themeColor(4, 0) : "#ccc",
                  borderWidth: 1,
                },
              ]}
            >
              <Button
                containerStyle={{
                  backgroundColor: "white",
                  maxHeight: 20,
                }}
                buttonStyle={{ backgroundColor: "white", padding: 0 }}
                titleStyle={{
                  color: "black",
                  alignSelf: "center",
                }}
                onPress={() => setCountry(null)}
                icon={<Icon name="times" size={16} />}
                title={country.name}
                iconRight
              ></Button>
            </View>
          ) : (
            <View
              style={[
                table.table,
                table.th,
                {
                  borderColor: focused ? themeColor(4, 0) : "#ccc",
                  borderWidth: 1,
                },
              ]}
            >
              <TextInput
                onFocus={() => setFocused(true)}
                autoCapitalize="none"
                onChangeText={(val) => setCountryNameInput(val)}
                placeholder="국적이 아닌 현재 거주중인 국가를 선택해주세요"
                spellCheck={false}
              />
            </View>
          )}
          {focused && !country && (
            <ScrollView style={modal.container}>
              {countries
                .filter((country) => {
                  if (countryNameInput) {
                    if (
                      country.name
                        .toLowerCase()
                        .match(countryNameInput.toLowerCase())
                    )
                      return true;
                  } else return true;
                })
                .map((item) => (
                  <Button
                    key={item.code}
                    style={{ paddingVertical: 5 }}
                    onPress={() => setCountry(item)}
                    title={item.name}
                  />
                ))}
            </ScrollView>
          )}
        </View>
        {form.country && form.email && form.nickname && form.password && (
          <Button
            onPress={() => register()}
            style={{ zIndex: 0 }}
            title="hello"
          ></Button>
        )}
      </View>
    </ScrollView>
  );
}

const modal = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 10,
    top: 70,
    left: 0,
    backgroundColor: "white",
    width: "100%",
    borderRadius: 10,
    padding: 10,
  },
});

function mapStateToProps(state) {
  return { state };
}

const SingupContainer = connect(mapStateToProps)(Singup);

export default SingupContainer;
