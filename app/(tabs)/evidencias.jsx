import { View } from "react-native";
import ListItems from "../../components/list-items";
import { styles } from "../../styles/styles";

export default function EvidenciaLayout() {
  const evidencias = [{
    titulo: "Evidencia 1",
    descricao: "Descrição breve",
    localColeta: "Local 1",
    dataColeta: "12/04/1998",
    criadoEm: "20/10/2024",
    tipoArquivo: "imagem",
    arquivo: "url4",
    caso: "id tal",
  },
{
    titulo: "Evidencia 2",
    descricao: "Descrição breve",
    localColeta: "Local 1",
    dataColeta: "12/04/1998",
    criadoEm: "20/10/2024",
    tipoArquivo: "imagem",
    arquivo: "url3",
    caso: "id tal",
  },
{
    titulo: "Evidencia 3",
    descricao: "Descrição breve",
    localColeta: "Local 1",
    dataColeta: "12/04/1998",
    criadoEm: "20/10/2024",
    tipoArquivo: "imagem",
    arquivo: "url2",
    caso: "id tal",
  },
{
    titulo: "Evidencia 4",
    descricao: "Descrição breve",
    localColeta: "Local 1",
    dataColeta: "12/04/1998",
    criadoEm: "20/10/2024",
    tipoArquivo: "imagem",
    arquivo: "url1",
    caso: "id tal",
  }];
  return (
    <View style={styles.body}>
      <ListItems histCasos={evidencias} />
    </ View>
  );
}
