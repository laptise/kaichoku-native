import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, View, Animated, RefreshControl } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import AddNewRequest from "./newRequest";
import RequestInfo from "./requestInfo";
import UserInfo from "./userInfo";
import Index from "./main/index";

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
        <Stack.Screen name="Home" component={Index} />
        <Stack.Screen name="NewRequest" component={AddNewRequest} />
        <Stack.Screen name="RequestInfo" component={RequestInfo} />
        <Stack.Screen name="UserInfo" component={UserInfo} />
      </Stack.Navigator>
    </View>
  );
}
export default tradesIndex;
