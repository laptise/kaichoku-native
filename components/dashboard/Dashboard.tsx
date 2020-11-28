import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, View, Animated, RefreshControl } from "react-native";
import { connect } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import themeColor from "../../colors";
import Accepttable from "./Accepttable";
import MyRequest from "./MyRequest";
import Requset from "./Request";
import AddNewRequest from "../trades/AddNewRequest";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import RequestInfo from "../trades/RequestInfo";
import { Button } from "react-native-elements";
import UserInfo from "../trades/UserInfo";
import { InitialState, Props } from "../../store/reducer";
import { ScrollView } from "react-native-gesture-handler";
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
function TradesMain({ navigation, state }: Props) {
  const [AcceptableList, setAcceptableList] = useState([]);
  const [TradingsList, setTradingsList] = useState([]);
  const [RequestingList, setRequestingList] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  const auth = state.firebase && state.firebase.auth();
  const db = state.firebase.firestore();

  const load = async () => {
    setAcceptableList([]);
    setTradingsList([]);
    return db
      .collection("trades")
      .get()
      .then((res) =>
        res.docs.map((item) => {
          const result = item.data();
          result.id = item.id;
          result.created_at = result.created_at.toDate();
          return result;
        })
      )
      .then((arr) => {
        const myList = arr.filter(
          (item) => item["requester_id"] === auth.currentUser.uid
        );
        const others = arr.filter(
          (item) => item["requester_id"] !== auth.currentUser.uid
        );
        setAcceptableList(others);
        setRequestingList(myList);
        return AcceptableList;
      });
  };
  useEffect(() => {
    db.collection("trades").onSnapshot(() => load());
    load();
  }, []);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    return load().then(() => setRefreshing(false));
  }, []);
  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ flex: 1 }}>
          <Requset />
          {RequestingList.length > 0 && (
            <MyRequest
              navigation={navigation}
              acceptableList={RequestingList}
            />
          )}
          {AcceptableList.length > 0 && (
            <Accepttable
              navigation={navigation}
              acceptableList={AcceptableList}
            />
          )}
        </View>
      </ScrollView>
      <Button
        icon={<FontAwesomeIcon size={30} icon={faPlus} color={themeColor(1)} />}
        raised
        containerStyle={{
          position: "absolute",
          bottom: 30,
          left: 30,
          borderRadius: "100%" as any,
        }}
        onPress={() => navigation.navigate("NewRequest")}
        type="outline"
        buttonStyle={{
          borderRadius: "100%" as any,
          height: 65,
          width: 65,
          borderColor: "rgba(0,0,0,0)",
        }}
      />
    </>
  );
}

const Stack = createStackNavigator();

function tradesIndex({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={TradesMainContainer} />
        <Stack.Screen name="NewRequest" component={AddNewRequest} />
        <Stack.Screen name="RequestInfo" component={RequestInfo} />
        <Stack.Screen name="UserInfo" component={UserInfo} />
      </Stack.Navigator>
    </View>
  );
}

function mapStateToProps(state: InitialState) {
  return { state };
}

function mapDispatchToProps(dispatch) {
  return {};
}

const TradesMainContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TradesMain);
const css = StyleSheet.create({
  home: { height: "100%", position: "relative" },
  addNewButton: {
    position: "relative",
    zIndex: 100,
    top: 110,
    left: 1,
    right: 0,
  },
});

const style = StyleSheet.create({
  inner: {
    marginVertical: 5,
  },
  body: {
    backgroundColor: "white",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 15,
  },
  title: {
    fontSize: 20,
  },
});
export default tradesIndex;