import { call, put, takeEvery, select, fork, take } from "redux-saga/effects";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import { eventChannel } from "redux-saga";
import {
  ADD_TODO_REQUEST,
  EDIT_TODO_REQUEST,
  DELETE_TODO_REQUEST,
  ADD_TODO_SUCCESS,
  EDIT_TODO_SUCCESS,
  DELETE_TODO_SUCCESS,
  ADD_TODO_FAILURE,
  EDIT_TODO_FAILURE,
  DELETE_TODO_FAILURE,
  ADD_TODO_OFFLINE,
  EDIT_TODO_OFFLINE,
  DELETE_TODO_OFFLINE,
  CLEAR_UNSYNCED_TODOS,
  CLEAR_UNSYNCED_EDITS,
  CLEAR_UNSYNCED_DELETES,
} from "../redux/actionType";
import { FETCH_TODOS, setTodos } from "../redux/actions";

// API functions
const fetchTodosApi = (): Promise<any> =>
  axios.get("https://5ee04f989ed06d001696dd93.mockapi.io/todo");

const addTodoApi = (todo: string): Promise<any> =>
  axios.post("https://5ee04f989ed06d001696dd93.mockapi.io/todo", { todo });

const editTodoApi = (id: number, updatedTodo: string): Promise<any> =>
  axios.put(`https://5ee04f989ed06d001696dd93.mockapi.io/todo/${id}`, {
    todo: updatedTodo,
  });

const deleteTodoApi = (id: number): Promise<void> =>
  axios.delete(`https://5ee04f989ed06d001696dd93.mockapi.io/todo/${id}`);

// Lưu todos vào AsyncStorage
function* saveTodosToStorage(todos: any[]) {
  try {
    yield call([AsyncStorage, "setItem"], "todos", JSON.stringify(todos));
  } catch (error) {
    console.error("Error saving todos to AsyncStorage:", error);
  }
}

// Tải todos từ AsyncStorage
function* loadTodosFromStorage() {
  try {
    const todos = yield call([AsyncStorage, "getItem"], "todos");
    if (todos) {
      yield put(setTodos(JSON.parse(todos)));
    }
  } catch (error) {
    console.error("Error loading todos from AsyncStorage:", error);
  }
}

// Fetch todos từ API hoặc AsyncStorage
function* fetchTodosSaga(): Generator<any, void, { data: any[] }> {
  try {
    const state = yield call(NetInfo.fetch);
    const isConnected = state.isConnected;
    if (isConnected) {
      const response = yield call(fetchTodosApi);
      yield put(setTodos(response.data));
      yield call(saveTodosToStorage, response.data);
    } else {
      yield call(loadTodosFromStorage);
    }
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
}

// Saga để thêm mới todo
function* addTodoSaga(action: any): Generator<any, void, { data: any }> {
  try {
    const state = yield call(NetInfo.fetch);
    const isConnected = state.isConnected;
    if (isConnected) {
      const response = yield call(addTodoApi, action.payload);
      yield put({ type: ADD_TODO_SUCCESS, payload: response.data });
      const todos: any[] = yield select((state: any) => state.todos);
      yield call(saveTodosToStorage, [...todos, response.data]);
    } else {
      console.log("Không có mạng, lưu todo vào Redux và AsyncStorage");
      const unsyncedTodos = yield select(
        (state: any) => state.unsyncedTodos || []
      );
      yield put({ type: ADD_TODO_OFFLINE, payload: action.payload });
      const updatedUnsyncedTodos = [...unsyncedTodos, { todo: action.payload }];
      yield call(
        [AsyncStorage, "setItem"],
        "unsyncedTodos",
        JSON.stringify(updatedUnsyncedTodos)
      );
      console.log("Đã lưu todo vào AsyncStorage:", updatedUnsyncedTodos);
    }
  } catch (error) {
    console.error("Error adding todo:", error.message);
    yield put({ type: ADD_TODO_FAILURE, payload: error.message });
  }
}

// Saga để sửa todo
function* editTodoSaga(action: any): Generator<any, void, { data: any }> {
  try {
    const state = yield call(NetInfo.fetch);
    const isConnected = state.isConnected;
    if (isConnected) {
      const response = yield call(
        editTodoApi,
        action.payload.id,
        action.payload.updatedTodo
      );
      yield put({ type: EDIT_TODO_SUCCESS, payload: response.data });
      const todos: any[] = yield select((state: any) => state.todos);
      const updatedTodos = todos.map((todo) =>
        todo.id === action.payload.id ? response.data : todo
      );
      yield call(saveTodosToStorage, updatedTodos);
    } else {
      console.log("Không có mạng, lưu todo vào Redux và AsyncStorage");
      const unsyncedEdits = yield select(
        (state: any) => state.unsyncedEdits || []
      );
      yield put({ type: EDIT_TODO_OFFLINE, payload: action.payload });
      const todos: any[] = yield select((state: any) => state.todos);
      const updatedTodos = todos.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, todo: action.payload.updatedTodo }
          : todo
      );
      yield call(saveTodosToStorage, updatedTodos);
      const updatedUnsyncedEdits = [...unsyncedEdits, action.payload];
      yield call(
        [AsyncStorage, "setItem"],
        "unsyncedEdits",
        JSON.stringify(updatedUnsyncedEdits)
      );
      console.log("Đã lưu todo vào AsyncStorage:", updatedUnsyncedEdits);
    }
  } catch (error) {
    console.error("Error edit todo:", error.message);
    yield put({ type: EDIT_TODO_FAILURE, payload: error.message });
  }
}

