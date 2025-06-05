import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Button, Modal, Pressable, View } from "react-native";
import CaseManagement from "../components/case-management";
import RecentCases from "../components/recent-cases";
import mockCasos from '../constants/casos.mock';
import { styles } from "../styles/styles";
import CadastrarCasoScreen from "./add-caso";

// Dashboard de casos
export default function Dashboard() {
  const [casos, setCasos] = useState([]);
  const [user, setUser] = useState({});
  const [historico, setHistorico] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const API_URL = "https://case-api-icfc.onrender.com";
  
  const fetchUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch(e) {
      console.log(e);
    }
  }

  const fetchCases = async () => {
    const res = await fetch(`${API_URL}/api/casos`);
    const data = await res.json();
    setCasos(data);
    const historia = [...data].sort(
      (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
    );
    setHistorico(historia.slide(2));
  };

  // useEffect(() => {
  //   fetchCases();
  // });

  const closeModal = () => {
    return (
      <Pressable onPress={() => setModalVisible(!modalVisible)}>
        <AntDesign name="closesquareo" size={24} color="black" />
      </Pressable>
    );
  };

  return (
    <View style={styles.body}>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <CadastrarCasoScreen closeScreen={closeModal} />
      </Modal>
      <View>
        <CaseManagement />
      </View>
      <Button
        title="Adicionar Caso"
        onPress={() => {
          setModalVisible(true);
        }}
      />
      <View>
        <RecentCases historico={mockCasos} />
      </View>
    </View>
  );
}
