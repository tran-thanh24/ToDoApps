export const ADD_TODO = 'ADD_TODO';
export const EDIT_TODO = 'EDIT_TODO';
export const DELETE_TODO = 'DELETE_TODO';
export const FETCH_TODOS = 'FETCH_TODOS';
export const SET_TODOS = 'SET_TODOS';

export const addTodo = (todo: string) => ({
    type: ADD_TODO,
    payload: todo,
});

export const editTodo = (id: number, updatedTodo: String) => ({
    type: EDIT_TODO,
    payload: {id, updatedTodo},
});

export const deleteTodo = (id: number) => ({
    type: DELETE_TODO,
    payload: id,
});

export const fetchTodos = () => ({
    type: FETCH_TODOS,
});

export const setTodos = (todos: Array<{id: number; todo: string}>) => ({
    type: SET_TODOS,
    payload: todos,
});
