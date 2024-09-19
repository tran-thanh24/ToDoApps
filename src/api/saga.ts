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
} from "../redux/actionType";
import {FETCH_TODOS,
  setTodos,} from '../redux/actions'

// Fetch todos từ API
const fetchTodosApi = (): Promise<any> =>
  axios.get("https://5ee04f989ed06d001696dd93.mockapi.io/todo");

// Add todo
const addTodoApi = (todo: string): Promise<any> =>
  axios.post("https://5ee04f989ed06d001696dd93.mockapi.io/todo", { todo });

// Edit todo
const editTodoApi = (id: number, updatedTodo: string): Promise<any> =>
  axios.put(`https://5ee04f989ed06d001696dd93.mockapi.io/todo/${id}`, {
    todo: updatedTodo,
  });

// Delete todo
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
    const isConnected = yield call(NetInfo.fetch);
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
    const isConnected = yield call(NetInfo.fetch);
    if (isConnected) {
      const response = yield call(addTodoApi, action.payload);
      yield put({ type: ADD_TODO_SUCCESS, payload: response.data });
      const todos: any[] = yield select((state: any) => state.todos);
      yield call(saveTodosToStorage, [...todos, response.data]);
    } else {
      // Lưu todo chưa đồng bộ vào AsyncStorage
      const unsyncedTodos = yield call([AsyncStorage, "getItem"], "unsyncedTodos");
      const updatedUnsyncedTodos = unsyncedTodos ? JSON.parse(unsyncedTodos) : [];
      updatedUnsyncedTodos.push({ todo: action.payload });
      yield call([AsyncStorage, "setItem"], "unsyncedTodos", JSON.stringify(updatedUnsyncedTodos));
    }
  } catch (error) {
    yield put({ type: ADD_TODO_FAILURE, payload: error.message });
  }
}

// Saga để sửa todo
function* editTodoSaga(action: any): Generator<any, void, { data: any }> {
  try {
    const isConnected = yield call(NetInfo.fetch);
    if (isConnected) {
      const response = yield call(editTodoApi, action.payload.id, action.payload.updatedTodo);
      yield put({ type: EDIT_TODO_SUCCESS, payload: response.data });
      const todos: any[] = yield select((state: any) => state.todos);
      const updatedTodos = todos.map(todo =>
        todo.id === action.payload.id ? response.data : todo
      );
      yield call(saveTodosToStorage, updatedTodos);
    } else {
      // Lưu todo chưa được sửa vào AsyncStorage để đồng bộ sau
      const unsyncedEdits = yield call([AsyncStorage, "getItem"], "unsyncedEdits");
      const updatedUnsyncedEdits = unsyncedEdits ? JSON.parse(unsyncedEdits) : [];
      updatedUnsyncedEdits.push(action.payload);
      yield call([AsyncStorage, "setItem"], "unsyncedEdits", JSON.stringify(updatedUnsyncedEdits));
    }
  } catch (error) {
    yield put({ type: EDIT_TODO_FAILURE, payload: error.message });
  }
}

// Saga để xóa todo
function* deleteTodoSaga(action: any): Generator<any, void, void> {
  try {
    const isConnected = yield call(NetInfo.fetch);
    if (isConnected) {
      yield call(deleteTodoApi, action.payload);
      yield put({ type: DELETE_TODO_SUCCESS, payload: action.payload });
      const todos: any[] = yield select((state: any) => state.todos);
      const updatedTodos = todos.filter(todo => todo.id !== action.payload);
      yield call(saveTodosToStorage, updatedTodos);
    } else {
      // Lưu todo chưa được xóa vào AsyncStorage để đồng bộ sau
      const unsyncedDeletes = yield call([AsyncStorage, "getItem"], "unsyncedDeletes");
      const updatedUnsyncedDeletes = unsyncedDeletes ? JSON.parse(unsyncedDeletes) : [];
      updatedUnsyncedDeletes.push(action.payload);
      yield call([AsyncStorage, "setItem"], "unsyncedDeletes", JSON.stringify(updatedUnsyncedDeletes));
    }
  } catch (error) {
    yield put({ type: DELETE_TODO_FAILURE, payload: error.message });
  }
}

// Đồng bộ todos chưa được gửi khi có mạng trở lại
function* syncTodosSaga(): Generator<any, void, void> {
  try {
    // Đồng bộ thêm todos
    const unsyncedTodos = yield call([AsyncStorage, "getItem"], "unsyncedTodos");
    if (unsyncedTodos) {
      const todosToSync = JSON.parse(unsyncedTodos);
      for (const todo of todosToSync) {
        yield call(addTodoApi, todo.todo);
      }
      // Xóa danh sách todos chưa đồng bộ sau khi đồng bộ thành công
      yield call([AsyncStorage, "removeItem"], "unsyncedTodos");
    }

    // Đồng bộ sửa todos
    const unsyncedEdits = yield call([AsyncStorage, "getItem"], "unsyncedEdits");
    if (unsyncedEdits) {
      const editsToSync = JSON.parse(unsyncedEdits);
      for (const edit of editsToSync) {
        yield call(editTodoApi, edit.id, edit.updatedTodo);
      }
      yield call([AsyncStorage, "removeItem"], "unsyncedEdits");
    }

    // Đồng bộ xóa todos
    const unsyncedDeletes = yield call([AsyncStorage, "getItem"], "unsyncedDeletes");
    if (unsyncedDeletes) {
      const deletesToSync = JSON.parse(unsyncedDeletes);
      for (const id of deletesToSync) {
        yield call(deleteTodoApi, id);
      }
      yield call([AsyncStorage, "removeItem"], "unsyncedDeletes");
    }
  } catch (error) {
    console.error("Error syncing todos:", error);
  }
}

// Theo dõi trạng thái mạng để đồng bộ khi có mạng
function createNetInfoChannel() {
  return eventChannel((emit) => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      emit(state.isConnected);
    });
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
