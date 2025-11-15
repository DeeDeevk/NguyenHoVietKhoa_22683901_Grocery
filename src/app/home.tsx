import { View, Text, FlatList } from "react-native";
import React, { useCallback, useState } from "react";
import { GroceryItem } from "@/types/GroceryItem";
import { getAllGrocery, markBought } from "@/db/db";
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

  const handleMark = async (id: number, currentBought: number) => {
    await markBought(db, id, currentBought);
    await handleFetchDb();
  };

  return (
    <View className="flex flex-1">
      <FlatList
        data={groceries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <GroceryItemCard
            data={item}
            onMark={() => handleMark(item.id, item.bought)}
          />
        )}
      />
    </View>
  );
};

export default Home;
