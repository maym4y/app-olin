import { Text, View } from "react-native";
import { styles } from "../../styles/styles";

// Dashboard de casos
export default function Dashboard() {
    return (
        <View style={styles.body}>
            <View>
                <Text>Gerenciamento de Casos:</Text>
            </View>
            <View>
                <Text>Casos Recentes:</Text>
            </View>
        </View>
    )
}