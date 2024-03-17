import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { colors } from "../utils/colors";
import ColorPicker from "./components/ColorPicker";
import { client } from "../utils/kindeConfig";
import { supabase } from "../utils/supabaseConfig";
import { useRouter } from "expo-router";

export default function Modal() {
  const [icon, setIcon] = useState<any>("IC");
  const [color, setColor] = useState(colors.List[0]);
  const [category, setCategory] = useState<string | undefined>();
  const [budget, setBudget] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const changeColor = (id: number) => {
    const newColour = colors.List[id];
    setColor(newColour);
  };

  const createCategory = async () => {
    setLoading(true);
    const user = await client.getUserDetails();
    const { data, error } = await supabase
      .from("Category")
      .insert([
        {
          name: category,
          budget: budget,
          icon: icon,
          color: color,
          created_by: user?.email,
        },
      ])
      .select();

    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      router.replace({
        pathname: "/details",
        params: {
          categoryId: data[0].id,
        },
      });
      ToastAndroid.show("Category Created", ToastAndroid.SHORT);
    }
    setLoading(false);
  };

  return (
    <View style={{ marginTop: 40, paddingHorizontal: 20 }}>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextInput
          style={{
            textAlign: "center",
            fontSize: 30,
            backgroundColor: color,
            color: colors.White,
            padding: 20,
            paddingHorizontal: 22,
            borderRadius: 99,
          }}
          maxLength={2}
          onChangeText={(value) => setIcon(value)}
        >
          {icon}
        </TextInput>

        <ColorPicker selectedColor={color} changeColor={changeColor} />
      </View>
      <View
        style={{
          borderWidth: 1,
          display: "flex",
          flexDirection: "row",
          padding: 10,
          borderRadius: 20,
          backgroundColor: colors.White,
          alignItems: "center",
          gap: 8,
          marginTop: 20,
        }}
      >
        <MaterialIcons name="local-offer" size={24} color={colors.Black} />
        <TextInput
          placeholder="Category Name"
          style={{ fontFamily: "outfit", width: "100%" }}
          onChangeText={(value) => setCategory(value)}
        />
      </View>
      <View
        style={{
          borderWidth: 1,
          display: "flex",
          flexDirection: "row",
          padding: 10,
          borderRadius: 20,
          backgroundColor: colors.White,
          alignItems: "center",
          gap: 8,
          marginTop: 20,
        }}
      >
        <FontAwesome
          name="dollar"
          size={24}
          color={colors.Black}
          style={{ marginLeft: 2 }}
        />
        <TextInput
          placeholder="Total Budget"
          keyboardType="numeric"
          style={{ fontFamily: "outfit", width: "100%", marginLeft: 8 }}
          onChangeText={(value) => setBudget(value)}
        />
      </View>
      <TouchableOpacity
        style={{
          paddingHorizontal: 10,
          paddingVertical: 15,
          backgroundColor: colors.Primary,
          borderRadius: 10,
          marginTop: 20,
          opacity: !category || !budget ? 0.8 : 1,
        }}
        disabled={!category || !budget}
        onPress={() => createCategory()}
      >
        {loading ? (
          <ActivityIndicator color={colors.White} size={"large"} />
        ) : (
          <Text
            style={{
              color: colors.White,
              fontFamily: "outfit-bold",
              textAlign: "center",
            }}
          >
            Create
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