// Saga để xóa todo
function* deleteTodoSaga(action: any): Generator<any, void, void> {
  try {
    const state = yield call(NetInfo.fetch);
    const isConnected = state.isConnected;
    if (isConnected) {
      yield call(deleteTodoApi, action.payload);
      yield put({ type: DELETE_TODO_SUCCESS, payload: action.payload });
      const todos: any[] = yield select((state: any) => state.todos);
      const updatedTodos = todos.filter((todo) => todo.id !== action.payload);
      yield call(saveTodosToStorage, updatedTodos);
    } else {
      console.log("Không có mạng, lưu todo vào Redux và AsyncStorage");
      const unsyncedDeletes = yield select(
        (state: any) => state.unsyncedDeletes || []
      );
      yield put({ type: DELETE_TODO_OFFLINE, payload: action.payload });
      const todos: any[] = yield select((state: any) => state.todos);
      const updatedTodos = todos.filter((todo) => todo.id !== action.payload);
      yield call(saveTodosToStorage, updatedTodos);
      const updatedUnsyncedDeletes = [...unsyncedDeletes, action.payload];
      yield call(
        [AsyncStorage, "setItem"],
        "unsyncedDeletes",
        JSON.stringify(updatedUnsyncedDeletes)
      );
      console.log("Đã lưu todo vào AsyncStorage:", updatedUnsyncedDeletes);
    }
  } catch (error) {
    console.error("Error delete todo:", error.message);
    yield put({ type: DELETE_TODO_FAILURE, payload: error.message });
  }
}

// Saga để đồng bộ todos chưa được gửi khi có mạng trở lại
function* syncTodosSaga(): Generator<any, void, void> {
  try {
    const unsyncedTodos = yield select(
      (state: any) => state.unsyncedTodos || []
    );

    for (const todo of unsyncedTodos) {
      console.log("Syncing todo:", todo);
      const response = yield call(addTodoApi, todo.todo);
      yield put({ type: ADD_TODO_SUCCESS, payload: response.data });
    }

    const unsyncedEdits = yield select((state: any) => state.unsyncedEdits);
    for (const edit of unsyncedEdits) {
      console.log("Syncing edit:", edit);
      const response = yield call(editTodoApi, edit.id, edit.updatedTodo);
      yield put({ type: EDIT_TODO_SUCCESS, payload: response.data });
    }

    const unsyncedDeletes = yield select((state: any) => state.unsyncedDeletes);
    for (const id of unsyncedDeletes) {
      console.log("Syncing delete for id:", id);
      yield call(deleteTodoApi, id);
      yield put({ type: DELETE_TODO_SUCCESS, payload: id });
    }

    // Sau khi đồng bộ xong thì xóa các todos chưa đồng bộ
    yield put({ type: CLEAR_UNSYNCED_TODOS });
    yield put({ type: CLEAR_UNSYNCED_EDITS });
    yield put({ type: CLEAR_UNSYNCED_DELETES });
  } catch (error) {
    console.error("Error syncing todos:", error);
  }
}

// Theo dõi trạng thái mạng
function createNetInfoChannel() {
  return eventChannel((emit) => {
    const unsubscribe = NetInfo.addEventListener((state) =>
      emit(state.isConnected)
    );
    return unsubscribe;
  });
}

function* networkStatusWatcher() {
  const netInfoChannel = yield call(createNetInfoChannel);
  try {
    while (true) {
      const isConnected = yield take(netInfoChannel);
      if (isConnected) {
        yield call(syncTodosSaga);
      }
    }
  } finally {
    netInfoChannel.close();
  }
}

// Root saga
export default function* rootSaga() {
  yield takeEvery(FETCH_TODOS, fetchTodosSaga);
  yield takeEvery(ADD_TODO_REQUEST, addTodoSaga);
  yield takeEvery(EDIT_TODO_REQUEST, editTodoSaga);
  yield takeEvery(DELETE_TODO_REQUEST, deleteTodoSaga);
  yield fork(networkStatusWatcher);
}
