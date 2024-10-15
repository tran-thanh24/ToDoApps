import React from "react";
import { FlatList, Text, View } from "react-native";
import { styles } from "./style";

const DetailScreen = ({ route }) => {
  const { todos } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách:</Text>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.todo}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default DetailScreen;
