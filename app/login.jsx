import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import logo from "../assets/images/logo.png";
import { colors } from "../constants/colors.js";
import { styles } from "../styles/styles.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const API_URL = "https://case-api-icfc.onrender.com"

  const handleLogin = async () => {
    setMensagem("Conectando ao servidor... (pode levar alguns segundos)");

    try {
      // Primeiro "acorda" a API se necessário
      Alert.alert("Testando conexão com API...");
      const req = await fetch(`${API_URL}/`); // Faz uma requisição simples primeiro

      console.log(req.status);

      const resposta = await axios.post("https://case-api-icfc.onrender.com/api/login", {
        body: {
          email: email.trim,
          password: senha.trim(),
        }
      });

      console.log(resposta.json());
      const token =  await resposta.token;
      const userData =  await resposta.user;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(userData));

      setMensagem(`Login realizado com sucesso! Bem-vindo, ${userData.email}`);

      // Navega para o dashboard após login bem-sucedido
      setTimeout(() => {
        router.replace("/dashboard");
      }, 1500);
    } catch (erro) {
      console.error("Erro completo:", erro);

      if (erro.code === "ECONNABORTED") {
        setMensagem(
          "⏱️ Timeout: O servidor demorou para responder. Tente novamente - a API pode estar iniciando."
        );
      } else if (erro.response?.status === 401) {
        setMensagem("❌ Credenciais inválidas. Verifique email e senha.");
      } else if (erro.response?.status === 404) {
        setMensagem("❌ Rota não encontrada. Verifique a configuração da API.");
      } else {
        setMensagem(`❌ Erro: ${erro.message || "Erro desconhecido"}`);
      }
      Alert.alert(mensagem);
    }
  };

  return (
    <ScrollView style={styles.body}>
      <View style={styles.iconView}>
        <Image style={styles.icon} source={logo} />
      </View>
      <View style={styles.loginView}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="email@example.com"
          style={styles.input}
        />
        <TextInput
          label="Senha"
          secureTextEntry={true}
          value={senha}
          onChangeText={setSenha}
          placeholder="********"
          style={styles.input}
        />
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? colors.steel : colors.midnightNavy,
            },
            styles.loginButton,
          ]}
          onPress={() => router.replace('/dashboard')}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

// () => router.replace('/(tabs)')