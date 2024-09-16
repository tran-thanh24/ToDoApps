import {
  ADD_TODO_REQUEST,
  EDIT_TODO_REQUEST,
  DELETE_TODO_REQUEST,
} from "./actionType";
export const FETCH_TODOS = "FETCH_TODOS";
export const SET_TODOS = "SET_TODOS";

// Thêm mới todo
export const addTodo = (todo: string) => ({
  type: ADD_TODO_REQUEST,
  payload: todo,
});

// Sửa todo
export const editTodo = (id: number, updatedTodo: string) => ({
  type: EDIT_TODO_REQUEST,
  payload: { id, updatedTodo },
});

// Xóa todo
export const deleteTodo = (id: number) => ({
  type: DELETE_TODO_REQUEST,
  payload: id,
});

// Lấy danh sách todos
export const fetchTodos = () => ({
  type: FETCH_TODOS,
});

// Cập nhật danh sách todos
export const setTodos = (todos: Array<{ id: number; todo: string }>) => ({
  type: SET_TODOS,
  payload: todos,
});
