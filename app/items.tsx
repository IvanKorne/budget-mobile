import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { colors } from "../utils/colors";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../utils/supabaseConfig";
import { decode } from "base64-arraybuffer";
import { useLocalSearchParams, useRouter } from "expo-router";

const placeholder =
  "https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png";

// Images in supabase can only be saved in base64
const placeholder64 =
  "aHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL3Byb3VkY2l0eS9tZWJhbmVuYy91cGxvYWRzLzIwMjEvMDMvcGxhY2Vob2xkZXItaW1hZ2UucG5nCg==";

const inputs = [
  {
    placeholder: "Item Name",
    icon: "tag",
    numberOfLines: 1,
  },
  {
    placeholder: "Cost",
    icon: "dollar",
    numberOfLines: 1,
  },
  {
    placeholder: "Url",
    icon: "link",
    numberOfLines: 1,
  },
  {
    placeholder: "Notes",
    icon: "sticky-note",
    numberOfLines: 3,
  },
] as const;

export default function Items() {
  const { categoryId } = useLocalSearchParams();
  const [image, setImage] = useState(placeholder64);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(placeholder);
  const router = useRouter();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: true,
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setPreview(result.assets[0]?.uri);
      setImage(result.assets[0].base64);
    }
  };

  const addItem = async () => {
    setLoading(true);

    // Since filename has to be unique, I am using date since it's always unique
    const fileName = Date.now();

    // Check if a new image was selected
    const isImageChanged = image !== placeholder64;

    try {
      if (isImageChanged) {
        // Upload the new image to Supabase storage
        const { data: storageData, error: storageError } =
          await supabase.storage
            .from("images")
            .upload(`${fileName}.png`, decode(image), {
              contentType: "image/png",
            });

        if (storageError) {
          console.log(storageError);
          return;
        }

        if (storageData) {
          // If a new image was selected, update the image field in the database
          const newImage = `https://mhtsmuqjlmbvfewwxbgh.supabase.co/storage/v1/object/public/images/${fileName}.png`;

          await supabase
            .from("CategoryItems")
            .insert([
              {
                image: newImage,
                name: name,
                url: url,
                cost: cost,
                note: note,
                category_id: categoryId,
              },
            ])
            .select();
        }
      } else {
        // If no new image was selected, insert data without the image field
        await supabase
          .from("CategoryItems")
          .insert([
            {
              name: name,
              url: url,
              cost: cost,
              note: note,
              category_id: categoryId,
            },
          ])
          .select();
      }

      ToastAndroid.show("Item Created", ToastAndroid.SHORT);
      router.replace({
        pathname: "/details",
        params: {
          categoryId: categoryId,
        },
      });
    } catch (error) {
      console.error("Error adding item:", error.message);
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView style={{ padding: 20, marginTop: 10 }}>
        <TouchableOpacity onPress={() => pickImage()}>
          <Image
            source={{
              uri: preview && preview,
            }}
            style={{
              width: 150,
              height: 150,
              backgroundColor: colors.Gray,
              borderRadius: 20,
            }}
          ></Image>
        </TouchableOpacity>
        <View style={{ marginTop: 10 }}>
          {inputs.map((input) => (
            <View
              style={{
                padding: 8,
                display: "flex",
                flexDirection: "row",
                gap: 12,
                marginTop: 10,
                borderWidth: 1,
                borderColor: colors.Gray,
                borderRadius: 10,
                alignItems: "center",
              }}
              key={input.placeholder}
            >
              <FontAwesome name={input.icon} size={24} color={colors.Black} />
              <TextInput
                placeholder={input.placeholder}
                style={{ fontFamily: "outfit", fontSize: 16, width: "100%" }}
                numberOfLines={input.numberOfLines}
                keyboardType={
                  input.placeholder === "Cost" ? "numeric" : undefined
                }
                onChangeText={(value) => {
                  switch (input.placeholder) {
                    case "Item Name":
                      setName(value);
                      break;
                    case "Cost":
                      setCost(value);
                      break;
                    case "Url":
                      setUrl(value);
                      break;
                    case "Notes":
                      setNote(value);
                      break;
                    default:
                      break;
                  }
                }}
              ></TextInput>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={{
            width: "100%",
            marginTop: 20,
            backgroundColor: colors.Primary,
            padding: 8,
            borderRadius: 99,
            opacity: !name || !cost || loading ? 0.8 : 1,
          }}
          disabled={!name || !cost || loading}
          onPress={() => addItem()}
        >
          {loading ? (
            <ActivityIndicator color={colors.White} size={"large"} />
          ) : (
            <Text
              style={{
                color: colors.White,
                textAlign: "center",
                fontFamily: "outfit-bold",
                fontSize: 20,
              }}
            >
              Add
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
