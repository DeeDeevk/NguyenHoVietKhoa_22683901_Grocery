import { View, Text, FlatList } from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import { GroceryItem } from "@/types/GroceryItem";
import { deleteGrocery, getAllGrocery, markBought } from "@/db/db";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import GroceryItemCard from "@/components/GroceryItemCard";
import { TextInput } from "react-native-paper";

const Home = () => {
  const db = useSQLiteContext();
  const [groceries, setGroceries] = useState<GroceryItem[]>([]);
  const [nameSearch, setNameSearch] = useState("");

  const handleFetchDb = async () => {
    await getAllGrocery(db).then((res) => setGroceries(res));
  };

  useFocusEffect(
    useCallback(() => {
      handleFetchDb();
    }, [])
  );

  const handleMark = async (id: number, currentBought: number) => {
    await markBought(db, id, currentBought);
    await handleFetchDb();
  };

  const handleDelete = async (id: number) => {
    await deleteGrocery(db, id).then(() => handleFetchDb());
  };

  const filteredGroceries = useMemo(() => {
    return groceries.filter((item) =>
      item.name.toLowerCase().includes(nameSearch.toLocaleLowerCase())
    );
  }, [db, groceries, nameSearch]);

  return (
    <View className="flex flex-1">
      <View className="px-4 gap-4 my-2">
        <Text className="text-lg">Searching</Text>
        <TextInput
          label={"Name"}
          value={nameSearch}
          onChangeText={(value) => setNameSearch(value)}
        />
      </View>

      <FlatList
        data={filteredGroceries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <GroceryItemCard
            data={item}
            onMark={() => handleMark(item.id, item.bought)}
            onDelete={handleDelete}
          />
        )}
      />
    </View>
  );
};

export default Home;
