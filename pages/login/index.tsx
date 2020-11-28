import React, { createRef, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { setToken, setUser, setMenuView, setUid } from "../../store/action";
import { connect } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import firebase from "../../firebase";
import { Props } from "../../store/reducer";
import { createStackNavigator } from "@react-navigation/stack";
import { User, UserConverter } from "../../models/firestore";
import Signup from "./Signup";

const Stack = createStackNavigator();

function LoginApp({ state, navigation, setMenuView, setUser }: Props) {
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

export default Blocker;
