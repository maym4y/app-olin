import { AntDesign, Octicons } from "@expo/vector-icons";
import { useState } from "react";
import { TextInput, View } from "react-native";
import { colors } from "../constants/colors";
import { styles } from "../styles/styles";

export default function SearchBar(props) {
  const [query, setQuery] = useState("");

  const { handleSearch } = props;
  

  return (
    <View style={styles.searchBar}>
      <View style={styles.searchIcon}>
        <AntDesign name="search1" size={24} color={colors.steel} />
        <TextInput
          value={query}
          onChangeText={(query) => handleSearch(query)}
          style={styles.searchInput}
          placeholder="Pesquise aqui..."
          clearButtonMode="always"
        />
      </View>
      <Octicons name="multi-select" size={24} color={colors.steel} />
    </View>
  );
}
