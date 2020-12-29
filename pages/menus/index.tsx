import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, View, Animated, RefreshControl } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Menu from "./Index";
import Tradings from "./TradingList";
import Messenger from "./Messenger";
import Wallet from "./Wallet";
import Setting from "./Setting";
import TradeStatus from "./TradeStatus";
import EditProfile from "./EditProfile";
import Notice from "./Notice";
import Contact from "./Contact";
import Information from "./Information";
import MapDetail from "./TradeStatus/MapDetail";
import themeColor from "../../components/colors";

const Stack = createStackNavigator();
function tradesIndex({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName="Menu"
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: themeColor(1),
          },
          headerBackTitleStyle: { color: "white" },
        }}
      >
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="sellTradings" component={Tradings} initialParams={{ type: "sell" }} />
        <Stack.Screen
          name="purchaseTradings"
          component={Tradings}
          initialParams={{ type: "purchase" }}
        />
        <Stack.Screen name="Messenger" component={Messenger} />
        <Stack.Screen name="TradeStatus" component={TradeStatus} />
        <Stack.Screen name="Wallet" component={Wallet} />
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Notice" component={Notice} />
        <Stack.Screen name="Contact" component={Contact} />
        <Stack.Screen name="Information" component={Information} />
        <Stack.Screen name="MapDetail" component={MapDetail} />
      </Stack.Navigator>
    </View>
  );
}
export default tradesIndex;
