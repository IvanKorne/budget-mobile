import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { colors } from "../../utils/colors";
import { client } from "../../utils/kindeConfig";
//@ts-ignore
import logo from "../assets/loginImage.png";
import services from "../../utils/services";
import { useRouter } from "expo-router";
const Login = () => {
  const router = useRouter();

  const handleSignIn = async () => {
    const token = await client.login();
    if (token) {
      await services.storeData("login", "true");
      router.replace("/");
    }
  };
  return (
    <View style={{ display: "flex", alignItems: "center" }}>
      <Image
        source={logo}
        style={{ width: 200, height: 400, marginTop: 50 }}
      ></Image>
      <View
        style={{
          backgroundColor: colors.Primary,
          width: "100%",
          padding: 20,
          height: "100%",
          marginTop: -60,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
      >
        <Text
          style={{
            fontSize: 40,
            fontFamily: "outfit-bold",
            textAlign: "center",
            color: colors.White,
          }}
        >
          Mobi Budget Planner
        </Text>
        <Text
          style={{
            fontSize: 20,
            marginTop: 20,
            fontWeight: "bold",
            textAlign: "center",
            color: colors.White,
          }}
        >
          Stay on Track of Your Expenses, Stay on Track of Your Life.
        </Text>
        <TouchableOpacity
          style={{
            padding: 15,
            paddingHorizontal: 5,
            backgroundColor: colors.White,
            borderRadius: 99,
            marginTop: 20,
          }}
          onPress={() => handleSignIn()}
        >
          <Text style={{ textAlign: "center", color: colors.Primary }}>
            Login/Signup
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 10,
            marginTop: 10,
            textAlign: "center",
            color: colors.White,
          }}
        >
          By logging in, you will be agreeing to our terms and conditions.
        </Text>
      </View>
    </View>
  );
};

export default Login;
