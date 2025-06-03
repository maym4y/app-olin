import { Text, View } from "react-native";
import ListItems from "./list-items";

export default function RecentCases(props) {
  const { historico } = props;
  return (
    <View>
      <Text>Casos Recentes:</Text>
      <ListItems histCasos={historico} />
    </View>
  );
}
