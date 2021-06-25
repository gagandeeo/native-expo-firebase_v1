import {
  LOGIN,
  SIGNUP,
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  UPDATE_UID,
  LOGOUT,
} from "../actions/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  user: null,
  email: null,
  password: null,
  uid: null,
  token: AsyncStorage.getItem("token"),
};
const user = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      console.log("payloadDDDr", action.payload);
      AsyncStorage.setItem("token", action.payload.uid);
      return {
        // ...state,
        user: action.payload,
      };
    case SIGNUP:
      console.log("payloadDDDr", action.payload);

      AsyncStorage.setItem("token", action.payload.uid);

      return {
        ...state,
        user: action.payload,
      };
    case UPDATE_EMAIL:
      return { ...state, email: action.payload };
    case UPDATE_PASSWORD:
      return { ...state, password: action.payload };
    case UPDATE_UID:
      return { ...state, uid: action.payload };

    case LOGOUT:
      AsyncStorage.removeItem("token");
      return {
        user: null,
        email: null,
        password: null,
        uid: null,
        token: null,
      };
    default:
      return state;
  }
};

export default user;
