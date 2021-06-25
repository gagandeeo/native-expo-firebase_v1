import React from "react";
import { View, StyleSheet, KeyboardAvoidingView, Text } from "react-native";
import { Input, Button, Image } from "react-native-elements";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  updateEmail,
  updatePassword,
  signup,
  signInWithGoogleAsync,
  signUpWithFacebook,
} from "../redux/actions/users";
import { ActivityIndicator } from "react-native";

import { AntDesign } from "@expo/vector-icons";

const SignUp = (props) => {
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");

  const signupWithFacebook = () => {
    props.signUpWithFacebook(props.navigation);
  };

  const handleSignUp = () => {
    if (props.user.password === password) {
      const data = {
        email: props.user.email,
        password: props.user.password,
      };
      props.signup(data, props.navigation);
    } else {
      alert("Password Doesn't Match");
    }
  };
  const handleLoginWithGoogle = () => {
    props.signInWithGoogleAsync(props.navigation).then((res) => {
      if (res.token) {
        props.navigation.navigate("MobileAuth");
      }
    });
  };
  return (
    <KeyboardAvoidingView
      behavior="height"
      // keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      enabled={true}
      style={styles.container}
    >
      <View style={styles.inner__TopContainer}>
        <Image
          source={require("../assets/achievement.png")}
          style={{
            width: "60%",
            height: "75%",
            marginTop: "15%",
          }}
          PlaceholderContent={<ActivityIndicator />}
        />
      </View>
      <View style={styles.inner__BottomContainer}>
        <Text style={styles.header__TextStyle}>Sign Up</Text>
        <View style={styles.textInput}>
          <View
            style={{
              width: "50%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Input
              // value={name}
              onChangeText={(name) => setName(name)}
              placeholder="Name"
            />
            <Input
              value={props.user.email}
              onChangeText={(email) => props.updateEmail(email)}
              placeholder="Email"
              autoCapitalize="none"
            />
          </View>
          <Input
            // value={props.user.password}
            onChangeText={(password) => props.updatePassword(password)}
            placeholder="Password"
            secureTextEntry={true}
          />
          <Input
            // value={props.user.password}
            onChangeText={(password) => setPassword(password)}
            placeholder="Confirm Password"
            secureTextEntry={true}
          />
          <Button
            buttonStyle={styles.buttonStyle}
            containerStyle={styles.button__containerStyle}
            title="Get Started"
            onPress={handleSignUp}
          />
          <Text style={{ color: "grey", alignSelf: "center", marginTop: 15 }}>
            Or Sign Up with
          </Text>
          <View style={styles.thirdPartyConatiner}>
            <AntDesign
              onPress={handleLoginWithGoogle}
              name="google"
              size={32}
              color="green"
            />
            <AntDesign
              onPress={signupWithFacebook}
              name="facebook-square"
              size={32}
              color="#4267B2"
            />
            <AntDesign name="apple1" size={32} color="black" />
          </View>
          <Text style={{ alignSelf: "center", marginTop: 15 }}>
            Have an Account?
            <Text
              onPress={() => props.navigation.navigate("Login")}
              style={{ color: "green", fontWeight: "bold" }}
            >
              {"  "}
              Log In
            </Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      updateEmail,
      updatePassword,
      signup,
      signInWithGoogleAsync,
      signUpWithFacebook,
    },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#649C1B",
    justifyContent: "space-between",
  },
  inner__TopContainer: {
    flex: 0.3,
    // flexDirection: "row",
    // backgroundColor:""
  },
  inner__BottomContainer: {
    flex: 0.7,
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // alignItems: "center",
  },
  header__TextStyle: {
    alignSelf: "center",
    fontSize: 35,
    marginTop: 10,
    fontWeight: "bold",
    color: "#649C1B",
  },
  textInput: {
    flex: 1,
    marginTop: 20,
    paddingLeft: 30,
    paddingRight: 30,
    // alignSelf: "center",
    // alignItems: "center",
  },
  buttonStyle: {
    padding: 10,
    backgroundColor:
      "linear-gradient(175deg, rgba(119,185,33,1) 36%, rgba(1,3,0,1) 90%)",
    borderRadius: 8,
    borderBottomLeftRadius: 0,
  },
  inputBox: {
    width: "85%",
    margin: 10,
    padding: 15,
    fontSize: 16,
    borderColor: "#d3d3d3",
    borderBottomWidth: 1,
    textAlign: "center",
  },
  button: {
    marginTop: 30,
    marginBottom: 20,
    paddingVertical: 5,
    alignItems: "center",
    backgroundColor: "#FFA611",
    borderColor: "#FFA611",
    borderWidth: 1,
    borderRadius: 5,
    width: 200,
  },
  thirdPartyConatiner: {
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  buttonSignup: {
    fontSize: 12,
  },
});
