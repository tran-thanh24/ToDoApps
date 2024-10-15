import React from "react";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import TodoList from "./src/screens/ToDoList";
import DetailScreen from "./src/screens/navigateApi/DetailScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ToDoList">
        <Stack.Screen name="ToDoList" component={TodoList} />
        <Stack.Screen name="DetailScreen" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const RootApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default RootApp;
