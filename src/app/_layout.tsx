import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import { Stack, Tabs } from "expo-router";
import { Text } from "react-native";
import { Icon } from "react-native-paper";
import { SQLiteProvider } from "expo-sqlite";
import { initTable } from "@/db/db";

export default function Layout() {
  return (
    <SQLiteProvider databaseName="app.db" onInit={(db) => initTable(db)}>
      <SafeAreaProvider>
      <SafeAreaView className="flex flex-1">
        <Text className="text-3xl text-center font-bold">Grocery List</Text>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "purple",
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              tabBarIcon: ({ focused, color }) => (
                <Icon
                  source={focused ? "home" : "home-outline"}
                  size={24}
                  color={color}
                ></Icon>
              ),
            }}
          ></Tabs.Screen>
          <Tabs.Screen
            name="form"
            options={{
              tabBarIcon: ({ focused, color }) => (
                <Icon source={"form-select"} size={24} color={color}></Icon>
              ),
            }}
          ></Tabs.Screen>
          {/* <Tabs.Screen
            name="trash"
            options={{
              tabBarIcon: ({ focused, color }) => (
                <Icon source={"trash-can"} size={24} color={color}></Icon>
              ),
            }}
          ></Tabs.Screen>
          <Tabs.Screen
            name="sync"
            options={{
              tabBarIcon: ({ focused, color }) => (
                <Icon source={"sync-circle"} size={24} color={color}></Icon>
              ),
            }}
          ></Tabs.Screen> */}
          <Tabs.Screen
            name="index"
            options={{
              href: null,
            }}
          />
        </Tabs>
      </SafeAreaView>
    </SafeAreaProvider>
    </SQLiteProvider>
  );
}
