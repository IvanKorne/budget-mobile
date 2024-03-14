import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Link, useRouter } from "expo-router";
import services from "./../../utils/services";
import { client } from "./../../utils/kindeConfig";
import { supabase } from "../../utils/supabaseConfig";
const Home = () => {
  useEffect(() => {
    checkUserAuth();
    getCategoryData();
  }, []);

  const router = useRouter();

  // Check if user is already loggedin
  const checkUserAuth = async () => {
    const result = await services.getData("login");
    if (result !== "true") {
      router.replace("/login");
    }
  };

  const handleLogout = async () => {
    const loggedOut = await client.logout();
    if (loggedOut) {
      await services.storeData("login", "false");
      router.replace("/login");
    }
  };

  const getCategoryData = async () => {
    const user = await client.getUserDetails();
    const { data, error } = await supabase
      .from("Category")
      .select("*")
      .eq("created_by", user.email);
    console.log(data);
  };
  return (
    <View style={{ marginTop: 50 }}>
      <Text style={style.text}>Home</Text>
      <Button title={"logout"} onPress={handleLogout} />
    </View>
  );
};

const style = StyleSheet.create({
  text: {
    fontSize: 20,
  },
});
export default Home;
