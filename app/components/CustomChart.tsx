import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import PieChart from "react-native-pie-chart";
import { colors } from "../../utils/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function CustomChart({ categories }: any) {
  const [values, setValues] = useState([1]);
  const [sliceColour, setSliceColour] = useState([colors.Gray]);
  const [total, setTotal] = useState(0);

  const updateChart = () => {
    let total = 0;
    let otherTotal = 0;
    setValues([]);
    setSliceColour([]);
    categories?.forEach((category, index) => {
      if (index < 4) {
        let categoryTotal = 0;
        category?.CategoryItems?.forEach((item) => {
          categoryTotal += item?.cost;
        });
        setSliceColour((prevColors) => [...prevColors, colors.List[index]]);
        setValues((prevValues) => [...prevValues, categoryTotal]);
        total += categoryTotal;
      } else {
        category?.CategoryItems?.forEach((item) => {
          otherTotal += item?.cost;
        });
      }
    });
    setSliceColour((prevColors) => [...prevColors, colors.List[4]]);
    setValues((prevValues) => [...prevValues, otherTotal]);
    setTotal(total);
  };

  useEffect(() => {
    categories && updateChart();
  }, [categories]);
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontFamily: "outfit" }}>
        Total Estimate:{" "}
        <Text style={{ fontFamily: "outfit-bold" }}>${total}</Text>
      </Text>
      <View
        style={{
          marginTop: 10,
          display: "flex",
          flexDirection: "row",
          gap: 40,
        }}
      >
        <PieChart
          widthAndHeight={150}
          series={values}
          sliceColor={sliceColour}
          coverRadius={0.65}
          coverFill="#FFF"
        />
        {categories?.length == 0 ? (
          <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
            <MaterialCommunityIcons
              name="checkbox-blank-circle"
              size={24}
              color={colors.Gray}
            />
            <Text style={{ fontWeight: "bold" }}>N/A</Text>
          </View>
        ) : (
          <View>
            {categories?.map(
              (category, id) =>
                id <= 4 && (
                  <View
                    key={id}
                    style={{ display: "flex", flexDirection: "row", gap: 5 }}
                  >
                    <MaterialCommunityIcons
                      name="checkbox-blank-circle"
                      size={24}
                      color={colors.List[id]}
                    />
                    <Text style={{ fontWeight: "bold" }}>
                      {id < 4 ? category?.name : "Other"}
                    </Text>
                  </View>
                )
            )}
          </View>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    elevation: 1,
    backgroundColor: colors.White,
    padding: 22,
    borderRadius: 20,
  },
});
