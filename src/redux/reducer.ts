import {
  ADD_TODO_SUCCESS,
  EDIT_TODO_SUCCESS,
  DELETE_TODO_SUCCESS,
} from "../redux/actionType";
import { SET_TODOS } from "./actions";
// Định nghĩa state ban đầu
interface TodoState {
  todos: Array<{ id: number; todo: string }>;
}

const initialState: TodoState = {
  todos: [],
};

const todoReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_TODO_SUCCESS:
      return {
        ...state,
        todos: [...state.todos, action.payload], // Thêm mới todo vào danh sách
      };
    case EDIT_TODO_SUCCESS:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, todo: action.payload.todo } // Cập nhật todo khi sửa thành công
            : todo
        ),
      };
    case DELETE_TODO_SUCCESS:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload), // Loại bỏ todo khi xóa
      };
    case SET_TODOS:
      return {
        ...state,
        todos: Array.isArray(action.payload) ? action.payload : [], // Cập nhật danh sách todos từ API
      };
    default:
      return state;
  }
};

export default todoReducer;
