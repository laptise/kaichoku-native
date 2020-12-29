import React, { useEffect, useState } from "react";
import { InitialState, Props } from "../../../store/reducer";
import { StyleSheet, View, Text } from "react-native";
import { connect } from "react-redux";
function Information() {
  return (
    <View>
      <Text>문의</Text>
    </View>
  );
}

function mapStateToProps(state: InitialState) {
  return { state };
}

function mapDispatchToProps(dispatch) {
  return {};
}

const AppContainer = connect(mapStateToProps)(Information);
export default AppContainer;
