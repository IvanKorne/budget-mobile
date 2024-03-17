import React from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";

const HomeLayout = () => {
  // Custom fonts
  const [fontsLoaded, fontError] = useFonts({
    outfit: require("./assets/fonts/Outfit-Regular.ttf"),
    "outfit-med": require("./assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("./assets/fonts/Outfit-Bold.ttf"),
  });

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          headerShown: true,
          headerTitle: "Add New Category",
        }}
      />
      <Stack.Screen
        name="items"
        options={{
          presentation: "modal",
          headerShown: true,
          headerTitle: "Add New Item",
        }}
      />
    </Stack>
  );
};

export default HomeLayout;
