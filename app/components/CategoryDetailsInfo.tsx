import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../utils/colors";
import { supabase } from "../../utils/supabaseConfig";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function CategoryDetails({ catData }: any) {
  const [total, setTotal] = useState<number | undefined>();
  const [percent, setPercent] = useState<number | undefined>();
  const router = useRouter();

  const calculateTotalPercent = () => {
    let total = 0;
    catData?.CategoryItems?.forEach((item) => {
      total += item?.cost;
    });
    setTotal(total);
    console.log(total);
    let perc = (total / catData?.budget) * 100;
    if (perc > 100) {
      perc = 100;
    }
    setPercent(perc);
  };

  const deleteCategory = () => {
    Alert.alert("Are you sure", "Do you want to delete this Category?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase
            .from("CategoryItems")
            .delete()
            .eq("category_id", catData.id);
          await supabase.from("Category").delete().eq("id", catData.id);
          ToastAndroid.show("Category Deleted", ToastAndroid.SHORT);
          router.replace("/(tabs)");
        },
      },
    ]);
  };
  useEffect(() => {
    catData && calculateTotalPercent();
  }, [catData]);

  return (
    <View>
      <View
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ justifyContent: "center", alignItems: "baseline" }}>
          <Text
            style={{
              fontSize: 25,
              backgroundColor: catData?.color,
              padding: 20,
              borderRadius: 15,
            }}
          >
            {catData?.icon}
          </Text>
        </View>
        <View style={{ flex: 1, marginLeft: 20 }}>
          <Text style={{ fontFamily: "outfit-bold", fontSize: 24 }}>
            {catData?.name}
          </Text>
          <Text style={{ fontFamily: "outfit", fontSize: 18 }}>
            {catData?.CategoryItems?.length} Items
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              router.replace({
                pathname: "/updateModal",
                params: {
                  catData: catData.id,
                },
              })
            }
          >
            <MaterialIcons name="update" size={30} color={colors.Font} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteCategory()}>
            <Ionicons name="trash" size={30} color="red" />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 15,
        }}
      >
        <Text style={{ fontFamily: "outfit" }}>${total}</Text>
        <Text style={{ fontFamily: "outfit-bold" }}>
          Total Budget: ${catData?.budget}
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          height: 15,
          backgroundColor: colors.Gray,
          borderRadius: 99,
        }}
      >
        <View
          style={{
            width: `${percent ? percent : 0}%`,
            height: 15,
            backgroundColor: catData?.color,
            borderRadius: 99,
          }}
        ></View>
      </View>
    </View>
  );
}
