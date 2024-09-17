import { call, put, takeEvery, select } from "redux-saga/effects";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
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
import { FETCH_TODOS, setTodos } from "../redux/actions";

interface Todo {
  id: number;
  todo: string;
}

interface FetchTodosResponse {
  data: Todo[];
}

interface AddTodoResponse {
  data: Todo;
}

// Fetch todos
const fetchTodosApi = (): Promise<FetchTodosResponse> =>
  axios.get("https://5ee04f989ed06d001696dd93.mockapi.io/todo");

// Add todo
const addTodoApi = (todo: string): Promise<AddTodoResponse> =>
  axios.post("https://5ee04f989ed06d001696dd93.mockapi.io/todo", { todo });

// Edit todo
const editTodoApi = (
  id: number,
  updatedTodo: string
): Promise<AddTodoResponse> =>
  axios.put(`https://5ee04f989ed06d001696dd93.mockapi.io/todo/${id}`, {
    todo: updatedTodo,
  });

// Delete todo
const deleteTodoApi = (id: number): Promise<void> =>
  axios.delete(`https://5ee04f989ed06d001696dd93.mockapi.io/todo/${id}`);

//Tải todos từ AsyncStorage
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

//Lưu todos vào AsyncStorage
function* saveTodosToStorage(todos: any[]) {
  try {
    yield call([AsyncStorage, "setItem"], "todos", JSON.stringify(todos));
  } catch (error) {
    console.error("Error saving todos to AsyncStorage:", error);
  }
}

// Saga để fetch todos từ API
function* fetchTodosSaga(): Generator<any, void, { data: any[] }> {
  try {
    const response = yield call(fetchTodosApi);
    console.log("Fetched todos:", response.data);
    yield put(setTodos(response.data));
    yield call(saveTodosToStorage, response.data);
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
}

// Saga để thêm mới todo
function* addTodoSaga(action: any): Generator<any, void, { data: any }> {
  try {
    const response = yield call(addTodoApi, action.payload);
    console.log("Todo added:", response.data);
    yield put({ type: ADD_TODO_SUCCESS, payload: response.data });
    const todos: Todo[] = yield select((state: any) => state.todos);
    yield call(saveTodosToStorage, [...todos, response.data]);
  } catch (error) {
    yield put({ type: ADD_TODO_FAILURE, payload: error.message });
  }
}

// Saga để sửa todo
function* editTodoSaga(action: any): Generator<any, void, { data: any }> {
  try {
    const response = yield call(
      editTodoApi,
      action.payload.id,
      action.payload.updatedTodo
    );
    console.log("Todo edit:", response.data);
    yield put({ type: EDIT_TODO_SUCCESS, payload: response.data });

    const todos: Todo[] = yield select((state: any) => state.todos);
    const updatedTodo = todos.map((todo: Todo) =>
      todo.id === response.data.id ? response.data : todo
    );
    yield call(saveTodosToStorage, updatedTodo);
  } catch (error) {
    yield put({ type: EDIT_TODO_FAILURE, payload: error.message });
  }
}

// Saga để xóa todo
function* deleteTodoSaga(action: any): Generator<any, void, void> {
  try {
    yield call(deleteTodoApi, action.payload);
    yield put({ type: DELETE_TODO_SUCCESS, payload: action.payload });
    const todos: Todo[] = yield select((state: any) => state.todos);
    const updatedTodo = todos.filter(
      (todo: Todo) => todo.id !== action.payload
    );
    yield call(saveTodosToStorage, updatedTodo);
    console.log("Todo delete:", action.data);
  } catch (error) {
    yield put({ type: DELETE_TODO_FAILURE, payload: error.message });
  }
}

// Root saga
export default function* rootSaga() {
  yield takeEvery(FETCH_TODOS, fetchTodosSaga);
  yield takeEvery(ADD_TODO_REQUEST, addTodoSaga);
  yield takeEvery(EDIT_TODO_REQUEST, editTodoSaga);
  yield takeEvery(DELETE_TODO_REQUEST, deleteTodoSaga);
}
