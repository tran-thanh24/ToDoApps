import React, { useEffect, useState } from "react";
import { Text, View, SafeAreaView, TextInput, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, addTodo, editTodo, deleteTodo } from "../redux/actions";
import { styles } from "./style";

const ToDoList = () => {
    const [task, setTask] = useState(''); // Quản lý trạng thái task mới hoặc sửa đổi
    const [editTaskId, setEditTaskId] = useState<number | null>(null); // Quản lý ID của task đang sửa
    const dispatch = useDispatch();
    const todos = useSelector((state: any) => state.todos); // Lấy danh sách todos từ Redux store
    
    // Lấy danh sách todos từ server khi component được render
    useEffect(() => {
        dispatch(fetchTodos());
    }, [dispatch]);

    const handleAddOrEditTask = () => {
        if (editTaskId !== null) {
            dispatch(editTodo(editTaskId, task)); // Sửa task
            setEditTaskId(null); // Sau khi sửa, reset trạng thái
        } else {
            dispatch(addTodo(task)); // Thêm task mới
        }
        setTask(''); // Reset input sau khi thêm hoặc sửa
    };

    const handleEditTask = (id: number, task: string) => {
        setTask(task); // Hiển thị nội dung task cần sửa trong TextInput
        setEditTaskId(id); // Ghi nhớ ID của task đang sửa
    };

    const handleDeleteTask = (id: number) => {
        dispatch(deleteTodo(id)); // Xóa task
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
                        {editTaskId !== null ? 'EDIT' : 'ADD'}
                    </Text>
                </TouchableOpacity>
                <FlatList
                    data={todos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.taskContainer}>
                            <Text>{item.todo}</Text>
                            <TouchableOpacity onPress={() => handleEditTask(item.id, item.todo)}>
                                <Text style={styles.editButton}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                                <Text style={styles.deleteButton}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

export default ToDoList;