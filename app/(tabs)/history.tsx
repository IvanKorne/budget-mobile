import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Image,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { client } from "../../utils/kindeConfig";
import { supabase } from "../../utils/supabaseConfig";
import { colors } from "../../utils/colors";
import { useRouter } from "expo-router";

export default function History() {
  const [allItems, setAllItems] = useState<any>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getItems = async () => {
    setLoading(true);
    const user = await client.getUserDetails();
    const { data, error } = await supabase
      .from("Category")
      .select("*,CategoryItems(*)")
      .eq("created_by", user.email)
      .order("id");
    if (error) {
      console.log(error);
    }
    const allItems = data
      .map((cat) => cat?.CategoryItems)
      .flat()
      .sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);

        // Compare the Date objects to sort in descending order (newest to oldest)
        return dateB.getTime() - dateA.getTime();
      });

    setAllItems(allItems);
    data && setLoading(false);
  };

  useEffect(() => {
    getItems();
  }, []);
  return (
    <View style={{ marginTop: 20 }}>
      <View
        style={{
          padding: 20,
          backgroundColor: colors.Primary,
          height: 100,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 40,
            textAlign: "center",
            color: colors.White,
          }}
        >
          History
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl onRefresh={() => getItems()} refreshing={loading} />
        }
        style={{
          padding: 10,
        }}
      >
        {allItems?.map((item, id) => (
          <TouchableOpacity
            key={id}
            style={{
              marginTop: 15,
              display: "flex",
              flexDirection: "row",
              padding: 10,
              borderWidth: 1,
              borderColor: colors.Gray,
              borderRadius: 10,
              backgroundColor: colors.White,
              gap: 10,
              alignItems: "center",
            }}
            onPress={() =>
              router.replace({
                pathname: "/updateItems",
                params: {
                  item: item.id,
                },
              })
            }
          >
            <View>
              <Image
                source={{ uri: item?.image }}
                style={{
                  height: 80,
                  width: 80,
                  borderRadius: 10,
                }}
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "80%",
                }}
              >
                <Text style={{ fontFamily: "outfit-bold", fontSize: 20 }}>
                  {item?.name}
                </Text>
                <Text style={{ fontFamily: "outfit", fontSize: 16 }}>
                  ${item?.cost}
                </Text>
              </View>
              <View style={{ width: "90%" }}>
                <Text
                  style={{
                    fontFamily: "outfit-bold",
                    color: colors.Primary,
                    fontSize: 10,
                  }}
                >
                  {item?.url}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
