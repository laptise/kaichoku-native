import React, { createRef, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "react-native-elements";
import { setToken, setUser, setMenuView, setUid } from "../store/action";
import { connect } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import firebase from "../firebase";
import { Props } from "../store/reducer";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { User, UserConverter } from "../models/firestore";
import { table, LabelInput } from "../style";
import themeColor from "../colors";
import countries, { Country } from "../data/countries";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";

const Stack = createStackNavigator();

function LoginApp({
  state,
  navigation,
  route,
  setToken,
  setMenuView,
  setUser,
}: Props) {
  const emailLabel = useRef(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  interface OnView {
    email: "flex" | "none";
    password: "flex" | "none";
  }
  const onView: OnView = {
    email: email ? "flex" : "none",
    password: password ? "flex" : "none",
  };
  const submit = () => {
    if (!email || !password) {
      Alert.alert("로그인 실패", "이메일과 패스워드는 필수입력 항목입니다!");
      return false;
    }
    state.firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => res.user as firebase.User)
      .then((user) => {
        return (state.firebase as typeof firebase)
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get()
          .then((res) => res.data())
          .then((res) => {
            const user = new User(
              res.comment,
              res.countryCode,
              res.email,
              res.entryDate.toDate(),
              res.nickname
            );
            setUser(user);
          });
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
  };
  useEffect(() => {
    setMenuView(true);
    setMenuView(false);
  }, []);

  return (
    <View style={styles.body}>
      <View style={styles.safeArea}>
        <View style={styles.main}>
          <Text style={styles.title}>로그인</Text>
          <View style={styles.input}>
            <Text
              ref={emailLabel}
              style={{ display: onView.email, fontWeight: "bold" }}
            >
              메일주소
            </Text>
            <TextInput
              placeholder="메일주소"
              autoCapitalize="none"
              spellCheck={false}
              onChangeText={(value) => setEmail(value)}
              style={{ width: 100, position: "absolute", top: 23 }}
            />
          </View>
          <View style={styles.input}>
            <Text
              ref={emailLabel}
              style={{ display: onView.password, fontWeight: "bold" }}
            >
              패스워드
            </Text>
            <TextInput
              placeholder="패스워드"
              secureTextEntry={true}
              textContentType="password"
              spellCheck={false}
              onChangeText={(value) => setPassword(value)}
              style={{ width: 100, position: "absolute", top: 23 }}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <FontAwesome.Button
              style={[
                styles.submit,
                {
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                },
              ]}
              color="rgba(0,0,0,.8)"
              size={24}
              onPress={() => submit()}
              name="sign-in"
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "rgba(0,0,0,.8)",
                }}
              >
                로그인
              </Text>
            </FontAwesome.Button>
            <View style={{ width: 5 }} />
            <FontAwesome.Button
              style={[
                styles.submit,
                {
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                },
              ]}
              color="rgba(0,0,0,.8)"
              size={24}
              onPress={() => navigation.navigate("Signup")}
              name="user-plus"
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "rgba(0,0,0,.8)",
                }}
              >
                회원가입
              </Text>
            </FontAwesome.Button>
          </View>
        </View>
      </View>
    </View>
  );
}
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
function Blocker(props) {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={SingupContainer} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  submit: {
    backgroundColor: "white",
    color: "black",
  },
  input: {
    width: 300,
    display: "flex",
    minHeight: 50,
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderTopColor: "#fff",
    borderLeftColor: "#fff",
    borderRightColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 20,
  },
  main: {
    padding: 20,
    alignItems: "center",
    height: 400,
  },
  body: {
    width: "100%",
    height: "100%",
    zIndex: 100,
    backgroundColor: "white",
  },
  safeArea: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

function mapStateToProps(state) {
  return { state };
}

function mapDispatchToProps(dispatch) {
  return {
    setToken(status) {
      dispatch(setToken(status));
    },
    setUser(user: User) {
      dispatch(setUser(user));
    },
    setMenuView(v: boolean) {
      dispatch(setMenuView(v));
    },
    setUid(uid) {
      dispatch(setUid(uid));
    },
  };
}

const Login = connect(mapStateToProps, mapDispatchToProps)(LoginApp);
const SingupContainer = connect(mapStateToProps, mapDispatchToProps)(Singup);

export default Blocker;
