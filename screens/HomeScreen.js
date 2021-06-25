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

// const  uploadRef=()=> {
//   // [START storage_upload_ref]
//   // Create a root reference
//   var storageRef = firebase.storage().ref();

//   // Create a reference to 'mountains.jpg'
//   var mountainsRef = storageRef.child("mountains.jpg");

//   // Create a reference to 'images/mountains.jpg'
//   var mountainImagesRef = storageRef.child("images/mountains.jpg");

//   // While the file names are the same, the references point to different files
//   mountainsRef.name === mountainImagesRef.name; // true
//   mountainsRef.fullPath === mountainImagesRef.fullPath; // false
//   // [END storage_upload_ref]
// }

const HomeScreen = (props) => {
  const [user, setUser] = React.useState(null);
  const [document, setDocument] = React.useState(null);
  const [image, setImage] = React.useState(null);
  const handleSignOut = () => {
    props.logout();
    props.navigation.navigate("Login");
  };

  const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(tempDir);
    console.log(tempDir);
    // console.log(dirInfo);
    if (!dirInfo.exists) {
      console.log("Gif directory doesn't exist, creating...");
      await FileSystem.makeDirectoryAsync(tempDir, { intermediates: true });
    }
    let res = await FileSystem.readDirectoryAsync(tempDir);
    console.log(res[1]);
  };

  const makeZips = async () => {
    // try {
    //   await ensureDirExists();
    //   await FileSystem.copyAsync({
    //     from: image.uri,
    //     to: tempDir + `/${image.name}`,
    //   });
    //   // await FileSystem.copyAsync({ from: document.uri, to: tempDir });
    //   // await FileSystem.copyAsync({ from: image.uri, to: tempDir });
    // } catch (error) {
    //   console.log(error);
    // }
    const data = await db.collection("userDocs").doc("uiid").get();
    console.log(data);
  };
  const sendImage = async () => {
    const file = await FileSystem.readAsStringAsync(image.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const ref = firebase.storage().ref().child(`userDocs/${user.uid}`);

    const snapshot = await ref.putString(file, "base64");

    const remoteURL = await snapshot.ref.getDownloadURL();
    console.log(remoteURL);
    // [START storage_upload_blob]
    // 'file' comes from the Blob or File API
    // ref.put(document).then((snapshot) => {
    //   console.log("Uploaded a blob or file!");
    // });
    // db.collection("userDocs").doc("uiid").set({
    //   file: file,
    // });
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
          console.log(fileData);
          setDocument(fileData);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  const pickImage = async () => {
    try {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });
      setImage(pickerResult);
      // let result = await DocumentPicker.getDocumentAsync({
      //   multiple: true,
      // }).then(async (result) => {
      //   if (result.type !== "cancel") {
      //     const fileData = {
      //       uri: result.uri,
      //       name: result.name,
      //       type: "jpg/jpeg/png",
      //     };
      //     console.log(fileData);
      //     setImage(fileData);
      //   }
      // });
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    handleUser();
  }, [props.user]);

  const handleUser = async () => {
    try {
      const user = await db.collection("users").doc(props.user.user.uid).get();
      setUser(user.data());
    } catch (error) {
      console.log(error);
    }
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
            title="Select Image"
            onPress={pickImage}
          />
          <Button buttonStyle={{ margin: 20 }} title="Zip" onPress={makeZips} />
          <Button
            buttonStyle={{ margin: 20 }}
            title="Send"
            onPress={sendImage}
          />

          <Button title="Logout" onPress={handleSignOut} />
        </>
      ) : (
        <ActivityIndicator size="small" color="#0000ff" />
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
