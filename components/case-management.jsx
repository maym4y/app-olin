import { Image, View } from "react-native";
import donutChart from '../assets/images/donut-chart.png';
import { styles } from "../styles/styles";

export default function CaseManagement() {
    return (
        <View>
            <Text>Gerenciamento de Casos:</Text>
            <Image source={donutChart} style={styles.caseChart} />
        </View>
    )
}