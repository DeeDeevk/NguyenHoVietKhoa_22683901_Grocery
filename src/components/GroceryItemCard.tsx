import { View, Text } from "react-native";
import React from "react";
import { GroceryItem } from "@/types/GroceryItem";
import { Button, Card } from "react-native-paper";
import { useRouter } from "expo-router";

type Props = {
  data: GroceryItem;
  onMark: (id: number) => void;
};

const GroceryItemCard = ({ data, onMark }: Props) => {
  const router = useRouter();
  const onPressEdit = () => {
    router.push({ pathname: "/form", params: { id: data.id.toString() } });
  };
  return (
    <View className="px-4 my-2">
      <Card>
        <Card.Title title={data.name}></Card.Title>
        <Card.Content>
          <Text>Category: {data.category}</Text>
          <Text>Quantity: {data.quantity}</Text>
          <Text>Created At: {new Date(data.created_at).toDateString()}</Text>
          <Text>Bought: {data.bought === 1 ? "Done" : "Not yet"}</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => onMark(data.id)}>
            Mark bought
          </Button>
          <Button mode="contained" onPress={onPressEdit}>
            Edit
          </Button>
          <Button mode="contained">Delete</Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

export default GroceryItemCard;
