import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, RefreshControl } from "react-native";
import themeColor from "../../../../components/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import MaskedView from "@react-native-community/masked-view";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { Props } from "../../../../store/reducer";
interface NewProps extends Props {
  action: () => void;
}
function RequesterInfoArea({ user, action }: NewProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        backgroundColor: "white",
        borderRadius: 5,
        justifyContent: "center",
        marginVertical: 10,
        paddingVertical: 20,
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <MaskedView
          style={{
            height: 60,
            marginHorizontal: 10,
            width: 60,
          }}
          maskElement={
            <View
              style={{
                borderRadius: 100,
                backgroundColor: "gray",
                height: 60,
                width: 60,
              }}
            ></View>
          }
        >
          <Image
            style={{ height: 60, width: 60 }}
            source={{
              uri: "https://reactnative.dev/img/tiny_logo.png",
            }}
          />
        </MaskedView>
        <Text
          onPress={action}
          style={{ fontWeight: "bold", fontSize: 16, marginTop: 5 }}
        >
          {user.nickname}
        </Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          padding: 10,
          flex: 2,
          flexDirection: "row",
        }}
      >
        <View style={{ justifyContent: "center", flex: 1 }}>
          <Badges />
          <Text>{user.comment}</Text>
        </View>
        <View style={{ justifyContent: "center", flex: 1 }}></View>
      </View>
    </View>
  );
}
function Badges(props) {
  return (
    <View
      style={{
        backgroundColor: themeColor(6),
        borderRadius: 5,
        paddingHorizontal: 2,
        paddingVertical: 2.5,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <FontAwesomeIcon icon={faCrown} color="white" />
      <Text style={{ color: "white", fontWeight: "bold" }}> dada</Text>
    </View>
  );
}

export default RequesterInfoArea;
