import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import todoReducer from "./reducer"; // Reducer chính cho todos
import rootSaga from "../api/saga"; // Root saga xử lý side effects

// Tạo saga middleware
const sagaMiddleware = createSagaMiddleware();

// Tạo store với reducer và middleware
const store = createStore(todoReducer, applyMiddleware(sagaMiddleware));

// Chạy root saga
sagaMiddleware.run(rootSaga);

export default store;

