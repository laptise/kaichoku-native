import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  InteractionManager,
  Image,
  Dimensions,
  Button,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { InitialState, Props } from "../../../../store/reducer";
import * as Trade from "../../../../firebase/firestore/trades";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { faCommentDots, faInfo } from "@fortawesome/free-solid-svg-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

function MapDetail() {
  const map = useRef();
  const [region, setRegion] = useState({
    latitude: 35.68860815745225,
    longitude: 139.6984188518095,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  return (
    <View style={style.container}>
      <View style={style.header}>
        <Text>구매장소</Text>
        <TouchableOpacity
          onPress={() => {
            setRegion({
              latitude: 135.68860815745225,
              longitude: 19.6984188518095,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }}
        >
          <Text>MOVE</Text>
        </TouchableOpacity>
      </View>
      <MapView
        ref={map}
        region={region}
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton={true}
        showsCompass={true}
        showsUserLocation={true}
        showsBuildings={true}
        followsUserLocation={true}
        onLongPress={(e) => console.log(e.nativeEvent.coordinate)}
        style={style.map}
      ></MapView>
    </View>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    backgroundColor: "white",
  },
  map: {
    padding: 10,
    flex: 1,
  },
});

function mapStateToProps(state: InitialState): Props {
  return { state };
}

const App = connect(mapStateToProps)(MapDetail);
export default App;
