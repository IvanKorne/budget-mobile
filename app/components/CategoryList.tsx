import { View, TouchableOpacity, Text } from "react-native";
import React from "react";
import { colors } from "../../utils/colors";
import { useRouter } from "expo-router";

export default function CategoryList({ categories }: any) {
  const router = useRouter();
  const handleReroute = (category) => {
    router.push({
      pathname: "/details",
      params: {
        categoryId: category.id,
      },
    });
  };

  const calcTotal = (category) => {
    let total = 0;
    category?.CategoryItems.forEach((item) => {
      total += item?.cost;
    });
    return total;
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontFamily: "outfit-bold", fontSize: 23 }}>
        Current Budget
      </Text>
      <View style={{ display: "flex", gap: 8 }}>
        {categories?.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              backgroundColor: colors.White,
              padding: 12,
              borderRadius: 20,
              marginTop: 5,
            }}
            onPress={() => handleReroute(category)}
          >
            <View style={{ justifyContent: "center", alignItems: "baseline" }}>
              <Text
                style={{
                  fontSize: 35,
                  backgroundColor: category?.color,
                  padding: 10,
                  borderRadius: 16,
                }}
              >
                {category.icon}
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "72%",
              }}
            >
              <View>
                <Text style={{ fontFamily: "outfit-bold", fontSize: 18 }}>
                  {category.name}
                </Text>
                <Text style={{ fontFamily: "outfit", fontSize: 16 }}>
                  {category.CategoryItems.length} Items
                </Text>
              </View>
              <Text style={{ fontFamily: "outfit-bold", fontSize: 16 }}>
                ${calcTotal(category)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
