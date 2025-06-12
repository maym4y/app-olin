import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '../components/auth/auth-context';
import { styles } from '../styles/styles';
import { colors } from "../constants/colors";

export default function Index() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Aguarda um pequeno delay para garantir que o layout está montado
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');
      
      if (token && userData) {
        setAuth({
          token,
          user: JSON.parse(userData)
        });
        // Usa replace em vez de push para não empilhar na navegação
        setTimeout(() => {
          router.replace('/dashboard');
        }, 500);
      } else {
        setTimeout(() => {
          router.replace('/login');
        }, 500);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setTimeout(() => {
        router.replace('/login');
      }, 500);
    } finally {
      setAuthChecked(true);
    }
  };

  // Só renderiza após verificar a autenticação
  if (!authChecked) {
    return (
      <View style={[styles.body, { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: colors.background 
      }]}>
        <View style={styles.iconView}>
          <Text style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.midnightNavy,
            marginBottom: 20
          }}>
            OLIN
          </Text>
          <Text style={{
            fontSize: 16,
            color: colors.steelBlue,
            textAlign: 'center',
            marginBottom: 40
          }}>
            Sistema de Gestão de Casos Periciais
          </Text>
          <ActivityIndicator size="large" color={colors.midnightNavy} />
          <Text style={{
            marginTop: 10,
            color: colors.steelBlue
          }}>
            Carregando...
          </Text>
        </View>
      </View>
    );
  }

  // Retorna uma tela vazia após a verificação (o router já vai redirecionar)
  return null;
}
