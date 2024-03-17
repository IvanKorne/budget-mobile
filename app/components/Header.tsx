import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { client } from "../../utils/kindeConfig";
import { colors } from "../../utils/colors";
import { useRouter } from "expo-router";
import services from "../../utils/services";

export default function Header() {
  const [user, setUser] = useState<any>();
  const router = useRouter();

  // Retrieves user data
  useEffect(() => {
    getUserData();
  });

  const getUserData = async () => {
    const user = await client.getUserDetails();
    setUser(user);
  };

  const handleLogout = async () => {
    const loggedOut = await client.logout();
    if (loggedOut) {
      await services.storeData("login", "false");
      router.replace("/login");
    }
  };
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
      }}
    >
      <Image
        source={{ uri: user?.picture }}
        style={{ width: 50, height: 50, borderRadius: 50 }}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "85%",
        }}
      >
        <View>
          <Text
            style={{ fontSize: 16, color: colors.White, fontFamily: "outfit" }}
          >
            Welcome
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: colors.White,
              fontFamily: "outfit-bold",
            }}
          >
            {user?.given_name}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleLogout()}>
          <View
            style={{
              padding: 12,
              marginRight: 3,
              backgroundColor: colors.List[0],
              borderRadius: 12,
            }}
          >
            <Text style={{ fontFamily: "outfit-bold", color: colors.White }}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
