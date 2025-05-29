import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import logo from "../assets/images/logo.png";
import { colors } from "../constants/colors.js";

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
        <Pressable style={styles.loginButton}>
          <Text style={styles.buttonText}>Entrar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: colors.gainsboro,
  },
  iconView: {
    alignItems: 'center',
  },
  icon: {
    height: 100,
    width: 200,
    margin: 50
  },
  loginView: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '30%',
  },
  input: {
    height: 50,
    width: '90%',
    margin: 12,
    borderWidth: 1,
    borderRadius: 30,
    padding: 10,
  },
  loginButton: {
    height: 50,
    width: '40%',
    fontSize: 30,
    margin: 15,
    padding: 12,
    borderRadius: 5,
    backgroundColor: colors.navy,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.gainsboro,
  }
});
