import React from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import Firebase, { db } from "../config/Firebase";
import { connect } from "react-redux";
import { getUser, logout } from "../redux/actions/users";
import { bindActionCreators } from "redux";
import { Button } from "react-native-elements";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import firebase from "firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

const tempDir = FileSystem.documentDirectory + "zipFiled";

const HomeScreen = (props) => {
  const [user, setUser] = React.useState(null);
  const [document, setDocument] = React.useState(null);
  const [image, setImage] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const handleSignOut = () => {
    props.logout();
    props.navigation.navigate("Login");
  };

  const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(tempDir);
    // console.log(dirInfo);
    if (!dirInfo.exists) {
      console.log("Gif directory doesn't exist, creating...");
      await FileSystem.makeDirectoryAsync(tempDir, { intermediates: true });
    }
    let res = await FileSystem.readDirectoryAsync(tempDir);
  };

  /// zip (dev-mode) ///

  // const makeZips = async () => {
  //   try {
  //     // await FileSystem.copyAsync({
  //     //   from: image.uri,
  //     //   to: tempDir + "/image3.jpg",
  //     // });
  //     // await ensureDirExists();
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   // try {
  //   //   await ensureDirExists();
  //   //   await FileSystem.copyAsync({
  //   //     from: image.uri,
  //   //     to: tempDir + `/${image.name}`,
  //   //   });
  //   //   // await FileSystem.copyAsync({ from: document.uri, to: tempDir });
  //   //   // await FileSystem.copyAsync({ from: image.uri, to: tempDir });
  //   // } catch (error) {
  //   //   console.log(error);
  //   // }
  //   // const data = await db.collection("userDocs").doc("uiid").get();
  //   // console.log(data);
  // };

  const sendFiles = async () => {
    setUploading(true);

    await ensureDirExists();
    try {
      if (image) {
        await FileSystem.copyAsync({
          from: image.uri,
          to: tempDir + "/image.jpg",
        });

        const Blob = await new Promise(async (resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function () {
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          let res = await FileSystem.readDirectoryAsync(tempDir);
          xhr.open("GET", `${tempDir}/image.jpg`, true);
          xhr.send(null);
        });

        const ref = firebase
          .storage()
          .ref()
          .child(`userDocs/${user.uid}/image.jpg`);

        const snapshot = await ref.put(Blob, {
          contentType: "image/*",
        });
      }
      if (document) {
        await FileSystem.copyAsync({
          from: document.uri,
          to: tempDir + "/doc.pdf",
        });
        const Blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function () {
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", `${tempDir}/doc.pdf`, true);
          xhr.send(null);
        });

        const ref = firebase
          .storage()
          .ref()
          .child(`userDocs/${user.uid}/doc.pdf`);

        const snapshot = await ref.put(Blob, {
          contentType: "application/pdf",
        });
      }
      alert("Uploaded");
    } catch (error) {
      alert("Try Again!!");
    }
    setUploading(false);
    await FileSystem.deleteAsync(tempDir, { idempotent: true });

    /// Zip Implementation (dev-mode) ///

    // const targetPath = `${tempDir}/myfile.zip`;
    // const sourcePath = `${tempDir}`;
    // zip(sourcePath, targetPath)
    //   .then((path) => {
    //     console.log(`zip completed at ${path}`);
    //     const Blob = new Promise((resolve, reject) => {
    //       const xhr = new XMLHttpRequest();
    //       xhr.onload = function () {
    //         resolve(xhr.response);
    //       };
    //       xhr.onerror = function () {
    //         reject(new TypeError("Network request failed"));
    //       };
    //       xhr.responseType = "blob";
    //       xhr.open("GET", `${tempDir}/myfile.zip`, true);
    //       xhr.send(null);
    //     });

    //     const ref = firebase
    //       .storage()
    //       .ref()
    //       .child(`userDocs/${user.uid}/myfile.zip`);

    //     const snapshot = ref.put(Blob, {
    //       contentType: "application/zip",
    //     });
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  };
  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        multiple: true,
      }).then(async (result) => {
        if (result.type !== "cancel") {
          const fileData = {
            uri: result.uri,
            name: result.name,
            type: "text/csv",
          };
          // console.log(fileData);
          setDocument(fileData);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  const pickImage = async () => {
    try {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({});
      setImage(pickerResult);
    } catch (error) {
      alert(error);
    }
  };
  React.useEffect(() => {
    handleUser();
  }, [props.user]);

  const handleUser = async () => {
    try {
      const user = await db.collection("users").doc(props.user.user.uid).get();
      setUser(user.data());
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          {user.phone_verified === true ? null : (
            <Button
              buttonStyle={{ backgroundColor: "red" }}
              title={"Phone Verificaion Unsuccessful! Click Here"}
              onPress={() => props.navigation.navigate("MobileAuth")}
            />
          )}

          <View
            style={{
              backgroundColor: "darkgrey",
              alignItems: "center",
              margin: 20,
              padding: 20,
            }}
          >
            <Text>User: {user.email ? user.email : user.name}</Text>
            <Text>Phone_verified: {user.phone_verified.toString()}</Text>
          </View>
          <Button
            buttonStyle={{ margin: 20 }}
            title="Select Pdf"
            onPress={pickDocument}
          />
          <Button
            buttonStyle={{ margin: 20 }}
            title="Select Image(.jpg)"
            onPress={pickImage}
          />
          {/* <Button buttonStyle={{ margin: 20 }} title="Zip" onPress={makeZips} /> */}
          <Button
            buttonStyle={{ margin: 20 }}
            title={uploading ? <ActivityIndicator color="white" /> : "Upload"}
            onPress={sendFiles}
          />

          <Button title="Logout" onPress={handleSignOut} />
        </>
      ) : (
        <>
          <ActivityIndicator size="small" color="#0000ff" />
          <Button title="Logout" onPress={handleSignOut} />
        </>
      )}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getUser, logout }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    marginTop: 30,
  },
});
