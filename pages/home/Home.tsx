import React from "react";
import { Button, StyleSheet, Text, View, Animated } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ExchangeRate from "./ExchangeRate";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import themeColor from "../../components/colors";

function SearchRequests() {
  return (
    <View style={{ padding: 20, backgroundColor: "white", marginVertical: 5 }}>
      <Text style={{ fontSize: 18 }}>의뢰 검색하기</Text>
      <View style={{ flexDirection: "row", borderColor: "#ccc", borderWidth: 1, borderRadius: 15 }}>
        <TextInput
          style={{
            padding: 10,
            flex: 1,
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: themeColor(3),
            padding: 10,
            borderRadius: 15,
          }}
          containerStyle={{ alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: "white" }}>SEARCH</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function HomeScreen() {
  return (
    <View>
      <ExchangeRate />
      <SearchRequests />
    </View>
  );
}

const Stack = createStackNavigator();

function Home() {
  return (
    <View style={css.home}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </View>
  );
}

const css = StyleSheet.create({
  home: { height: "100%" },
});
export default Home;
