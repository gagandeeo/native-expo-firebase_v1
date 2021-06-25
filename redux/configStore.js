import React from "react";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore } from "redux-persist";

import reducer from "./reducers";

const initialState = {};
const middlewares = [thunk];
const middlewareEnhancer = applyMiddleware(...middlewares);
const enhancer = [middlewareEnhancer];
const composedEnhancers = composeWithDevTools(...enhancer);
export const store = createStore(reducer, initialState, composedEnhancers);
export const persistor = persistStore(store);
// const middleware = applyMiddleware(thunkMiddleware);
// const store = createStore(reducer, middleware);

export default { store, persistor };
