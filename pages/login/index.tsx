import React, { createRef, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { setToken, setUser, setMenuView, setUid } from "../../store/action";
import { connect } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import firebase from "../../firebase";
import { InitialState, Props } from "../../store/reducer";
import { createStackNavigator } from "@react-navigation/stack";
import * as User from "../../firebase/firestore/users";
import Signup from "./Signup";
import { Dispatch } from "redux";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  faSign,
  faSignInAlt,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const Stack = createStackNavigator();

function LoginApp({ state, navigation, setMenuView, setUser }: Props) {
  const emailLabel = useRef(null);
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
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
  const submit = async () => {
    if (!email || !password) {
      Alert.alert("로그인 실패", "이메일과 패스워드는 필수입력 항목입니다!");
      return false;
    }
    const userCredential = await state.firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    const userData = await state.firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .withConverter(User.Converter)
      .get()
      .then((res) => res.data());
    setUser(userData);
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
          <View
            style={styles.input}
            onTouchStart={() => emailInput.current.focus()}
          >
            <Text
              ref={emailLabel}
              style={{ display: onView.email, fontWeight: "bold" }}
            >
              메일주소
            </Text>
            <TextInput
              placeholder="메일주소"
              ref={emailInput}
              autoCapitalize="none"
              spellCheck={false}
              onChangeText={(value) => setEmail(value)}
              style={{ width: "100%", position: "absolute", top: 23 }}
            />
          </View>
          <View
            style={styles.input}
            onTouchStart={() => passwordInput.current.focus()}
          >
            <Text
              ref={emailLabel}
              style={{ display: onView.password, fontWeight: "bold" }}
            >
              패스워드
            </Text>
            <TextInput
              ref={passwordInput}
              placeholder="패스워드"
              secureTextEntry={true}
              textContentType="password"
              spellCheck={false}
              onChangeText={(value) => setPassword(value)}
              style={{ width: "100%", position: "absolute", top: 23 }}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() =>
                submit().catch((err) => {
                  Alert.alert("err", String(err));
                })
              }
              containerStyle={{ justifyContent: "center" }}
            >
              <View
                style={[
                  { flexDirection: "row" },
                  styles.submit,
                  {
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 5,
                    padding: 10,
                    alignItems: "center",
                  },
                ]}
              >
                <FontAwesomeIcon size={20} icon={faSignInAlt}></FontAwesomeIcon>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "rgba(0,0,0,.8)",
                    alignSelf: "center",
                  }}
                >
                  {" "}
                  로그인
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{ width: 5 }} />
            <TouchableOpacity
              onPress={() => navigation.navigate("Signup")}
              containerStyle={{ justifyContent: "center" }}
            >
              <View
                style={[
                  { flexDirection: "row" },
                  styles.submit,
                  {
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 5,
                    padding: 10,
                    alignItems: "center",
                  },
                ]}
              >
                <FontAwesomeIcon size={20} icon={faUserPlus}></FontAwesomeIcon>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "rgba(0,0,0,.8)",
                    alignSelf: "center",
                  }}
                >
                  {" "}
                  회원가입
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

function Blocker(props) {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
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

function mapStateToProps(state: InitialState): Props {
  return { state };
}

function mapDispatchToProps(dispatch: Dispatch): Props {
  return {
    setToken(status) {
      dispatch(setToken(status));
    },
    setUser(user) {
      dispatch(setUser(user));
    },
    setMenuView(v) {
      dispatch(setMenuView(v));
    },
    setUid(uid) {
      dispatch(setUid(uid));
    },
  };
}

const Login = connect(mapStateToProps, mapDispatchToProps)(LoginApp);

export default Blocker;
