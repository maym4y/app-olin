import { useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import ListItems from "../../components/list-casos";
import casos from "../../constants/casos.mock";
import colors from "../../constants/colors";
import { styles } from "../../styles/styles";

// Dashboard de casos
export default function Casos(props) {
  const [query, setQuery] = useState("");
  const [allCasos, setAllCasos] = useState([]);
  const [filterByStatus, setFilterByStatus] = useState("");
  const [filteredCasos, setFilteredCasos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const API_URL = "https://case-api-icfc.onrender.com";

  const fetchCases = async () => {
    const res = await fetch(`${API_URL}/api/casos`, {});
    const data = await res.json();
    setCasos(data);
  };

  const handleQuery = (text) => {
    setQuery(text);

  }

   useEffect(() => {
     setAllCasos(casos());
  }, []);

  return (
    <View style={styles.body}>
      <View style={{ backgroundColor: colors.gainsboro }}>
        <TextInput
          placeholder="Pesquise..."
          value={query}
          onChangeText={handleQuery}
          style={styles.input}
        />
      </View>
      <ListItems allCasos={casos()} />
      <View style={{ height: 45 }} />
    </View>
  );
}
