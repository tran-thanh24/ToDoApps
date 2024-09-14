import { ADD_TODO, DELETE_TODO, EDIT_TODO, SET_TODOS } from "./actions";

interface TodoState {
  todos: Array<{ id: number; todo: string }>;
}

const initialState: TodoState = {
  todos: [],
};

const todoReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, { id: Date.now(), todo: action.payload }],
      };
    case EDIT_TODO:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, todo: action.payload.updatedTodo }
            : todo
        ),
      };
    case DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case SET_TODOS:
      return {
        ...state,
        todos: Array.isArray(action.payload) ? action.payload : [],
      };
    default:
      return state;
  }
};

export default todoReducer;
