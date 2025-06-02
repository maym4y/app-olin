import { FlatList } from "react-native";
import ShowCard from "./show-card";

export default function ListItems(props) {
    const { histCasos } = props;
    return (
        <FlatList
        data={histCasos}
        keyExtractor={(item) => item.id || item.titulo}
        renderItem={(item) => <ShowCard caso={item} />}
        />
    )
}