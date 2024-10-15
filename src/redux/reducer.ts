import {
  ADD_TODO_SUCCESS,
  EDIT_TODO_SUCCESS,
  DELETE_TODO_SUCCESS,
  ADD_TODO_OFFLINE,
  EDIT_TODO_OFFLINE,
  DELETE_TODO_OFFLINE,
  CLEAR_UNSYNCED_TODOS,
  CLEAR_UNSYNCED_EDITS,
  CLEAR_UNSYNCED_DELETES,
} from "../redux/actionType";
import { SET_TODOS } from "./actions";

// Định nghĩa state ban đầu
interface TodoState {
  todos: Array<{ id: number; todo: string; synced: boolean }>; // Thêm synced
  unsyncedTodos: Array<{ todo: string }>;
  unsyncedEdits: Array<{ id: number; updatedTodo: string }>;
  unsyncedDeletes: Array<number>;
}

const initialState: TodoState = {
  todos: [],
  unsyncedTodos: [],
  unsyncedEdits: [],
  unsyncedDeletes: [],
};

const todoReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_TODO_SUCCESS:
      return {
        ...state,
        todos: [...state.todos, { ...action.payload, synced: true }], // Thêm synced true khi online
      };
    case EDIT_TODO_SUCCESS:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, todo: action.payload.todo, synced: true } // Đồng bộ thành công
            : todo
        ),
      };
    case DELETE_TODO_SUCCESS:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case SET_TODOS:
      return {
        ...state,
        todos: Array.isArray(action.payload)
          ? action.payload.map((todo: any) => ({ ...todo, synced: true })) // Đồng bộ API khi tải về
          : [],
      };

    // Các hành động offline
    case ADD_TODO_OFFLINE:
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: Date.now(), todo: action.payload, synced: false },
        ],
        unsyncedTodos: [...state.unsyncedTodos, action.payload],
      };
    case EDIT_TODO_OFFLINE:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, todo: action.payload.updatedTodo, synced: false }
            : todo
        ),
        unsyncedEdits: [...state.unsyncedEdits, action.payload],
      };
    case DELETE_TODO_OFFLINE:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
        unsyncedDeletes: [...state.unsyncedDeletes, action.payload],
      };
    default:
      return state;
  }
};

export default todoReducer;
