import { router } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import logo from "../assets/images/logo.png";
import { colors } from "../constants/colors.js";
import { styles } from "../styles/styles.js";


export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <ScrollView style={styles.body}>
      <View style={styles.iconView}>
        <Image style={styles.icon} source={logo} />
      </View>
      <View style={styles.loginView}>
        <TextInput
        value={email}
          onChangeText={setEmail}
          placeholder="email@example.com"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="********"
          style={styles.input}
        />
        <Pressable
          style={({pressed}) => [
            {
              backgroundColor: pressed ? colors.steel : colors.navy,
            }, styles.loginButton]}
            onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.buttonText}>Entrar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}