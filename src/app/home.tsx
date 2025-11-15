import { View, Text, FlatList } from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { GroceryItem } from "@/types/GroceryItem";
import {
  deleteGrocery,
  getAllGrocery,
  insertGrocery,
  markBought,
} from "@/db/db";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect, useRouter } from "expo-router";
import GroceryItemCard from "@/components/GroceryItemCard";
import { Button, FAB, TextInput } from "react-native-paper";

const Home = () => {
  const db = useSQLiteContext();
  const router = useRouter();
  const [groceries, setGroceries] = useState<GroceryItem[]>([]);
  const [nameSearch, setNameSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [api, setApi] = useState("");
  const apiRef = useRef(null);

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

  const handleImportFromApi = async () => {
    if (!api) {
      setError("Please enter an API URL");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(api);
      if (!response.ok) throw new Error("Fetch API failed");
      const apiData: any[] = await response.json();
      const currentItems = await getAllGrocery(db);

      for (const item of apiData) {
        const exists = currentItems.some((g) => g.name === item.name);
        if (exists) continue;

        const newItem: GroceryItem = {
          id: 0,
          name: item.name,
          quantity: item.quantity,
          category: item.category,
          bought: item.bought ? 1 : 0,
          created_at: Date.now(),
        };

        await insertGrocery(db, newItem);
      }

      await handleFetchDb();
      setApi("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex flex-1">
      <View className="px-4 gap-4 my-2">
        <Text className="text-lg">Searching</Text>
        <TextInput
          label={"Name"}
          value={nameSearch}
          onChangeText={(value) => setNameSearch(value)}
        />
        <View className="mt-4 gap-4">
          <TextInput
            label={"API"}
            value={api}
            onChangeText={(value) => setApi(value)}
            ref={apiRef}
          />

          <Button
            mode="contained"
            onPress={handleImportFromApi}
            disabled={loading}
          >
            {loading ? "Loading..." : "Import từ API"}
          </Button>
          {error && <Text className="text-red-500 mt-2">{error}</Text>}
        </View>
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
      <FAB
        className="absolute bottom-3 right-3 rounded-full bg-green-500"
        icon={"plus"}
        color="white"
        onPress={() => router.navigate("/form")}
      ></FAB>
    </View>
  );
};

export default Home;
