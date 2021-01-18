import { StatusBar } from "expo-status-bar";
import { Modal, View } from "react-native";
import { SafeAreaView } from "react-navigation";
import ImageFlex from "../expo-image-picker-multiple/index";

import React, { useRef, useState } from "react";

function ImagePicker() {
  return (
    <Modal visible={true} animationType="fade" style={{ padding: 20 }}>
      <StatusBar />
      <ImageFlex max={8} />
    </Modal>
  );
}

export default ImagePicker;
