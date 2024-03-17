import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { colors } from "../../utils/colors";

const tabs = [
  {
    name: "index",
    title: "Home",
    icon: "home",
  },
  {
    name: "history",
    title: "History",
    icon: "history",
  },
] as const;
export default function TabsLayout() {
  // Our tabs in the bottom of the screen
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.Primary,
        headerShown: false,
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name={tab.icon} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
