import React from "react";
import { Button, StyleSheet, Text, View, Animated } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ExchangeRate from "./ExchangeRate";
function HomeScreen() {
  return (
    <View>
      <ExchangeRate />
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
