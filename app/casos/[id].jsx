import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import cases from "../../constants/casos.mock";
import colors from "../../constants/colors";

export default function CasoDetalhes(props) {
    const [pagina, setPagina] = useState('caso');
    const [caso, setCaso] = useState({});
    const [evidencias, setEvidencias] = useState([]);
    const [laudos, setLaudos] = useState([]);

  const { id } = useLocalSearchParams();
  const getCaso = () => {
    const caso = cases.find(e => e._id == id);
    setCaso(caso);
  }
  const getEvidencia = () => {

  }

  useEffect(() => {
    getCaso();
  }, [])

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
      <Text>{caso.titulo}</Text>
      <Text>{caso.data.split("T")[0]}</Text>
      <Text>{caso.status}</Text>
      <Text>{caso.tipo}</Text>
      <Text>{caso.descricao}</Text>
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
