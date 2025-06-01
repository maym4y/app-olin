import { View } from "react-native";
import CaseManagement from "../../components/case-management";
import RecentCases from "../../components/recent-cases";
import { styles } from "../../styles/styles";

// Dashboard de casos
export default function Dashboard() {
    return (
        <View style={styles.body}>
            <View>
                <CaseManagement />
            </View>
            <View>
                <RecentCases />
            </View>
        </View>
    )
}