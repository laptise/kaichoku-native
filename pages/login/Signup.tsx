import React, { createRef, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import firebase from "../../firebase";
import { Props } from "../../store/reducer";
import * as User from "../../firebase/firestore/users";
import { table, LabelInput } from "../../components/Styles";
import themeColor from "../../components/colors";
import countries, { Country } from "../../data/countries";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";

function Singup({ navigation, state }: Props) {
  const auth = state.firebase.auth();
  const db = state.firebase.firestore();
  const [email, setEmail] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [password, setPassword] = useState(null);
  const [passwordCheck, setPasswordCheck] = useState(null);
  const [countryNameInput, setCountryNameInput] = useState(null as string);
  const [country, setCountry] = useState(null as Country);
  const form = {
    email,
    nickname,
    country,
    password,
  };
  const validation = (target: string, value: string) => {
    console.log(value);
    const pwRegex = RegExp(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i);
    const emailRegex = RegExp(
      /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/
    );
    switch (target) {
      case "email":
        if (!value || !emailRegex.test(value)) return false;
        break;
      case "password":
        if (!value || !pwRegex.test(value)) return false;
        break;
      case "passwordCheck":
        if (!value || !pwRegex.test(value) || password !== passwordCheck)
          return false;
        break;
      case "nickname":
        if (!value || value.length < 3) return false;
    }
    return true;
  };
  const register = () => {
    auth
      .createUserWithEmailAndPassword(form.email, form.password)
      .catch(console.log)
      .then((res: firebase.auth.UserCredential) => {
        const user = res.user;
        return db
          .collection("users")
          .withConverter(User.Converter)
          .doc(user.uid)
          .set(
            new User.Class(
              user.uid,
              user.email,
              form.nickname,
              form.country.code,
              new Date(),
              null
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
          onChangeText={(value) => setEmail(value)}
          textContentType="emailAddress"
          validationMessage={
            !validation("email", email) && "이메일주소 형식을 확인해주세요"
          }
          style={{
            borderColor: validation("email", email) ? themeColor(5) : "#dc3545",
          }}
        />
        <LabelInput
          title="닉네임"
          validationMessage={
            !validation("nickname", nickname) &&
            "닉네임은 3글자 이상이어야합니다"
          }
          style={{
            borderColor: validation("nickname", nickname)
              ? themeColor(5)
              : "#dc3545",
          }}
          onChangeText={(value) => setNickname(value)}
        />
        <LabelInput
          title="패스워드"
          secureTextEntry={true}
          keyboardType="default"
          validationMessage={
            !validation("password", password) &&
            "암호는 영숫자 8문자 이상이어야합니다"
          }
          style={{
            borderColor: validation("password", password)
              ? themeColor(5)
              : "#dc3545",
          }}
          onChangeText={(value) => setPassword(value)}
        />
        <LabelInput
          style={{
            borderColor: validation("passwordCheck", passwordCheck)
              ? themeColor(5)
              : "#dc3545",
          }}
          validationMessage={
            !validation("passwordCheck", passwordCheck) &&
            "암호확인 일치하지 않습니다"
          }
          title="패스워드확인"
          keyboardType="default"
          secureTextEntry={true}
          onChangeText={(value) => setPasswordCheck(value)}
        />
        <View style={{ width: "100%", margin: 0, padding: 0 }}>
          <Text style={[table.label, { alignSelf: "flex-start" }]}>
            국가/지역
          </Text>
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
