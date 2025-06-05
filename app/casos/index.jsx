import { AntDesign, Octicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
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
    const searchTerm = query.toLocaleLowerCase();
    const filtered = allCasos.filter((e) => {
      const titulo = e.titulo.toLocaleLowerCase();
      const localDoCaso = e.localDoCaso.toLocaleLowerCase();
      if (titulo.includes(searchTerm)) return e;
      if (localDoCaso.includes(searchTerm)) return e;
      if (e.peritoResponsavel) {
        const responsavel = e.peritoResponsavel.name.toLocaleLowerCase();
        if (responsavel.includes(searchTerm)) return e;
      }
    });
    setFilteredCasos(filtered);
  };

  useEffect(() => {
    setAllCasos(casos);
    setFilteredCasos(casos);
  }, []);

  return (
    <View style={styles.body}>
      <View style={styles.searchBar}>
        <View style={styles.searchIcon}>
          <AntDesign name="search1" size={24} color={colors.steel} />
          <TextInput
            value={query}
            onChangeText={handleQuery}
            style={styles.searchInput}
            placeholder="Pesquise aqui..."
            clearButtonMode="always"
          />
        </View>
        <Pressable>
          <Octicons name="multi-select" size={24} color={colors.steel} />
        </Pressable>
      </View>
      <ListItems allCasos={filteredCasos} />
    </View>
  );
}
