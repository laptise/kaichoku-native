import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { InitialState, Props } from "../../../store/reducer";
import { connect } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import { GiftedChat } from "react-native-gifted-chat";
function Header() {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Text>매너채팅부탁합니다</Text>
    </View>
  );
}
function Messenger({ state }: Props) {
  const [messages, setMessages] = useState([]);
  const onSend = (newMessages = []) => {
    setMessages(GiftedChat.append(messages, newMessages));
    console.log(messages);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={style.container}
    >
      <Header />
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: 1,
          name: "John Doe",
        }}
      />
    </KeyboardAvoidingView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function mapStateToProps(state: InitialState): Props {
  return { state };
}

const App = connect(mapStateToProps)(Messenger);

export default App;
