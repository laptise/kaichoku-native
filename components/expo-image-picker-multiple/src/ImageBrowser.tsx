import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  Text,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import ImageTile from "./ImageTile";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { SafeAreaView } from "react-navigation";

const { width } = Dimensions.get("window");

export interface ImageBrowserProps {
  style?: StyleProp<ViewStyle>;
  max?: any;
  loadCount?: any;
  noCameraPermissionComponent?: any;
  renderSelectedComponent?: any;
  loadCompleteMetadata?: any;
  callback?: any;
  preloaderComponent?: any;
  emptyStayComponent?: any;
  onChange?: any;
  navigation?: any;
}
export default function ImageBrowser({
  max,
  loadCount,
  noCameraPermissionComponent,
  renderSelectedComponent,
  loadCompleteMetadata,
  callback,
  preloaderComponent,
  emptyStayComponent,
  onChange,
  navigation,
  style,
}: ImageBrowserProps) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasCameraRollPermission, setHasCameraRollPermission] = useState(null);
  const [numColumns, setNumColumns] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [after, setAfter] = useState(null as string);
  const [hasNextPage, setHasNextPage] = useState(true);

  const defaultProps = {
    loadCompleteMetadata: true,
    loadCount: 50,
    emptyStayComponent: null,
    preloaderComponent: <ActivityIndicator size="large" />,
  };

  const getPermissionsAsync = async () => {
    const { status: camera } = await Permissions.askAsync(Permissions.CAMERA);
    const { status: cameraRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    setHasCameraPermission(camera === "granted");
    setHasCameraRollPermission(cameraRoll === "granted");
  };

  const onOrientationChange = ({ orientationInfo }) => {
    ScreenOrientation.removeOrientationChangeListeners();
    ScreenOrientation.addOrientationChangeListener(onOrientationChange);
    const numColumns = getNumColumns(orientationInfo.orientation);
    setNumColumns(numColumns);
  };

  const initiate = async () => {
    await getPermissionsAsync();
    ScreenOrientation.addOrientationChangeListener(onOrientationChange);
    const orientation = await ScreenOrientation.getOrientationAsync();
    const numColumns = getNumColumns(orientation);
    setNumColumns(numColumns);
    getPhotos();
  };
  useEffect(() => {
    initiate();
  });

  const getNumColumns = (orientation) => {
    const { PORTRAIT_UP, PORTRAIT_DOWN } = ScreenOrientation.Orientation;
    const isPortrait = orientation === PORTRAIT_UP || orientation === PORTRAIT_DOWN;
    return isPortrait ? 4 : 7;
  };

  const selectImage = (index) => {
    let newSelected = Array.from(selected);
    if (newSelected.indexOf(index) === -1) {
      newSelected.push(index);
    } else {
      const deleteIndex = newSelected.indexOf(index);
      newSelected.splice(deleteIndex, 1);
    }
    if (newSelected.length > max) return;
    if (!newSelected) newSelected = [];
    /////
    setSelected(newSelected);
    onChange && onChange(newSelected.length, () => prepareCallback());
    // submit();
  };

  const getPhotos = () => {
    const params: MediaLibrary.AssetsOptions = {
      first: loadCount,
      mediaType: MediaLibrary.MediaType.photo,
      sortBy: [MediaLibrary.SortBy.creationTime],
    };
    if (after) params.after = after;
    if (!hasNextPage) return;
    MediaLibrary.getAssetsAsync(params).then(processPhotos);
  };

  const processPhotos = (data: MediaLibrary.PagedInfo<MediaLibrary.Asset>) => {
    if (data.totalCount) {
      if (after === data.endCursor) return;
      const uris = data.assets;
      setPhotos([...photos, ...uris]);
      setAfter(data.endCursor);
      setHasNextPage(data.hasNextPage);
    } else {
      setIsEmpty(true);
    }
  };

  const getItemLayout = (data, index) => {
    const length = width / 4;
    return { length, offset: length * index, index };
  };

  const prepareCallback = () => {
    const selectedPhotos = selected.map((i) => photos[i]);
    if (!loadCompleteMetadata) {
      callback(Promise.all(selectedPhotos));
    } else {
      const assetsInfo = Promise.all(selectedPhotos.map((i) => MediaLibrary.getAssetInfoAsync(i)));
      callback(assetsInfo);
    }
  };

  const renderImageTile = ({ item, index }) => {
    const isSelected = selected.indexOf(index) !== -1;
    const selectedItemNumber = selected.indexOf(index) + 1;
    return (
      <ImageTile
        selectedItemNumber={selectedItemNumber}
        item={item}
        index={index}
        selected={isSelected}
        selectImage={selectImage}
        renderSelectedComponent={renderSelectedComponent}
      />
    );
  };

  const renderPreloader = () => preloaderComponent;

  const renderEmptyStay = () => emptyStayComponent;

  const submit = () => {
    const selectedPhotos = selected.map((i) => photos[i]);
    navigation.navigate("Editor", { selectedPhotos });
  };
  const renderImages = () => {
    return (
      <FlatList
        data={photos}
        numColumns={numColumns}
        key={numColumns}
        renderItem={renderImageTile}
        keyExtractor={(_, index) => index as any}
        onEndReached={() => getPhotos()}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={isEmpty ? renderEmptyStay() : renderPreloader()}
        initialNumToRender={24}
        getItemLayout={getItemLayout}
      />
    );
  };

  const renderHeader = () => {
    return (
      <SafeAreaView>
        <View style={styles.headerContainer}>
          <View style={{ position: "absolute", left: 0, height: "100%", flexDirection: "row" }}>
            <Text style={{ alignSelf: "center", ...styles.headerText, fontSize: 16 }}>
              {selected.length}/{max}
            </Text>
          </View>
          <View style={styles.header}>
            <Text style={styles.headerText}>사진을 선택해주세요</Text>
          </View>
          <TouchableOpacity
            containerStyle={{ position: "absolute", right: 0 }}
            style={{ flexDirection: "row", height: "100%" }}
            onPress={submit}
          >
            <Text style={{ alignSelf: "center", ...styles.headerText, fontSize: 16 }}>다음</Text>
            <FontAwesomeIcon icon={faChevronRight} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };
  if (!hasCameraPermission) return noCameraPermissionComponent || null;
  return (
    <>
      {renderHeader && renderHeader()}
      {renderImages()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
