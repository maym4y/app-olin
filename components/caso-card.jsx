import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { styles } from "../styles/styles";

export default function ShowCard({ caso }) {
  const { item } = caso;

  const handlePress = () => {
    router.push({
      pathname: "/casos/detalhes",
      params: {
        caso: JSON.stringify(item), 
      },
    });
  };

  return (
    <View style={styles.caseCard}>
      <Text style={styles.lightText}>{item.titulo}</Text>
      <Text style={styles.lightText}>{item.localDoCaso}</Text>
      <View style={styles.cardBottom}>
        <Text style={styles.lightText}>
          {item.data ? item.data.split("T")[0] : ""}
        </Text>
        <Pressable onPress={handlePress}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Text style={styles.lightText}>Detalhes</Text>
            <AntDesign name="arrowright" size={24} color={colors.gainsboro} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
