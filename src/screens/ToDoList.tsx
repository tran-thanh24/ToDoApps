import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Button,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchTodos, addTodo, editTodo, deleteTodo } from "../redux/actions";
import { styles } from "./style";

const ToDoList = ({ navigation }) => {
  const [task, setTask] = useState("");
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const dispatch = useDispatch();
  const todos = useSelector((state: any) => state.todos);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddOrEditTask = () => {
    if (editTaskId !== null) {
      dispatch(editTodo(editTaskId, task));
      setEditTaskId(null);
    } else {
      dispatch(addTodo(task));
    }
    setTask("");
  };

  const handleEditTask = (id: number, task: string) => {
    setTask(task);
    setEditTaskId(id);
  };

  const handleDeleteTask = (id: number) => {
    dispatch(deleteTodo(id));
  };

  return (
    <SafeAreaView>
      <View style={{ marginHorizontal: 16 }}>
        <TextInput
          style={styles.input}
          placeholder="Add a task"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.button} onPress={handleAddOrEditTask}>
          <Text style={styles.buttonText}>
            {editTaskId !== null ? "EDIT" : "ADD"}
          </Text>
        </TouchableOpacity>
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskContainer}>
              <Text>{item.todo}</Text>
              <TouchableOpacity
                onPress={() => handleEditTask(item.id, item.todo)}
              >
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <TouchableOpacity
          style={styles.buttonNext}
          onPress={() => navigation.navigate("DetailScreen", { todos })}
        >
          <Text style={styles.buttonEdit}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ToDoList;
