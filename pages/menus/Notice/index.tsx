import React, { useEffect, useState } from "react";
import { InitialState, Props } from "../../../store/reducer";
import { StyleSheet, View, Text } from "react-native";
import { connect } from "react-redux";
function Notice() {
  return (
    <View>
      <Text>공지사항</Text>
    </View>
  );
}

function mapStateToProps(state: InitialState) {
  return { state };
}

function mapDispatchToProps(dispatch) {
  return {};
}

const AppContainer = connect(mapStateToProps)(Notice);
export default AppContainer;
