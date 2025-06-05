import { View } from "react-native";
import ListItems from "../../components/list-items";
import { styles } from "../../styles/styles";

export default function LaudoLayout() {
  const laudos = [
    {
      caso: "id1",
      evidencias: "id5",
      texto: "texto do laudo",
      autor: "id do usuario",
      criadoEm: "11/11/2011",
    },
    {
      caso: "id2",
      evidencias: "id4",
      texto: "texto do laudo",
      autor: "id do usuario",
      criadoEm: "11/11/2011",
    },
    {
      caso: "id3",
      evidencias: "id3",
      texto: "texto do laudo",
      autor: "id do usuario",
      criadoEm: "11/11/2011",
    },
    {
      caso: "id4",
      evidencias: "id2",
      texto: "texto do laudo",
      autor: "id do usuario",
      criadoEm: "11/11/2011",
    },
    {
      caso: "id5",
      evidencias: "id1",
      texto: "texto do laudo",
      autor: "id do usuario",
      criadoEm: "11/11/2011",
    }
  ];
  return (
    <View style={styles.body}>
      <ListItems histCasos={laudos}/>
    </View>
  );
}

