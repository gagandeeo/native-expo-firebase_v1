import "react-native-gesture-handler";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SwitchNavigator from "./navigation/SwitchNavigator";
import { Provider } from "react-redux";
import { store } from "./redux/configStore";
import MobileAuth from "./screens/MobileAuth";
import HomeScreen from "./screens/HomeScreen";

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <SwitchNavigator />
        {/* <HomeScreen /> */}
        {/* <MobileAuth /> */}
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#649C1B",
  },
});
