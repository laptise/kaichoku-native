import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { StyleSheet, Text, View, Animated } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { createStackNavigator } from "@react-navigation/stack";

import {
  faPlus,
  faExchangeAlt,
  faUmbrella,
  faCode,
  faWallet,
  faBullhorn,
  faInfo,
  faEnvelope,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Props, InitialState } from "../../../store/reducer";
import * as Trade from "../../../firebase/firestore/trades";
import ProfileZone from "../ProfileZone";
import { Divider } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { stat } from "fs";

function Menu({ state, navigation }: Props) {
  const firestore = state.firebase.firestore();
  const auth = state.firebase.auth();
  const [sellingNotifications, setSellingNotifications] = useState(0);
  const [purchasingNotifications, setPurchasingNotifications] = useState(0);
  const [purchasingTrades, setPurchasingTrades] = useState([] as Trade.Class[]);
  useEffect(() => {
    setPurchasingTrades(state.requestedTrades.filter((trade) => trade.catcher));
    const sellingCounts = state.catchedTrades.reduce((acc, trade) => acc + trade.catcherUnread, 0);
    const purchasingCounts = purchasingTrades.reduce(
      (acc, trade) => acc + trade.requesterUnread,
      0
    );
    setSellingNotifications(sellingCounts);
    setPurchasingNotifications(purchasingCounts);
  }, []);
  return (
    <View style={style.wrapper}>
      <Text style={style.zoneTitle}>내 정보</Text>
      <ProfileZone navigation={navigation} />
      {/* <Divider style={{ backgroundColor: "#ccc" }} /> */}
      <Text style={style.zoneTitle}>내 거래</Text>
      <View style={style.row}>
        <SingleButton
          iconName={faExchangeAlt}
          title="판매중 거래"
          action={() =>
            navigation.navigate("sellTradings", {
              tradeIds: state.catchedTrades.map((trade) => trade.id),
            })
          }
          badgeCount={state.catcherUnread}
        />
        <SingleButton
          iconName={faExchangeAlt}
          title="구매중 거래"
          action={() =>
            navigation.navigate("purchaseTradings", {
              tradeIds: state.requestedTrades
                .filter((trade) => trade.catcher)
                .map((trade) => trade.id),
            })
          }
          badgeCount={state.requesterUnread}
        />
        <SingleButton
          iconName={faWallet}
          title="내 지갑"
          action={() => navigation.navigate("Wallet")}
        />
        <SingleButton iconName={faCog} title="설정" action={() => navigation.navigate("Setting")} />
      </View>
      <View style={style.row}>
        <SingleButton
          iconName={faBullhorn}
          title="공지사항"
          action={() => navigation.navigate("Notice")}
        />
        <SingleButton
          iconName={faInfo}
          title="정보"
          action={() => navigation.navigate("Information")}
        />
        <SingleButton
          iconName={faEnvelope}
          title="문의"
          action={() => navigation.navigate("Contact")}
        />
        <SingleButton iconName={faCode} title="dad" action={() => true} />
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  zoneTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 10,
    marginVertical: 10,
  },

  wrapper: {
    backgroundColor: "white",
    flex: 1,
  },
  row: {
    flexDirection: "row",
  },
});
interface SingleButtonProps {
  iconName: IconProp;
  title: string;
  action: () => void;
  badgeCount?: number;
}
function SingleButton({ iconName, title, action, badgeCount }: SingleButtonProps) {
  const style = StyleSheet.create({
    container: {
      width: "25%",
      aspectRatio: 1,
    },
    box: {
      borderColor: "rgba(0,0,0,.15)",
      paddingVertical: 20,
      justifyContent: "center",
      alignItems: "center",
      aspectRatio: 1,
      position: "relative",
    },
    text: {
      fontSize: 14,
      color: "#333",
      position: "absolute",
      bottom: 10,
      textAlign: "center",
    },
    badge: {
      position: "absolute",
      backgroundColor: "red",
      width: 20,
      height: 20,
      borderRadius: 20,
      color: "white",
      alignItems: "center",
      justifyContent: "center",
      top: 10,
      right: 10,
      aspectRatio: 1,
    },
  });
  return (
    <TouchableOpacity onPress={action} containerStyle={style.container}>
      <View style={style.box}>
        {badgeCount > 0 && (
          <View style={style.badge}>
            <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>{badgeCount}</Text>
          </View>
        )}
        <FontAwesomeIcon size={34} icon={iconName} style={{ bottom: 5 }} color="#333" />
        <Text style={style.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}
function mapStateToProps(state: InitialState): Props {
  return { state };
}
const MenuContainer = connect(mapStateToProps)(Menu);

export default MenuContainer;
