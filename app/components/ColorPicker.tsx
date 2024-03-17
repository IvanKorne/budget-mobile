import { View, TouchableOpacity } from "react-native";
import React from "react";
import { colors } from "../../utils/colors";

type ColorProps = {
  selectedColor: string;
  changeColor: (id: number) => void;
};

export default function ColorPicker({
  selectedColor,
  changeColor,
}: ColorProps) {
  return (
    <View
      style={{
        marginTop: 10,
        display: "flex",
        flexDirection: "row",
        gap: 20,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {colors.List.map((color, id) => [
        <TouchableOpacity
          key={id}
          onPress={() => changeColor(id)}
          style={[
            {
              backgroundColor: color,
              borderRadius: 99,
              height: 30,
              width: 30,
            },
            selectedColor == color && { borderWidth: 2 },
          ]}
        />,
      ])}
    </View>
  );
}
