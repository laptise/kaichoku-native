import React, { useEffect, useState } from "react";
import { InitialState, Props } from "../../../store/reducer";
import { StyleSheet, View, Text } from "react-native";
import { connect } from "react-redux";

interface BlockProps {
  title: string;
  content: string;
}
function Block({ title, content }: BlockProps) {
  const style = StyleSheet.create({
    body: {
      marginVertical: 20,
      width: "100%",
      alignItems: "center",
    },
    title: {
      fontSize: 18,
      marginBottom: 10,
    },
    content: {},
  });
  return (
    <View style={style.body}>
      <Text style={style.title}>{title}</Text>
      <Text>{content}</Text>
    </View>
  );
}
function Information() {
  return (
    <View style={style.container}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>정보</Text>
      <Block title="운영단체" content="해직은 ㅁㅁㅁㅁ입니다." />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "white",
    flex: 1,
    padding: 10,
  },
});

function mapStateToProps(state: InitialState) {
  return { state };
}

function mapDispatchToProps(dispatch) {
  return {};
}

const AppContainer = connect(mapStateToProps)(Information);
export default AppContainer;
