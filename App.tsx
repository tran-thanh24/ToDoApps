import React from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import TodoList from './src/screens/ToDoList'; // Import component TodoList

const App = () => {
  return (
    <View>
      <TodoList />
    </View>
  );
};

const RootApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default RootApp;
