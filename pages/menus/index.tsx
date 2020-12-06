import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, View, Animated, RefreshControl } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Menu from "./Index";
import Tradings from "./TradingList";
import Messenger from "./Messenger";

const Stack = createStackNavigator();
function tradesIndex({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName="Menu"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen
          name="sellTradings"
          component={Tradings}
          initialParams={{ type: "sell" }}
        />
        <Stack.Screen
          name="purchaseTradings"
          component={Tradings}
          initialParams={{ type: "purchase" }}
        />
        <Stack.Screen name="Messenger" component={Messenger} />
      </Stack.Navigator>
    </View>
  );
}
export default tradesIndex;
