import { View, Text, FlatList } from "react-native";
import React, { useCallback, useState } from "react";
import { GroceryItem } from "@/types/GroceryItem";
import { getAllGrocery } from "@/db/db";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import GroceryItemCard from "@/components/GroceryItemCard";

const Home = () => {
  const db = useSQLiteContext();
  const [groceries, setGroceries] = useState<GroceryItem[]>([]);

  const handleFetchDb = async () => {
    await getAllGrocery(db).then((res) => setGroceries(res));
  };

  useFocusEffect(
    useCallback(() => {
      handleFetchDb();
    }, [])
  );

  return (
    <View className="flex flex-1">
      <FlatList
        data={groceries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <GroceryItemCard data={item} />}
      />
    </View>
  );
};

export default Home;
