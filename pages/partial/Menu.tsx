import React, { useEffect, useRef } from "react";
import themeColor from "../../components/colors";
import { logOut, setMenuView, setUser } from "../../store/action";
import { StyleSheet, View, Animated } from "react-native";
import { Divider, Text, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { InitialState } from "../../store/reducer";
interface Props {
  state: InitialState;
  setUser: any;
  setMenuView: any;
}
function Menu({ state, setUser, setMenuView }: Props) {
  const db = state.firebase.firestore();
  const auth = state.firebase.auth();
  let animatedValue = useRef(new Animated.Value(0)).current;
  const interPolateColor = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });
  const transformMenu = (e) => {
    Animated.timing(animatedValue, {
      toValue: e,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };
  const logoutPress = () => {
    auth.signOut();
    setUser(false);
  };
  useEffect(() => {
    if (state.menuView) {
      transformMenu(0);
    } else {
      transformMenu(100);
    }
  }, [state]);
  return (
    <Animated.View
      style={{
        paddingTop: 42,
        top: 0,
        zIndex: 1,
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: "white",
        left: interPolateColor,
      }}
    >
      <View style={styles.header}>
        <Text style={{ fontSize: 20, bottom: -5, color: themeColor(6) }}>
          메뉴
        </Text>
        <View style={styles.navButton}>
          <FontAwesome.Button
            color="black"
            onPress={() => {
              setMenuView(false);
            }}
            size={22}
            name="chevron-right"
          />
        </View>
      </View>
      <View style={styles.container}>
        <View></View>
        <LinearGradient
          colors={[themeColor(1, 0.7), themeColor(1)]}
          start={[0, 0]}
          end={[1, 1]}
          style={[styles.infobox]}
        >
          <View style={[styles.boxRow]}>
            <Text style={[styles.infoText, styles.span]}>
              <Icon name="user" size={16} /> {state.user.email}
            </Text>
            <Button
              onPress={logoutPress}
              containerStyle={{
                width: 100,
                height: 30,
                backgroundColor: "none",
              }}
              buttonStyle={{ height: 300 }}
            >
              <Text>
                <Icon name="cog" size={16} /> 설정
              </Text>
            </Button>
          </View>
          <Divider
            style={{
              backgroundColor: "rgba(255,255,255,.7)",
              marginHorizontal: 10,
              marginVertical: 10,
            }}
          ></Divider>
          <View style={styles.boxRow}>
            <Text style={[styles.span]}>이용가능 금액</Text>
            <Text style={[styles.span, { marginLeft: "auto" }]}>12,392 ₩</Text>
          </View>
          <View style={styles.boxRow}>
            <Text style={[styles.span]}>전체 잔고</Text>
            <Text style={[styles.span, { marginLeft: "auto" }]}>16,000 ₩</Text>
          </View>
          <Divider
            style={{
              backgroundColor: "rgba(255,255,255,.7)",
              marginHorizontal: 10,
              marginVertical: 10,
            }}
          ></Divider>
          <View style={[styles.boxRow]}>
            <FontAwesome.Button
              style={{
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "white",
                marginHorizontal: "auto",
              }}
              color={"white"}
              size={14}
              name="share"
            >
              <Text style={styles.span}>송금</Text>
            </FontAwesome.Button>
            <FontAwesome.Button
              style={{
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "white",
                marginLeft: "auto",
              }}
              color={"white"}
              size={14}
              name="money"
            >
              <Text style={styles.span}>출금</Text>
            </FontAwesome.Button>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  span: {
    color: "white",
    textShadowColor: "rgba(0,0,0,.5)",
    textShadowRadius: 1,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "center",
    zIndex: 1,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.84,
    elevation: 1,
  },
  boxRow: {
    padding: 10,
    paddingVertical: 5,
    flexDirection: "row",
  },
  infobox: {
    width: "100%",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "white",
  },
  infoText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  titles: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
  },
  Button: {
    right: 15,
    width: 30,
    height: 30,
    display: "flex",
    backgroundColor: "white",
    top: 50,
    position: "absolute",
  },
  navButton: {
    marginLeft: "auto",
    padding: 0,
    right: -10,
    justifyContent: "center",
  },
  container: {
    padding: 10,
    height: "100%",
    alignItems: "center",
  },
});

function mapStateToProps(state) {
  return { state };
}

function mapDispatchToProps(dispatch) {
  return {
    setMenuView(status) {
      dispatch(setMenuView(status));
    },
    logOut() {
      dispatch(logOut());
    },
    setUser(status) {
      dispatch(setUser(status));
    },
  };
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(Menu);
export default AppContainer;
