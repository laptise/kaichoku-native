import React, { useEffect, useState } from "react";
import { InitialState, Props } from "../../../store/reducer";
import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Platform,
  Image,
  Alert,
  Modal,
} from "react-native";
import Swiper from "react-native-swiper";
import * as ImageManipulator from "expo-image-manipulator";
import { connect } from "react-redux";
import { Button, Divider, Text } from "react-native-elements";
import themeColor from "../../../components/colors";
import * as Trade from "../../../firebase/firestore/trades";
import * as ImagePicker from "expo-image-picker";
import IP from "../../../components/modals/ImagePicker";
import { TouchableOpacity } from "react-native-gesture-handler";
import Axios from "axios";
import { PlaceAPIResponce } from "../../../models/placeAPIResponse";
import PlaceSearcherModal, { PlaceInformation } from "../../../components/modals/PlaceSetter";
interface FormData {
  requestTitle: string;
  productName: string;
  purchasePlace: string;
  price: number;
  fee: number;
}

function AddNewRequest({ navigation, route, state }: Props) {
  const [images, setImages] = useState([]);
  const [productName, setProductName] = useState(null);
  const [purchasePlace, setPurchasePlace] = useState(null);
  const [requestTitle, setRequestTitle] = useState(null);
  const [price, setPrice] = useState(null);
  const [fee, setFee] = useState(null);
  const [blob, setBlob] = useState(null);
  const firebase = state.firebase;
  const db = firebase.firestore();
  const auth = firebase.auth();
  const [loading, setLoading] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [place, setPlace] = useState(null as PlaceInformation);
  const formData: FormData = {
    requestTitle,
    productName,
    purchasePlace,
    price,
    fee,
  };
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    const result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    if (!result.cancelled) {
      const newImages = images.concat();
      const actions = [];
      actions.push({ resize: { width: 350 } });
      const manipulatorResult = await ImageManipulator.manipulateAsync(result.uri, actions, {
        compress: 0.4,
      });
      newImages.push(manipulatorResult.uri);
      setImages(newImages);
    }
  };
  const imgUpload = async (docId: string) => {
    const metadata = {
      contentType: "image/jpeg",
    };
    let uris: string[] = [];
    await Promise.all(
      images.map(async (image, index) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const storage = firebase.storage();
        const tradesRef = storage.ref("trades");
        const tradeRef = tradesRef.child(`${docId}/${index}`);
        await tradeRef.put(blob, metadata).catch(console.log);
        uris.push((await tradeRef.getDownloadURL()) as string);
      })
    );
    return uris;
  };
  const add = async () => {
    const docAndImages = await db
      .collection("trades")
      .add({})
      .then(async (doc) => {
        const urls = await imgUpload(doc.id);
        return { doc, urls };
      });
    const uploadedTrade = await docAndImages.doc
      .withConverter(Trade.Converter)
      .set(
        new Trade.Class(
          docAndImages.doc.id,
          formData.productName,
          place ? null : formData.purchasePlace,
          Number(formData.price),
          Number(formData.fee),
          formData.requestTitle,
          new Date(),
          auth.currentUser.uid,
          null,
          docAndImages.urls || [],
          null,
          0,
          0,
          null,
          place
        )
      );
    Alert.alert("등록완료", "새로운 의뢰를 추가했습니다\n내 거래에서 확인하실 수 있습니다.");
    navigation.goBack();
    navigation.navigate("RequestInfo", {
      id: docAndImages.doc.id,
      type: "requesting",
    });
  };
  return (
    <>
      <ScrollView>
        <PlaceSearcherModal output={setPlace} visibleState={[modalVisible, setModalVisible]} />
        <View
          style={{
            flex: 1,
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text style={{ padding: 20, fontSize: 24 }}>상품구매 의뢰하기</Text>
          <Divider style={{ height: 2, backgroundColor: themeColor(3), width: "70%" }} />
          <View style={{ marginVertical: 20 }}>
            <Text>기재내용이 자세할수록 발송자가 물건을 찾기 쉬워져요.</Text>
            <Text>최대한 자세하게 적어주세요!</Text>
          </View>
          <Text style={[table.label]}>의뢰제목</Text>
          <View style={[table.table, table.th]}>
            <TextInput onChangeText={(e) => setRequestTitle(e)} placeholder="의뢰제목" />
          </View>
          <Text style={[table.label]}>구매처정보</Text>
          <View
            style={[
              table.table,
              table.th,
              {
                flexDirection: "row",
                padding: 0,
                alignItems: "center",
                maxHeight: place ? 50 : 40,
              },
            ]}
          >
            <View style={{ padding: 10, flex: 1 }}>
              {place ? (
                <>
                  <Text style={{ fontWeight: "bold" }}>{place.name}</Text>
                  <Text style={{ fontSize: 13 }}>{place.address}</Text>
                </>
              ) : (
                <TextInput onChangeText={(e) => setPurchasePlace(e)} placeholder="구매장소" />
              )}
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{
                backgroundColor: themeColor(4),
                height: "100%",
                flexDirection: "row",
                justifyContent: "center",
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
              }}
              containerStyle={{ width: 40, marginLeft: "auto" }}
            >
              <Text
                style={{
                  textAlign: "center",
                  alignSelf: "center",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {place ? "편집" : "검색"}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[table.label]}>상품정보</Text>
          <View style={[table.table, table.th]}>
            <TextInput onChangeText={(e) => setProductName(e)} placeholder="상품명" />
          </View>
          <Text style={[table.label]}>링크</Text>
          <View style={[table.table, table.th]}>
            <TextInput
              onChangeText={(e) => setPurchasePlace(e)}
              placeholder="참고 URL링크 (상품 홈페이지 등)"
            />
          </View>
          <Text style={[table.label]}>가격</Text>
          <View style={[table.table, table.th]}>
            <TextInput
              onChangeText={(e) => setPrice(e)}
              keyboardType="number-pad"
              placeholder="가격"
            />
          </View>
          <Text style={[table.label]}>수수료</Text>
          <View style={[table.table, table.th]}>
            <TextInput
              onChangeText={(e) => setPrice(e)}
              keyboardType="number-pad"
              placeholder="수수료"
            />
          </View>
          {/* <CategorySelector /> */}
          {images.length > 0 && (
            <Swiper style={style.slider} showsButtons={false} showsPagination={false}>
              {images.length > 0 &&
                images.map((image, index) => (
                  <View key={index} style={style.slide1}>
                    <Image
                      key={index}
                      style={{ width: "100%", height: "100%" }}
                      source={{ uri: image }}
                    />
                    <TextInput />
                  </View>
                ))}
            </Swiper>
          )}
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity containerStyle={style.bottomButtonViews}>
              <View
                style={{ backgroundColor: themeColor(3), padding: 10, borderRadius: 5, margin: 10 }}
              >
                <Text style={{ color: "white" }}>취소</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage} containerStyle={style.bottomButtonViews}>
              <View
                style={{ backgroundColor: themeColor(3), padding: 10, borderRadius: 5, margin: 10 }}
              >
                <Text style={{ color: "white" }}>사진추가</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={add} containerStyle={style.bottomButtonViews}>
              <View
                style={{ backgroundColor: themeColor(3), padding: 10, borderRadius: 5, margin: 10 }}
              >
                <Text style={{ color: "white" }}>의뢰등록</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

function mapStateToProps(state: InitialState) {
  return { state };
}

function mapDispatchToProps(dispatch) {
  return {};
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(AddNewRequest);

const style = StyleSheet.create({
  bottomButtonViews: {},
  slider: {
    height: 300,
    marginVertical: 10,
  },
  slide1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB",
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
});
const css = StyleSheet.create({
  categorySelector: {
    flexDirection: "row",
    width: "100%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  singleCategory: {
    padding: 5,
    fontSize: 15,
    height: 28,
    justifyContent: "center",
  },
  categoryTitle: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 5,
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },
  labelBox: {
    backgroundColor: themeColor(6),
  },
  resultBox: {
    maxHeight: 200,
    width: 100,
    flex: 1,
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  input: {
    borderWidth: 0.5,
    padding: 7.5,
    borderRadius: 10,
    borderColor: "#ccc",
  },
});

const table = StyleSheet.create({
  table: {
    margin: 10,
    borderRadius: 5,
    backgroundColor: "white",
    width: "100%",
  },
  th: {
    padding: 10,
  },
  td: {
    padding: 10,
    marginLeft: "auto",
  },
  tr: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  label: {
    alignSelf: "flex-start",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
});

export default AppContainer;
