import React, { useEffect, useState } from "react";
import { createStore } from "redux";
import { StatusBar } from "expo-status-bar";
import { connect, Provider } from "react-redux";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { setMenuView, setDbh, setFirebase, setUser } from "./store/action";
import reducer, { Props } from "./store/reducer";
import Menu from "./partial/Menu";
import Header from "./partial/Header";
import Blocker from "./pages/Login";
import Setting from "./pages/menus/Menu";
import Home from "./pages/home/Home";
import { InitialState, NavigationContainer } from "@react-navigation/native";
import TradeIndex from "./pages/dashboard/Dashboard";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHome,
  faEllipsisH,
  faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";
import { createStackNavigator } from "@react-navigation/stack";
import firebase from "./firebase";
const store = createStore(reducer);
const Tab = createBottomTabNavigator();
function App({ state, setFirebase }: Props) {
  useEffect(() => {
    setFirebase(firebase);
  }, []);
  return (
    <>
      <NavigationContainer>
        {state.user ? (
          <>
            <Header />
            <Menu />
            <Tab.Navigator
              initialRouteName="메뉴"
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  switch (route.name) {
                    case "홈":
                      iconName = focused ? faHome : faHome;
                      break;
                    case "대시보드":
                      iconName = focused ? faExchangeAlt : faExchangeAlt;
                      break;
                    case "메뉴":
                      iconName = focused ? faEllipsisH : faEllipsisH;
                      break;
                  }
                  return <FontAwesomeIcon size={24} icon={iconName} />;
                },
              })}
              tabBarOptions={{
                activeTintColor: "tomato",
                inactiveTintColor: "gray",
              }}
            >
              <Tab.Screen name="대시보드" component={TradeIndex} />
              <Tab.Screen name="홈" component={Home} />
              <Tab.Screen name="메뉴" component={Setting} />
            </Tab.Navigator>
          </>
        ) : (
          <Blocker />
        )}
      </NavigationContainer>
    </>
  );
}
function mapStateToProps(state: InitialState) {
  return { state };
}

function mapDispatchToProps(dispatch) {
  return {
    setMenuView(status) {
      dispatch(setMenuView(status));
    },
    setDbh(dbh) {
      dispatch(setDbh(dbh));
    },
    setFirebase(firebase) {
      dispatch(setFirebase(firebase));
    },
    setUser(stat) {
      dispatch(setUser(stat));
    },
  };
}
console.log(process.env.NODE_ENV);
const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

function AppProvider() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <Provider store={store}>
        <AppContainer />
      </Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
    width: "100%",
  },
});

export default AppProvider;
