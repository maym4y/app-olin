import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import ListItems from "./list-casos";

export default function RecentCases(props) {
  const { historico } = props;
  return (
    <View>
      <Text>Casos Recentes:</Text>
      <Pressable onPress={() => router.push("/casos")}>
        <Text>Ver Todos os Casos</Text>
      </Pressable>
      <ListItems allCasos={historico} />
    </View>
  );
}
