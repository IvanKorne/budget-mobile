import { View, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "../utils/supabaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../utils/colors";
import CategoryDetails from "./components/CategoryDetailsInfo";
import CategoryDetailsList from "./components/CategoryDetailsList";

export default function Details() {
  const { categoryId } = useLocalSearchParams();
  const [catData, setCatData] = useState<any>();
  const router = useRouter();
  useEffect(() => {
    categoryId && getCategoryDetail();
  }, [categoryId]);

  const getCategoryDetail = async () => {
    const { data, error } = await supabase
      .from("Category")
      .select("*,CategoryItems(*)")
      .eq("id", categoryId);

    if (error) {
      console.log(error);
    }
    setCatData(data[0]);
  };
  return (
    <View style={{ marginTop: 20, padding: 20, flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
          <Ionicons name="arrow-back-circle" size={40} color={colors.Primary} />
        </TouchableOpacity>
        <CategoryDetails catData={catData} />
        <CategoryDetailsList
          catData={catData}
          setUpdateRecord={() => getCategoryDetail()}
        />
      </ScrollView>
      <TouchableOpacity style={{ position: "absolute", bottom: 5, right: 15 }}>
        <Link
          href={{
            pathname: "/items",
            params: {
              categoryId: catData?.id,
            },
          }}
        >
          <Ionicons name="add-circle" size={55} color={colors.Primary} />
        </Link>
      </TouchableOpacity>
    </View>
  );
}
