import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, RefreshControl } from "react-native";
import themeColor from "../../../../components/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import MaskedView from "@react-native-community/masked-view";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { Props } from "../../../../store/reducer";
import { TouchableOpacity } from "react-native-gesture-handler";
interface NewProps extends Props {
  action: () => void;
}
function RequesterInfoArea({ user, action }: NewProps) {
  return (
    <TouchableOpacity
      onPress={action}
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
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: 100,
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
        </View>
        <View
          style={{
            justifyContent: "center",
            flex: 1,
            flexDirection: "column",
          }}
        >
          <View style={{ justifyContent: "center", flex: 1 }}>
            <Badges />
            <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 5 }}>
              {user.nickname}
            </Text>
            <Text style={{ marginVertical: 5 }}>{user.comment}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        width: 100,
      }}
    >
      <FontAwesomeIcon
        icon={faCrown}
        color="white"
        style={{ marginLeft: 2.5 }}
      />
      <Text style={{ color: "white", fontWeight: "bold" }}> dada</Text>
    </View>
  );
}

export default RequesterInfoArea;
