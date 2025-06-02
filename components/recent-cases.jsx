import { Text, View } from "react-native";
import ListItems from "./list-items";

export default function RecentCases() {
  const casos = [
    {
      titulo: "Titulo do caso",
      tipo: "Acidente",
      descricao: "Descrição do caso",
      data: "12/08/2020",
      status: "Em Andamento",
      peritoResponsavel: "ID do Responsável",
      localDoCaso: "Local do Caso",
    },
    {
      titulo: "Titulo do caso2",
      tipo: "Acidente",
      descricao: "Descrição do caso",
      data: "12/08/2021",
      status: "Em Andamento",
      peritoResponsavel: "ID do Responsável",
      localDoCaso: "Local do Caso",
    },
    {
      titulo: "Titulo do caso3",
      tipo: "Exumação",
      descricao: "Descrição do caso",
      data: "12/08/2022",
      status: "Em Andamento",
      peritoResponsavel: "ID do Responsável",
      localDoCaso: "Local do Caso",
    },
    {
      titulo: "Titulo do caso4",
      tipo: "Violência Doméstica",
      descricao: "Descrição do caso",
      data: "12/08/2023",
      status: "Em Andamento",
      peritoResponsavel: "ID do Responsável",
      localDoCaso: "Local do Caso",
    }
  ];
  return (
    <View>
      <Text>Casos Recentes:</Text>
      <ListItems histCasos={casos} />
    </View>
  );
}
