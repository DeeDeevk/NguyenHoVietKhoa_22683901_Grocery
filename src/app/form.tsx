import { View, Text } from "react-native";
import React, { useRef, useState } from "react";
import { Button, RadioButton, TextInput } from "react-native-paper";
import { GroceryItem } from "@/types/GroceryItem";
import { insertGrocery } from "@/db/db";
import { useSQLiteContext } from "expo-sqlite";
import { useRouter } from "expo-router";

const Form = () => {
  const db = useSQLiteContext();
  const router = useRouter();
  const [formData, setFormData] = useState<GroceryItem>({} as GroceryItem);
  const nameRef = useRef(null);
  const quantityRef = useRef(null);
  const categoryRef = useRef(null);

  const handleSave = async () => {
    if (!formData.name || !formData.quantity || !formData.category) return;

    await insertGrocery(db, formData);

    setFormData({} as GroceryItem);
    categoryRef.current?.clear();
    nameRef.current?.clear();
    quantityRef.current?.clear();
    router.replace("/home");
  };

  return (
    <View className="flex flex-1 justify-center items-center">
      <View className="w-full px-4 gap-4">
        <Text className="text-lg">New Grocery</Text>
        <TextInput
          label={"Name"}
          value={formData.name ?? ""}
          onChangeText={(value) => setFormData({ ...formData, name: value })}
          ref={nameRef}
        />
        <TextInput
          label={"Quantity"}
          value={formData.quantity ? formData.quantity.toString() : ""}
          keyboardType="number-pad"
          onChangeText={(value) =>
            setFormData({ ...formData, quantity: Number(value) })
          }
          ref={quantityRef}
        />
        <TextInput
          label={"Category"}
          value={formData.category ?? ""}
          onChangeText={(value) =>
            setFormData({ ...formData, category: value })
          }
          ref={categoryRef}
        />
        {/* <RadioButton.Group
          value={formData.bought ? "1" : "0"}
          onValueChange={(value) =>
            setFormData({ ...formData, bought: value === "1" })
          }
        >
          <RadioButton.Item label="Done" value="1" />
          <RadioButton.Item label="Not yet" value="0" />
        </RadioButton.Group> */}
        <Button mode="contained" onPress={handleSave}>
          Save
        </Button>
      </View>
    </View>
  );
};

export default Form;
