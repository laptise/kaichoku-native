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
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import * as User from "../../../firebase/firestore/users";
import "dayjs/locale/ko";
function Header() {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Text>매너채팅부탁합니다</Text>
    </View>
  );
}
const renderBubble = (props) => {
  return (
    <Bubble
      {...props}
      textProps={{
        style: {
          color: "#fff",
        },
      }}
      textStyle={{
        left: {
          color: "#fff",
        },
        right: {
          color: "#fff",
        },
      }}
    />
  );
};
function Messenger({ state, route }: Props) {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null as User.Class);
  const firestore = state.firebase.firestore();
  const auth = state.firebase.auth();
  const tradeId = route.params.tradeId;
  const currentMessageRef = firestore
    .collection("trades")
    .doc(tradeId)
    .collection("messages");
  console.log(tradeId);
  const onSend = async (newMessages = []) => {
    console.log(newMessages);
    newMessages.forEach(async (newMessage) => {
      await currentMessageRef
        .doc(String(10000000000000 - new Date().valueOf()))
        .set(newMessage);
    });
  };
  const getUser = async () => {
    const user = await firestore
      .collection("users")
      .doc(auth.currentUser.uid)
      .withConverter(User.Converter)
      .get()
      .then((doc) => doc.data());
    setUser(user);
  };
  useEffect(() => {
    getUser();
    currentMessageRef.onSnapshot((snapshot) => {
      const messages = snapshot.docs.map((doc) => {
        doc.ref.update({
          viewd: state.firebase.firestore.FieldValue.arrayUnion(
            auth.currentUser.uid
          ),
        });
        const singleResut = doc.data();
        singleResut.createdAt = singleResut.createdAt.toDate();
        return singleResut;
      });
      setMessages(messages);
    });
    return () => currentMessageRef.onSnapshot(() => {});
  }, []);
  if (user)
    return (
      <GiftedChat
        renderBubble={renderBubble}
        messagesContainerStyle={{ marginBottom: 50 }}
        locale="ko"
        placeholder="메세지를 입력하세요"
        messages={messages}
        onSend={onSend}
        user={{
          _id: state.firebase.auth().currentUser.uid,
          name: user.nickname,
        }}
      />
    );
  else return <Text>wait</Text>;
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
