import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../../constants/colors";

export default function CasoDetalhes() {
    const [pagina, setPagina] = useState('caso');
    const [evidencias, setEvidencias] = useState([]);
    const [laudos, setLaudos] = useState([]);
  const { id } = useLocalSearchParams();
  return (
    <View>
      <View style={estilos.casoMenu}>
        <Pressable style={estilos.itemMenu} onPress={() => setPagina('caso')}>
        <Text>Caso</Text>
        </Pressable>
        <Pressable style={estilos.itemMenu} onPress={() => setPagina('evidencias')}>
        <Text>Evidências</Text>
        </Pressable>
        <Pressable style={estilos.itemMenu} onPress={() => setPagina('laudos')}>
        <Text>Laudos</Text>
        </Pressable>
      </View>
      <Text>{pagina}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
    casoMenu: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'space-around',
        alignItems: 'center',
    },
    itemMenu: {
        borderColor: colors.steelBlue,
        borderWidth: 1,
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10
    }
})
