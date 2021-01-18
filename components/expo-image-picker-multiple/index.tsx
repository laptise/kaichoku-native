import ImageBrowser, { ImageBrowserProps } from "./src/ImageBrowser";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  Modal,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Button,
  Alert,
  Image,
  GestureResponderEvent,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCheck,
  faChevronLeft,
  faChevronRight,
  faMinus,
  faPlus,
  faSearchMinus,
  faSearchPlus,
} from "@fortawesome/free-solid-svg-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import themeColor from "../colors";
import ReactNativeZoomableView from "@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView";
import { Slider, withBadge } from "react-native-elements";

interface ImageFlexProps extends ImageBrowserProps {}
const Stack = createStackNavigator();

export default function ImageFlex(props: ImageFlexProps) {
  const [touching, setTouching] = useState(false);
  const renderSelectedComponent = (number: number) => {
    return (
      <View style={styles.selectedContainer}>
        <Text style={styles.selectedText}>{number}</Text>
      </View>
    );
  };

  const Browser = ({ navigation }) => {
    const [pickedCount, setPickedCount] = useState(0);
    return (
      <ImageBrowser
        navigation={navigation}
        onChange={(cnt) => setPickedCount(cnt)}
        style={{ height: "100%", width: "100%" }}
        renderSelectedComponent={renderSelectedComponent}
        {...props}
      />
    );
  };

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Main" component={Browser} />
        <Stack.Screen name="Editor" component={Editor} options={{ gestureEnabled: false }} />
      </Stack.Navigator>
    </View>
  );
}

function Editor({ navigation, route }) {
  {
    const [imageX, SetImageX] = useState(0);
    const [imageY, SetImageY] = useState(0);
    const [pickedPhoto, setPickedPhoto] = useState(null as MediaLibrary.Asset);
    let flag = true;
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const { selectedPhotos }: { selectedPhotos: MediaLibrary.Asset[] } = route.params;
    const [zoomRate, setZoomRate] = useState(0);

    const touchMoving = (e: GestureResponderEvent) => {
      if (flag) {
        SetImageX(e.nativeEvent.pageX - startX);
        SetImageY(e.nativeEvent.pageY - startY);
        console.log(imageX);
      }
    };
    const renderHeader = () => {
      return (
        <View style={styles.headerContainer}>
          <TouchableOpacity
            containerStyle={{ position: "absolute", left: 0 }}
            style={{ flexDirection: "row", height: "100%" }}
            onPress={() => navigation.goBack()}
          >
            <FontAwesomeIcon color="white" icon={faChevronLeft} />
            <Text style={{ alignSelf: "center", ...styles.headerText, fontSize: 16 }}>다음</Text>
          </TouchableOpacity>
          <View style={styles.header}>
            <Text style={styles.headerText}>사진을 선택해주세요</Text>
          </View>
          <TouchableOpacity
            containerStyle={{ position: "absolute", right: 0 }}
            style={{ flexDirection: "row", height: "100%" }}
            onPress={console.log}
          >
            <Text style={{ alignSelf: "center", ...styles.headerText, fontSize: 16 }}>확인</Text>
            <FontAwesomeIcon color="white" icon={faCheck} />
          </TouchableOpacity>
        </View>
      );
    };
    return (
      <View style={{ backgroundColor: "rgba(0,0,0,0.8)", height: "100%" }}>
        <SafeAreaView>
          <StatusBar style="light" />
          {renderHeader()}
          <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
            {selectedPhotos.map((photo) => (
              <View
                style={{
                  width: "12.5%",
                  aspectRatio: 1,
                  padding: 5,
                  backgroundColor:
                    photo === pickedPhoto ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0)",
                }}
              >
                <TouchableOpacity onPress={() => setPickedPhoto(photo)}>
                  <Image style={{ width: "100%", height: "100%" }} source={{ ...photo }} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View
            style={{
              minWidth: "100%",
              aspectRatio: 1,
              padding: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              borderWidth: 40,
              borderColor: "rgba(0,0,0,0.7)",
              overflow: "hidden",
            }}
          >
            <View
              style={{
                borderColor: "white",
                height: "100%",
                width: "100%",
                borderWidth: 1,
              }}
            >
              {pickedPhoto && (
                <View
                  style={{ height: "100%", width: "100%", zIndex: 0 }}
                  onTouchStart={(e) => {
                    flag = true;
                    setStartX(e.nativeEvent.pageX - imageX);
                    setStartY(e.nativeEvent.pageY - imageY);
                  }}
                  onTouchMove={touchMoving}
                  onTouchEnd={(e) => {
                    flag = false;
                  }}
                >
                  <Image
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      position: "absolute",
                      left: imageX,
                      top: imageY,
                      zIndex: 0,
                    }}
                    source={{
                      ...pickedPhoto,
                      width: pickedPhoto.width * zoomRate,
                      height: pickedPhoto.width * zoomRate,
                    }}
                  />
                </View>
              )}
            </View>
          </View>
          <Adjuster photo={pickedPhoto} zoomRateState={[zoomRate, setZoomRate]} />
        </SafeAreaView>
      </View>
    );
  }
}

interface AdjusterProps {
  photo: MediaLibrary.Asset;
  zoomRateState: [number, React.Dispatch<React.SetStateAction<number>>];
}
function Adjuster({ photo, zoomRateState }: AdjusterProps) {
  const [zoomRate, setZoomRate] = zoomRateState;
  const zoomChange = (v) => {
    photo.width = photo.width * v;
    setZoomRate(v);
  };
  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "rgba(0,0,0,0.3)",
              width: "100%",
              padding: 10,
            }}
          >
            <Text style={{ color: "white", marginHorizontal: 5 }}>확대/축소</Text>
            <TouchableOpacity>
              <FontAwesomeIcon icon={faCheck} size={20} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 10,
            }}
          >
            <FontAwesomeIcon color="rgba(255,255,255,0.5)" size={16} icon={faMinus} />
            <Slider
              style={{ flex: 1, marginHorizontal: 10 }}
              value={zoomRate}
              thumbStyle={{ backgroundColor: "rgba(0,0,0,0.9)", height: 30, width: 30 }}
              onValueChange={(v) => setZoomRate(v)}
              onSlidingComplete={console.log}
            />
            <FontAwesomeIcon color="rgba(255,255,255,0.5)" size={16} icon={faPlus} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  header: {
    padding: 5,
    paddingVertical: 10,
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  selectedContainer: {
    backgroundColor: "blue",
    width: 25,
    aspectRatio: 1,
    borderRadius: 40,
    margin: 2.5,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});
