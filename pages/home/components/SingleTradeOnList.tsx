import {
  faArrowRight,
  faBox,
  faChevronRight,
  faHandHoldingUsd,
  faMapMarkedAlt,
  faStoreAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View, Animated, Image } from "react-native";
import { Divider } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import themeColor from "../../../components/colors";
import * as Trade from "../../../firebase/firestore/trades";

function SingleTradeOnList({ trade, navigation }: { trade: Trade.Class; navigation: any }) {
  //tradeType?: "acceptable" | "requesting" | "catched";

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("RequestInfo", {
          id: trade.id,
          type: "acceptable",
        })
      }
    >
      <View style={style.container}>
        <View style={style.imgBox}>
          <Image style={style.thumbnail} source={{ uri: trade.images[0] }} />
        </View>
        <View style={style.infoBox}>
          <Text style={style.textTitle}>{trade.title}</Text>
          {/* <Divider style={{ height: 0.5, backgroundColor: themeColor(3, 0.6), marginBottom: 5 }} /> */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              overflow: "hidden",
            }}
          >
            <View style={style.infoItem}>
              <FontAwesomeIcon size={13} icon={faBox} style={{ marginRight: 5, color: "#444" }} />
              <Text style={style.textItem}>{trade.name}</Text>
            </View>
            <View style={style.infoItem}>
              <FontAwesomeIcon
                size={13}
                icon={faHandHoldingUsd}
                style={{ marginRight: 5, color: "#444" }}
              />
              <Text style={style.textItem}>{trade.fee.toLocaleString()}</Text>
            </View>
            {trade.place && (
              <View style={style.infoItem}>
                <FontAwesomeIcon
                  size={13}
                  icon={faStoreAlt}
                  style={{ marginRight: 5, color: "#444" }}
                />
                <Text style={style.textItem}>{trade.place}</Text>
              </View>
            )}
            {trade.placeInfo && (
              <View style={style.infoItem}>
                <FontAwesomeIcon
                  size={13}
                  icon={faMapMarkedAlt}
                  style={{ marginRight: 2.5, color: "#444" }}
                />
                <Text style={style.textItem}>{trade.placeInfo.name}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={{ alignItems: "center", justifyContent: "center", marginRight: 7.5 }}>
          <TouchableOpacity>
            <FontAwesomeIcon size={20} style={{ color: themeColor(1) }} icon={faChevronRight} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
export default SingleTradeOnList;

const style = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    flexDirection: "row",
  },
  imgBox: {
    marginVertical: 10,
    borderRadius: 10,
    height: 70,
    width: 70,
    backgroundColor: "white",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.9,
    shadowRadius: 1.41,

    elevation: 2,
  },
  thumbnail: {
    height: 70,
    aspectRatio: 1,
  },
  infoBox: {
    flex: 1,
    paddingVertical: 10,
    flexDirection: "column",
    marginLeft: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginVertical: 2.5,
  },
  textItem: {
    color: "#444",
    fontSize: 13,
  },
  textTitle: {
    width: "100%",
    color: themeColor(4, 0.8),

    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
    fontSize: 16,
    marginTop: 2.5,
    marginBottom: 5,
    fontWeight: "bold",
  },
});
