import React, { useEffect, useState } from "react";
import { InitialState, Props } from "../../../store/reducer";
import { StyleSheet, View, Text } from "react-native";
import { connect } from "react-redux";
function EditProfile() {
  return (
    <View style={style.container}>
      <View style={style.titleArea}>
        <Text style={style.pageTitle}>내 정보</Text>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleArea: {
    padding: 10,
    alignItems: "center",
  },
  pageTitle: {
    fontSize: 20,
  },
});

function mapStateToProps(state: InitialState) {
  return { state };
}

function mapDispatchToProps(dispatch) {
  return {};
}

const AppContainer = connect(mapStateToProps)(EditProfile);
export default AppContainer;
