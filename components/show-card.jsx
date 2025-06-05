import { AntDesign } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { colors } from "../constants/colors";
import { styles } from "../styles/styles";

export default function ShowCard(props) {
  const { item } = props.caso;
  
  return (
    <View style={styles.caseCard}>
      <Text style={styles.lightText}>{item.titulo}</Text>
      <Text style={styles.lightText}>{item.localDoCaso}</Text>
      <View style={styles.cardBottom}>
        <Text style={styles.lightText}>{item.data.split('T')[0]}</Text>
        <Link href={`/casos/${item._id}`} >
        <View>
          <Text style={styles.lightText}>Detalhes</Text>
          <AntDesign name="arrowright" size={24} color={colors.gainsboro} />
        </View>
        </Link>
      </View>
    </View>
  );
}