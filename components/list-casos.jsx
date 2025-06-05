import { FlatList } from "react-native";
import ShowCard from "./show-card";

export default function ListItems(props) {
  const { allCasos } = props;
  return (
    <FlatList
      data={allCasos}
      keyExtractor={(item) => item._id || item.titulo}
      renderItem={(item) => <ShowCard caso={item} />}
    />
  );
}
