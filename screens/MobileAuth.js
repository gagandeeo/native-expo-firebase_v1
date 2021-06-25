import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import firebase from "firebase";
import { db } from "../config/Firebase";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getUser } from "../redux/actions/users";
import { Input, Button } from "react-native-elements";
const MobileAuth = (props) => {
  const recaptchaVerifier = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState();
  const firebaseConfig = firebase.apps.length
    ? firebase.app().options
    : undefined;

  const getVerifCode = async () => {
    try {
      const user = firebase.auth().currentUser;
      const verificationId = await user.linkWithPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );
      setVerificationId(verificationId);
      alert("code has been sent");
    } catch (err) {
      console.log(err);
      alert("Try later");
    }
  };

  const confirmCode = async () => {
    try {
      await verificationId.confirm(verificationCode);
      db.collection("users")
        .doc(props.user.user.uid)
        .update({ phone_verified: true });
      props.navigation.navigate("HomeScreen");
    } catch (err) {
      alert(err);
      db.collection("users")
        .doc(props.user.user.uid)
        .update({ phone_verified: "pending" });
      props.navigation.navigate("HomeScreen");
      // alert("Try later");
    }
  };

  React.useEffect(() => {}, [props]);

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />

      <Text style={{ marginTop: 40 }}>Enter phone number</Text>
      <Input
        style={{ marginVertical: 10, fontSize: 17 }}
        placeholder="+91 999 999 9999"
        autoFocus
        autoCompleteType="tel"
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
      />
      <Button
        title="Send Verification Code"
        disabled={!phoneNumber}
        onPress={getVerifCode}
      />
      <Text style={{ marginTop: 20 }}>Enter Verification code</Text>
      <Input
        style={{ marginVertical: 10, fontSize: 17, borderColor: "black" }}
        editable={!!verificationId}
        placeholder="123456"
        onChangeText={setVerificationCode}
      />
      <Button
        title="Confirm Verification Code"
        disabled={!verificationId}
        onPress={confirmCode}
      />
      <Button
        title="Try later"
        onPress={() => props.navigation.navigate("HomeScreen")}
        containerStyle={{ marginTop: 10 }}
      />
    </View>
  );
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getUser }, dispatch);
};
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileAuth);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 30,
    backgroundColor: "#fff",
    // justifyContent: "space-between",
  },
});
