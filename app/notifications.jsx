import { Feather } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { colors } from "../constants/colors";
import { styles } from "../styles/styles";

export default function Notifications() {
    return (
        <>
            <Pressable>
                <Feather style={styles.notification} name="bell" size={24} color={colors.navy} />
            </Pressable>
        </>
    )
}