import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  taskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  editButton: {
    color: "blue",
  },
  deleteButton: {
    color: "red",
  },
});
