import { useEffect, useState } from "react";
import { View } from "react-native";
import CaseManagement from "../../components/case-management";
import RecentCases from "../../components/recent-cases";
import { styles } from "../../styles/styles";

// Dashboard de casos
export default function Dashboard() {
    const [casos, setCasos] = useState([]);
    const [historico, setHistorico] = useState([]);

    const API_URL='https://case-api-icfc.onrender.com';

    const fetchCases = async () => {
        const res = await fetch(`${API_URL}/api/casos`, {});
        const data =  await res.json();
        setCasos(data);
        const historia = [...data].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
        setHistorico(historia.slide(2))
    }

    useEffect(() => {
        fetchCases();
    })

    return (
        <View style={styles.body}>
            <View>
                <CaseManagement />
            </View>
            <View>
                <RecentCases historico={historico}/>
            </View>
        </View>
    )
}