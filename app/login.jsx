import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  StatusBar,
} from "react-native";
import { useAuth } from "../components/auth/auth-context";
import { colors } from "../constants/colors";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const { setAuth } = useAuth();

  const router = useRouter();
  const API_URL = "https://case-api-icfc.onrender.com";

  const handleLogin = async () => {
    setVisibleModal(true);
    setMensagem("Conectando ao servidor...");

    try {
      setMensagem("Verificando credenciais...");
      const req = await fetch(`${API_URL}/`);
      console.log(req.status);

      const resposta = await axios.post(`${API_URL}/api/login`, {
        email: email.trim(),
        password: senha.trim(),
      });

      setAuth(resposta.data);
      const token = resposta.data.token;
      const userData = resposta.data.user;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(userData));

      setMensagem(`Login realizado com sucesso!`);
      setTimeout(() => {
        router.replace("/dashboard");
        setVisibleModal(false);
      }, 1500);
    } catch (erro) {
      console.error("Erro completo:", erro);
      if (erro.response?.status === 401) {
        setMensagem("Credenciais inválidas. Verifique email e senha.");
      } else {
        setMensagem("Erro de conexão. Tente novamente.");
      }
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.midnightNavy} />
      
      {/* Modal de Loading */}
      <Modal transparent={true} animationType="fade" visible={visibleModal}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.7)'
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 30,
            borderRadius: 20,
            width: '85%',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
          }}>
            <ActivityIndicator size="large" color={colors.midnightNavy} />
            <Text style={{ 
              marginTop: 15, 
              textAlign: 'center',
              fontSize: 16,
              color: colors.midnightNavy
            }}>
              {mensagem}
            </Text>
            {mensagem.includes('❌') && (
              <Pressable
                style={{
                  backgroundColor: colors.midnightNavy,
                  paddingVertical: 12,
                  paddingHorizontal: 30,
                  borderRadius: 25,
                  marginTop: 20
                }}
                onPress={() => setVisibleModal(false)}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>Fechar</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>

      <ScrollView 
        style={{ flex: 1, backgroundColor: '#f8f9fa' }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header com gradiente simulado */}
        <View style={{
          backgroundColor: colors.midnightNavy,
          paddingTop: 60,
          paddingBottom: 40,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          marginBottom: 40,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 10,
        }}>
          <View style={{ alignItems: 'center' }}>
            {/* Logo Circular */}
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
              elevation: 5,
            }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: colors.midnightNavy
              }}>
                O
              </Text>
            </View>
            
            <Text style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 8
            }}>
              OLIN
            </Text>
            <Text style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.8)',
              textAlign: 'center',
              paddingHorizontal: 40
            }}>
              Odontologia Legal Interface
            </Text>
          </View>
        </View>

        {/* Formulário */}
        <View style={{ paddingHorizontal: 30 }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.midnightNavy,
            textAlign: 'center',
            marginBottom: 30
          }}>
            Faça seu login
          </Text>

          {/* Campo Email */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: colors.steelBlue,
              marginBottom: 8
            }}>
              Email
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#e1e5e9',
                borderRadius: 15,
                paddingHorizontal: 20,
                paddingVertical: 15,
                fontSize: 16,
                backgroundColor: 'white',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
              }}
              placeholder="Digite seu email"
              placeholderTextColor="#a0a0a0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Campo Senha */}
          <View style={{ marginBottom: 30 }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: colors.steelBlue,
              marginBottom: 8
            }}>
              Senha
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#e1e5e9',
                borderRadius: 15,
                paddingHorizontal: 20,
                paddingVertical: 15,
                fontSize: 16,
                backgroundColor: 'white',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
              }}
              placeholder="Digite sua senha"
              placeholderTextColor="#a0a0a0"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
          </View>
          
          {/* Botão Login */}
          <Pressable 
            style={{
              backgroundColor: colors.midnightNavy,
              paddingVertical: 18,
              borderRadius: 15,
              alignItems: 'center',
              shadowColor: colors.midnightNavy,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
            onPress={handleLogin}
          >
            <Text style={{
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold'
            }}>
              Entrar
            </Text>
          </Pressable>

          {/* Footer */}
          <View style={{
            marginTop: 40,
            alignItems: 'center',
            paddingBottom: 40
          }}>
            <Text style={{
              fontSize: 12,
              color: colors.steelBlue,
              textAlign: 'center'
            }}>
              Sistema desenvolvido para gestão de casos periciais{'\n'}
              © 2025 OLIN
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}