import React, { useRef, useState } from "react";

import Axios from "axios";
import MapView, {
  AnimatedRegion,
  Callout,
  LatLng,
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { Geometry, PlaceAPIResponce } from "../../models/placeAPIResponse";
import { Modal, SafeAreaView, Text, View, StyleSheet, Button, Alert } from "react-native";
import {
  ScrollView,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";
import themeColor from "../colors";

export interface PlaceInformation {
  id: string;
  name: string;
  location: LatLng;
  address: string;
}

async function searchPlace(text: string) {
  if (!text) {
    Alert.alert("검색 실패", "검색어를 입력해주세요");
    return [];
  }
  const queryString = text.replace(/ |　/g, "+");
  const places = await Axios.get(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?inputtype=textquery&query=${queryString}&fields=formatted_address,name,geometry&language=ko&key=AIzaSyCRmpR4CwNGQk43Q_wln9B6K39FpxTQsZQ`
  )
    .then((res) => res.data)
    .then((res: PlaceAPIResponce) => res.results);
  const results = places.map((place) => {
    const location = {
      latitude: place.geometry.location["lat"],
      longitude: place.geometry.location["lng"],
    };
    const info: PlaceInformation = {
      id: place.place_id,
      name: place.name,
      location: location,
      address: place.formatted_address,
    };
    return info;
  });
  return results;
}

interface ModalProps {
  visibleState: [boolean, React.Dispatch<boolean>];
  output?: React.Dispatch<PlaceInformation>;
}
export default function PlaceSearcherModal({ visibleState, output }: ModalProps) {
  const [visible, setVisible] = visibleState;
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([] as PlaceInformation[]);
  const [target, setTarget] = useState(null as PlaceInformation);
  const markerRef = useRef(null as Marker);
  const confirm = () => {
    target && output && output(target);
    setVisible(false);
  };
  return (
    <Modal
      animationType="fade"
      visible={visible}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        padding: 100,
      }}
    >
      <SafeAreaView>
        <View style={style.container}>
          <Text style={{ fontSize: 16, marginBottom: 10, fontWeight: "bold" }}>
            구매처 검색하기
          </Text>
          <View style={style.header}>
            <View style={style.searchBar}>
              <TextInput
                style={{ ...style.textInput, flex: 1 }}
                onChangeText={setKeyword}
              ></TextInput>
              <TouchableOpacity
                containerStyle={{ marginLeft: "auto" }}
                style={{ ...style.openButton, backgroundColor: "#2196F3", height: "100%" }}
                onPress={async () => setResults(await searchPlace(keyword))}
              >
                <Text style={{ color: "white" }}>검색</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={style.body}>
            {results.length === 0 && (
              <Text style={{ padding: 10 }}>여기에 검색결과가 표시됩니다.</Text>
            )}
            <ScrollView>
              {results.length > 0 &&
                results.map((res, index) => (
                  <View
                    key={index}
                    onTouchEnd={() => setTarget(res)}
                    style={{
                      ...style.single,
                      backgroundColor: res === target ? themeColor(3) : "white",
                    }}
                  >
                    <Text style={{ color: res === target ? "white" : "black", fontWeight: "bold" }}>
                      {res.name}
                    </Text>
                    <Text style={{ color: res === target ? "white" : "black", fontSize: 13 }}>
                      {res.address}
                    </Text>
                  </View>
                ))}
            </ScrollView>
          </View>
          <MapView
            region={target && { ...target.location, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
            style={style.map}
            provider={PROVIDER_GOOGLE}
            onRegionChangeComplete={() =>
              markerRef && markerRef.current && markerRef.current.showCallout()
            }
          >
            {target && (
              <Marker coordinate={target.location} ref={markerRef}>
                <Callout style={{ padding: 5, borderRadius: 10, maxWidth: "80%", minHeight: 60 }}>
                  <Text style={{ fontWeight: "bold" }}>{target.name}</Text>
                  <Text style={{ fontSize: 13 }}>{target.address}</Text>
                </Callout>
              </Marker>
            )}
          </MapView>
          <View style={style.tools}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={style.buttons}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirm}>
              <Text style={style.buttons}>선택</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const style = StyleSheet.create({
  container: {
    padding: 20,
    height: "100%",
  },
  searchBar: {
    borderWidth: 1,
    borderColor: "#ccc",
    flexDirection: "row",
    borderRadius: 10,
  },
  header: {
    height: 40,
  },
  body: {
    flex: 1,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  map: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  textInput: {
    padding: 10,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  tools: {
    marginTop: 10,
    height: 40,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  buttons: {
    color: "white",
    padding: 10,
    backgroundColor: themeColor(3),
    borderRadius: 10,
  },
  single: {
    minHeight: 20,
    padding: 6,
  },
});
