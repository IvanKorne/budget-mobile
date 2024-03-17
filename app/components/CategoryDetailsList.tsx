import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Linking,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../utils/colors";
import { EvilIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "../../utils/supabaseConfig";

export default function CategoryDetailsList({ catData, setUpdateRecord }: any) {
  const [expandItem, setExapandItem] = useState<any>();
  const router = useRouter();

  const deleteItem = async (id: number) => {
    const { error } = await supabase
      .from("CategoryItems")
      .delete()
      .eq("id", id);
    if (error) {
      console.log(error);
    }
    ToastAndroid.show("Item Deleted", ToastAndroid.SHORT);
    setUpdateRecord(true);
  };

  const openURL = (url: string | undefined | null) => {
    if (url) {
      Linking.openURL(url);
    }
  };
  return (
    <View style={{ marginTop: 20, display: "flex" }}>
      <Text style={{ fontSize: 22, fontFamily: "outfit-bold" }}>Item List</Text>
      <View>
        {catData?.CategoryItems.length == 0 && (
          <View>
            <Text
              style={{
                fontFamily: "outfit-bold",
                fontSize: 25,
                marginTop: 10,
                color: colors.Font,
              }}
            >
              No Items Found
            </Text>
          </View>
        )}
        {catData?.CategoryItems?.map((item, index) => (
          <View key={item?.id}>
            <TouchableOpacity
              style={{
                marginTop: 12,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onPress={() => setExapandItem(index)}
            >
              <Image
                source={{ uri: item?.image }}
                style={{ borderRadius: 20, width: 80, height: 80 }}
              ></Image>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontFamily: "outfit-bold", fontSize: 18 }}>
                  {item?.name}
                </Text>
                <Text
                  style={{ fontFamily: "outfit", color: colors.Font }}
                  numberOfLines={2}
                >
                  {item?.url}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "outfit-bold",
                  fontSize: 17,
                  marginLeft: 8,
                }}
              >
                ${item?.cost}
              </Text>
            </TouchableOpacity>
            {expandItem == index && (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={() => deleteItem(item.id)}>
                  <EvilIcons name="trash" size={34} color={colors.List[0]} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openURL(item?.url)}>
                  <EvilIcons
                    name="external-link"
                    size={34}
                    color={colors.Primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    router.replace({
                      pathname: "/updateItems",
                      params: {
                        item: item.id,
                      },
                    })
                  }
                >
                  <MaterialIcons name="update" size={30} color={colors.Font} />
                </TouchableOpacity>
              </View>
            )}
            {catData?.CategoryItems.length - 1 != index && (
              <View
                style={{
                  borderWidth: 0.5,
                  borderTopColor: colors.Gray,
                  marginTop: 10,
                }}
              ></View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
