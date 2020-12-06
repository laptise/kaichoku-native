import React, { useEffect, useState } from "react";
import { InitialState, Props } from "../../../store/reducer";
import {
  StyleSheet,
  View,
  Animated,
  TextInput,
  ScrollView,
  Platform,
  Image,
  Alert,
} from "react-native";
import Swiper from "react-native-swiper";
import * as ImageManipulator from "expo-image-manipulator";
import { connect } from "react-redux";
import { Button, Text } from "react-native-elements";
import themeColor from "../../../components/colors";
import {
  categories,
  majorCategories,
  middleCategories,
} from "../../../data/categories";
import * as Trade from "../../../firebase/firestore/trades";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { stat } from "fs";
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
        const {
          status,
        } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
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
      const manipulatorResult = await ImageManipulator.manipulateAsync(
        result.uri,
        actions,
        {
          compress: 0.4,
        }
      );
      newImages.push(manipulatorResult.uri);
      setImages(newImages);
    }
  };
  const imgUpload = async (docId: string) => {
    console.log(114);
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
    /**delete All */
    // db.collection("trades")
    //   .get()
    //   .then((docs) =>
    //     docs.forEach((doc) => {
    //       doc.ref.delete();
    //     })
    //   );5
    /**add To DB */
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
          formData.purchasePlace,
          Number(formData.price),
          Number(formData.fee),
          formData.requestTitle,
          new Date(),
          auth.currentUser.uid,
          null,
          docAndImages.urls || []
        )
      );
    Alert.alert(
      "등록완료",
      "새로운 의뢰를 추가했습니다\n내 거래에서 확인하실 수 있습니다."
    );
    navigation.goBack();
    navigation.navigate("RequestInfo", {
      id: docAndImages.doc.id,
      type: "requesting",
    });
  };
  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text style={{ padding: 20, fontSize: 24 }}>상품구매 의뢰하기</Text>
        <Text>기재내용이 자세할수록 발송자가 물건을 찾기 쉬워져요.</Text>
        <Text>최대한 자세하게 적어주세요!</Text>
        <Text style={[table.label]}>의뢰제목</Text>
        <View style={[table.table, table.th]}>
          <TextInput
            onChangeText={(e) => setRequestTitle(e)}
            placeholder="의뢰제목"
          />
        </View>
        <Text style={[table.label]}>상품명</Text>
        <View style={[table.table, table.th]}>
          <TextInput
            onChangeText={(e) => setProductName(e)}
            placeholder="상품명"
          />
        </View>
        <Text style={[table.label]}>구매장소</Text>
        <View style={[table.table, table.th]}>
          <TextInput
            onChangeText={(e) => setPurchasePlace(e)}
            placeholder="구매장소"
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
        <Swiper
          style={style.slider}
          showsButtons={false}
          showsPagination={false}
        >
          {(images.length > 0 &&
            images.map((image, index) => (
              <View key={index} style={style.slide1}>
                <Image
                  key={index}
                  style={{ width: "100%", height: "100%" }}
                  source={{ uri: image }}
                />
                <TextInput />
              </View>
            ))) || (
            <View style={style.slide1}>
              <Text>please add!</Text>
            </View>
          )}
        </Swiper>
        <Button
          onPress={pickImage}
          title="사진추가"
          style={{ marginBottom: 10 }}
        />
        <Button
          onPress={() => setImages([])}
          title="reset"
          style={{ marginBottom: 10 }}
        />
        <Button onPress={add} title="추가"></Button>
      </View>
    </ScrollView>
  );
}

function mapStateToProps(state: InitialState) {
  return { state };
}

function mapDispatchToProps(dispatch) {
  return {};
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddNewRequest);

const style = StyleSheet.create({
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
