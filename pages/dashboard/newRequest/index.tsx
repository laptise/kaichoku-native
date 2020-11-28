import React, { useEffect, useState } from "react";
import { InitialState, Props } from "../../../store/reducer";
import {
  StyleSheet,
  View,
  Animated,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import { Button, Text } from "react-native-elements";
import themeColor from "../components/colors";
import {
  categories,
  majorCategories,
  middleCategories,
} from "../../../data/categories";
import { Trade, TradeConverter } from "../../../models/firestore";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
interface FormData {
  requestTitle: string;
  productName: string;
  purchasePlace: string;
  price: number;
}

function AddNewRequest({ navigation, route, state }: Props) {
  const [image, setImage] = useState(null);
  const [productName, setProductName] = useState(null);
  const [purchasePlace, setPurchasePlace] = useState(null);
  const [requestTitle, setRequestTitle] = useState(null);
  const [price, setPrice] = useState(null);
  const firebase = state.firebase;
  const db = firebase.firestore();
  const auth = firebase.auth();
  const formData: FormData = {
    requestTitle,
    productName,
    purchasePlace,
    price,
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
    let result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  const add = () => {
    db.collection("trades")
      .withConverter(TradeConverter)
      .add(
        new Trade(
          formData.productName,
          formData.purchasePlace,
          100,
          100,
          formData.requestTitle,
          new Date(),
          auth.currentUser.uid,
          "d"
        )
      )
      .then(() => true);
    navigation.goBack();
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
        <Button
          onPress={pickImage}
          title="사진추가"
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
