import React, { useEffect, useState } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { useRouter, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import services from "./../../utils/services";
import { client } from "./../../utils/kindeConfig";
import { supabase } from "../../utils/supabaseConfig";
import Header from "../components/Header";
import { colors } from "../../utils/colors";
import CustomChart from "../components/CustomChart";
import CategoryList from "../components/CategoryList";

const Home = () => {
  const router = useRouter();
  const [categoryList, setCategoryList] = useState<any>();
  const [loading, setLoading] = useState(false);

  // Check if user is already loggedin
  const checkUserAuth = async () => {
    const result = await services.getData("login");
    if (result !== "true") {
      router.replace("/login");
    }
  };

  // Retrieves our category data
  const getCategoryList = async () => {
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
    setCategoryList(data);
    data && setLoading(false);
  };

  useEffect(() => {
    checkUserAuth();
    getCategoryList();
  }, []);

  return (
    <View style={{ marginTop: 20, flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={() => getCategoryList()}
            refreshing={loading}
          />
        }
      >
        <View
          style={{
            padding: 20,
            backgroundColor: colors.Primary,
            height: 150,
          }}
        >
          <Header />
        </View>
        <View
          style={{
            padding: 20,
            marginTop: -75,
          }}
        >
          <CustomChart categories={categoryList} />
          <CategoryList categories={categoryList} />
        </View>
      </ScrollView>
      <Link
        href={"/modal"}
        style={{ position: "absolute", bottom: 5, right: 15 }}
      >
        <Ionicons name="add-circle" size={55} color={colors.Primary} />
      </Link>
    </View>
  );
};

export default Home;
