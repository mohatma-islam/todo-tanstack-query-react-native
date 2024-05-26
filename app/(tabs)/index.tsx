import {
  ActivityIndicator,
  Button,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Todo,
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../../data/api";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { useState } from "react";

export default function TabOneScreen() {
  // Access the client
  const queryClient = useQueryClient();

  // const [todo, setTodo] = useState({
  //   title: "",
  // });

  const [todo, setTodo] = useState("");

  // Queries
  // const query = useQuery({ queryKey: ['todos'], queryFn: getTodos })
  const todosQuery = useQuery({ queryKey: ["todos"], queryFn: getTodos });

  console.log(todosQuery.data);

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: (data) => {
      console.log("Success: ", data);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const addMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: (data) => {
      console.log("Success: ", data);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const updateQueryClient = (updatedTodo: Todo) => {
    queryClient.setQueryData(["todos"], (data: any) => {
      return data.map((todo: Todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      );
    });
  };

  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: updateQueryClient,
  });

  const addTodo = () => {
    addMutation.mutate(todo);
  };

  // const editTodo = () =>{

  // }

  const renderTodo: ListRenderItem<Todo> = ({ item }) => {
    const deleteTodo = () => {
      deleteMutation.mutate(item.id);
    };

    const toggleDone = () => {
      updateMutation.mutate({ ...item, done: !item.done });
    };

    return (
      <View style={styles.todosContainer}>
        <Pressable onPress={toggleDone} style={styles.todo}>
          {item.done && (
            <Ionicons name="checkmark-circle" size={24} color="green" />
          )}
          {!item.done && (
            <Ionicons name="checkmark-circle-outline" size={24} color="green" />
          )}
          <Text style={styles.todoText}>{item.title}</Text>
          <View style={styles.todoAction}>
            <Ionicons
              name="create"
              size={24}
              color="orange"
              onPress={() => {}}
            />
            <Ionicons name="trash" size={24} color="red" onPress={deleteTodo} />
          </View>
        </Pressable>
      </View>
    );
  };

  // Filter todos into incomplete and completed lists
  const incompleteTodos =
    todosQuery.data?.filter((todo: Todo) => !todo.done) || [];
  const completedTodos =
    todosQuery.data?.filter((todo: Todo) => todo.done) || [];

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          placeholder="Add Todo"
          onChangeText={setTodo}
          value={todo}
          style={styles.input}
        />
        <Button title="Add" onPress={addTodo} />
      </View>
      {todosQuery.isLoading ? <ActivityIndicator /> : null}
      {todosQuery.isError ? <Text>Coudn't load todos</Text> : null}
      <FlatList
        data={incompleteTodos}
        renderItem={renderTodo}
        keyExtractor={(item) => item.id.toString()}
      />
      {completedTodos.length > 0 && (
        <Text style={styles.completedTitle}>Completed</Text>
      )}
      <FlatList
        data={completedTodos}
        renderItem={renderTodo}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  todosContainer: {
    flexDirection: "row",
    alignContent: "center",
    padding: 10,
    gap: 10,
    marginVertical: 4,
    // backgroundColor: "#fff",
  },

  todo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  todoText: {
    flex: 1,
    paddingHorizontal: 10,
  },

  todoAction: {
    flexDirection: "row",
    gap: 20,
  },

  form: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
  },

  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#ccc",
    padding: 10,
    backgroundColor: "#fff",
  },
  completedTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
    padding: 10
  },
});
