import { AntDesign } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { colors } from "../constants/colors";
import { styles } from "../styles/styles";

export default function ShowCard(props) {
    const { item } = props.caso
    
    return (
        <View style={styles.caseCard}>
            <Text style={styles.lightText}>{item.titulo}</Text>
            <Text style={styles.lightText}>{item.localDoCaso}</Text>
            <Text style={styles.lightText}>{item.descricao}</Text>
            <View style={styles.cardBottom}>
                <Text style={styles.lightText}>{item.data}</Text>
                <Text style={styles.lightText}>Detalhes</Text>
                <AntDesign name="arrowright" size={24} color={colors.gainsboro} />
            </View>
        </View>
    )
}