import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { FETCH_TODOS, setTodos } from '../redux/actions';

// Định nghĩa kiểu của một ToDo item
interface Todo {
  id: number;
  todo: string;
}

// Hàm để gọi API bằng Axios, chú thích kiểu trả về
const fetchTodosApi = (): Promise<{ data: Todo[] }> =>
  axios.get('https://5ee04f989ed06d001696dd93.mockapi.io/blocks');

// Saga để gọi API và xử lý kết quả
function* fetchTodosSaga(): Generator<any, void, { data: Todo[] }> {
  try {
    // Chú thích kiểu cho response
    const response = yield call(fetchTodosApi);
    // Giả sử dữ liệu trả về là danh sách todo
    yield put(setTodos(response.data));
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
}

export default function* rootSaga() {
  yield takeEvery(FETCH_TODOS, fetchTodosSaga);
}
