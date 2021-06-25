import React from "react";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import HomeScreen from "../screens/HomeScreen";
import MobileAuth from "../screens/MobileAuth";

const SwitchNavigator = createSwitchNavigator(
  {
    Login: {
      screen: Login,
    },
    SignUp: {
      screen: SignUp,
    },
    MobileAuth: {
      screen: MobileAuth,
    },
    HomeScreen: {
      screen: HomeScreen,
    },
  },
  {
    initialRouteName: "Login",
  }
);

export default createAppContainer(SwitchNavigator);
