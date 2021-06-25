// import Firebase from "../../config";
import React from "react";
import {
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  LOGIN,
  SIGNUP,
  UPDATE_UID,
  LOGOUT,
} from "./types";
import Firebase, { db } from "../../config/Firebase";
import * as Google from "expo-google-app-auth";
import firebase from "firebase";
import * as Facebook from "expo-facebook";
import { FACEBOOK_APP_ID } from "@env";

export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};

export const updateUid = (uid) => {
  return {
    type: UPDATE_UID,
    payload: uid,
  };
};

export const updateEmail = (email) => {
  return {
    type: UPDATE_EMAIL,
    payload: email,
  };
};

export const updatePassword = (password) => {
  return {
    type: UPDATE_PASSWORD,
    payload: password,
  };
};

export const getUser = (uid) => {
  return async (dispatch) => {
    try {
      console.log("uid--->", uid);
      const user = await db.collection("users").doc(uid).get();

      // console.log(user.data());
      dispatch({ type: LOGIN, payload: user.data() });
    } catch (e) {
      alert(e);
    }
  };
};

export const login = (data, navigation) => {
  return async (dispatch) => {
    try {
      const { email, password } = data;
      const response = await Firebase.auth().signInWithEmailAndPassword(
        email,
        password
      );
      dispatch(getUser(response.user.uid));
      navigation.navigate("HomeScreen");
    } catch (e) {
      alert(e);
    }
  };
};

export const signup = (data, navigation) => {
  return async (dispatch) => {
    try {
      const { email, password } = data;
      const response = await Firebase.auth().createUserWithEmailAndPassword(
        email,
        password
      );
      if (response.user.uid) {
        const user = {
          uid: response.user.uid,
          email: email,
          phone_verified: false,
        };

        db.collection("users").doc(response.user.uid).set(user);
        // dispatch(updateUid(response.user.uid));
        dispatch({ type: SIGNUP, payload: user });
        navigation.navigate("MobileAuth");
      }
    } catch (e) {
      alert(e);
    }
  };
};

const isUserEqual = (googleUser, firebaseUser) => {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData;
    for (var i = 0; i < providerData.length; i++) {
      if (
        providerData[i].providerId ===
          firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
        providerData[i].uid === googleUser.user.id
      ) {
        // We don't need to reauth the Firebase connection.
        return true;
      }
    }
  }
  return false;
};

const onSignIn = (googleUser) => (dispatch) => {
  // console.log("Google Auth Response", googleUser);
  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
    unsubscribe();
    // Check if we are already signed-in Firebase with the correct user.
    // if (!isUserEqual(googleUser, firebaseUser)) {
    // Build Firebase credential with the Google ID token.
    var credential = firebase.auth.GoogleAuthProvider.credential(
      googleUser.idToken,
      googleUser.accessToken
    );
    // Sign in with credential from the Google user.
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(async (response) => {
        const user = {
          email: response.user.email,
          uid: response.user.uid,
          phone_verified: false,
          created_at: Date.now(),
        };
        if (response.additionalUserInfo.isNewUser) {
          // console.log(user);
          // dispatch(updateUid(response.user.uid));
          await db
            .collection("users")
            .doc(user.uid)
            .set(user)
            .then((res) => {
              dispatch({ type: SIGNUP, payload: user });
            });
          // dispatch(updateEmail(user.email));
        } else {
          await db
            .collection("users")
            .doc(user.uid)
            .update({ last_logged_in: Date.now() })
            .then((res) => {
              dispatch({ type: LOGIN, payload: user });
            });
        }
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    // }
    // else {
    //   // console.log("Already")
    //   console.log("User already signed-in Firebase.");
    //   console.log("UID", userUid);
    // }
  });
};

export const signInWithGoogleAsync = (navigation) => {
  return async (dispatch) => {
    try {
      const result = await Google.logInAsync({
        androidClientId:
          "607149509929-p7t904vct18chl510otsud1ronf9q41i.apps.googleusercontent.com",
        scopes: ["profile", "email"],
        behavior: "system",
      });

      if (result.type === "success") {
        dispatch(onSignIn(result));
        return { token: result.accessToken, uid: result.user.uid };
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };
};

export const loginWithFacebook = (navigation) => {
  return async (dispatch) => {
    try {
      await Facebook.initializeAsync({
        appId: FACEBOOK_APP_ID,
      });

      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile", "email"],
      });
      if (type === "success") {
        const credentials =
          firebase.auth.FacebookAuthProvider.credential(token);
        firebase
          .auth()
          .signInWithCredential(credentials)
          .then((res) => {
            console.log(res.user);
            const user = {
              email: res.user.email,
              name: res.user.providerData[0].displayName,
              uid: res.user.uid,
              phone_verified: false,
            };
            db.collection("users")
              .doc(user.uid)
              .set(user)
              .then((res) => {
                dispatch({ type: LOGIN, payload: user });
              });
            // dispatch(updateEmail(user.email));
            navigation.navigate("HomeScreen");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
      alert("Try Again");
    }
  };
};

export const signUpWithFacebook = (navigation) => {
  return async (dispatch) => {
    try {
      await Facebook.initializeAsync({
        appId: FACEBOOK_APP_ID,
      });

      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile", "email"],
      });
      if (type === "success") {
        const credentials =
          firebase.auth.FacebookAuthProvider.credential(token);
        firebase
          .auth()
          .signInWithCredential(credentials)
          .then((res) => {
            // console.log(res.user);
            const user = {
              email: res.user.email,
              name: res.user.providerData[0].displayName,
              uid: res.user.uid,
              phone_verified: false,
            };
            db.collection("users")
              .doc(user.uid)
              .set(user)
              .then((res) => {
                dispatch({ type: SIGNUP, payload: user });
              });
            // dispatch(updateEmail(user.email));
            navigation.navigate("MobileAuth");
          })
          .catch((error) => {
            // console.log(error);
            alert("Try Again");
          });
      }
    } catch (error) {
      console.log(error);
      alert("Try Again");
    }
  };
};
