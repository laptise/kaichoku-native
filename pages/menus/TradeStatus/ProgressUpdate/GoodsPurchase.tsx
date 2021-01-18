import React, { Component, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import * as Trade from "../../../../firebase/firestore/trades";
import { ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler";
import themeColor from "../../../../components/colors";
import { InitialState } from "../../../../store/reducer";
import { ModalProps } from "../TradeProgess";

function GoodsPurchase({ viewState, state, trade, viewMode }: ModalProps) {
  console.log(viewMode);
  const [visible, setVisible] = viewState;
  const [purchasedPrice, setPurchasedPrice] = useState(0);
  const [extra, setExtra] = useState("");
  const data = { purchasedPrice, extra };
  const { firebase } = state;
  const firestore = firebase.firestore();
  const docRef = firestore.collection("trades").doc(trade.id);
  const submit = async () => {
    const tradeRef = state.firebase.firestore().collection("trades").doc(trade.id);
    // await tradeRef.update({
    //   steps: {
    //     1: {
    //       at: new Date(),
    //     },
    //     2: {
    //       at: new Date(),
    //     },
    //     3: {
    //       at: new Date(),
    //     },
    //   },
    // });
    await tradeRef.update({ "steps.2": { at: new Date(), price: purchasedPrice } });
    Alert.alert("완료", "구매 등록이 완료되었습니다");
    setVisible(false);
  };
  const value = {
    price: trade?.steps[2] && (trade?.steps[2]["price"] as number),
    extra: trade?.steps[2] && (trade?.steps[2]["extra"] as string),
  };
  return (
    <Modal animationType={"fade"} transparent={true} visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View style={style.container}>
          <View style={style.body}>
            <Text style={{ fontSize: 16, fontWeight: "bold", marginVertical: 10 }}>
              {viewMode ? "물품 구매정보 확인" : "물품 구매완료 등록"}
            </Text>
            <Text style={{ alignSelf: "flex-start", marginVertical: 5, fontWeight: "bold" }}>
              실제 구매금액
            </Text>
            {viewMode ? (
              <Text
                selectable={true}
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  width: "100%",
                  padding: 5,
                  borderRadius: 5,
                }}
                selectionColor="orange"
              >
                {value?.price?.toLocaleString()}
              </Text>
            ) : (
              <TextInput
                onChangeText={(e) => setPurchasedPrice(Number(e))}
                keyboardType="number-pad"
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  width: "100%",
                  padding: 5,
                  borderRadius: 5,
                }}
              />
            )}
            <Text style={{ alignSelf: "flex-start", marginVertical: 5, fontWeight: "bold" }}>
              비고
            </Text>
            {viewMode ? (
              <Text
                selectable={true}
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  width: "100%",
                  padding: 5,
                  borderRadius: 5,
                }}
                selectionColor="orange"
              >
                {value?.extra}
              </Text>
            ) : (
              <TextInput
                onChangeText={(e) => setExtra(e)}
                editable={!viewMode}
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  width: "100%",
                  padding: 5,
                  borderRadius: 5,
                }}
              />
            )}
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <View style={{ backgroundColor: themeColor(3), padding: 5, borderRadius: 5 }}>
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {viewMode ? "확인" : "취소"}
                </Text>
              </View>
            </TouchableOpacity>
            {!viewMode && (
              <TouchableOpacity onPress={submit}>
                <View style={{ backgroundColor: themeColor(3), padding: 5, borderRadius: 5 }}>
                  <Text style={{ color: "white", fontWeight: "bold" }}>확인</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
const style = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    width: "90%",
    height: 200,
  },
  body: {
    flex: 1,
    alignItems: "center",
  },
});

export default GoodsPurchase;
