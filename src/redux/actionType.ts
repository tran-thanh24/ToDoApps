// Action types cho Todo
export const ADD_TODO_REQUEST = "ADD_TODO_REQUEST";
export const ADD_TODO_SUCCESS = "ADD_TODO_SUCCESS";
export const ADD_TODO_FAILURE = "ADD_TODO_FAILURE";

export const EDIT_TODO_REQUEST = "EDIT_TODO_REQUEST";
export const EDIT_TODO_SUCCESS = "EDIT_TODO_SUCCESS";
export const EDIT_TODO_FAILURE = "EDIT_TODO_FAILURE";

export const DELETE_TODO_REQUEST = "DELETE_TODO_REQUEST";
export const DELETE_TODO_SUCCESS = "DELETE_TODO_SUCCESS";
export const DELETE_TODO_FAILURE = "DELETE_TODO_FAILURE";

// Action types cho quản lý offline
export const ADD_TODO_OFFLINE = "ADD_TODO_OFFLINE";
export const EDIT_TODO_OFFLINE = "EDIT_TODO_OFFLINE";
export const DELETE_TODO_OFFLINE = "DELETE_TODO_OFFLINE";

// Action types để xóa todos chưa đồng bộ sau khi đồng bộ thành công
export const CLEAR_UNSYNCED_TODOS = "CLEAR_UNSYNCED_TODOS";
export const CLEAR_UNSYNCED_EDITS = "CLEAR_UNSYNCED_EDITS";
export const CLEAR_UNSYNCED_DELETES = "CLEAR_UNSYNCED_DELETES";
