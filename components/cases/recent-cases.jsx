import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { colors } from "../../constants/colors";

const API_URL = "https://case-api-icfc.onrender.com";

// Função para formatar data
const formatarData = (dataString) => {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR');
};

// Função para obter cor do status
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'em andamento':
      return '#e74c3c';
    case 'finalizado':
      return '#27ae60';
    case 'arquivado':
      return '#f4d03f';
    default:
      return '#999';
  }
};

// Componente de card individual do caso
const CasoCard = ({ caso }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/casos/${caso._id}`);
  };

  return (
    <Pressable 
      style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: colors.midnightNavy,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
      onPress={handlePress}
    >
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 5
      }}>
        <Text style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: '#333',
          flex: 1,
          marginRight: 10
        }}>
          {caso.titulo}
        </Text>
        <View style={{
          backgroundColor: getStatusColor(caso.status),
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12
        }}>
          <Text style={{
            color: 'white',
            fontSize: 10,
            fontWeight: '600'
          }}>
            {caso.status?.toUpperCase()}
          </Text>
        </View>
      </View>
      
      <Text style={{
        fontSize: 14,
        color: '#666',
        marginBottom: 5
      }}>
        {caso.tipo}
      </Text>
      
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
      }}>
        <MaterialIcons name="location-on" size={12} color="#999" />
        <Text style={{
          fontSize: 12,
          color: '#999',
          marginLeft: 4,
          flex: 1
        }}>
          {caso.localDoCaso}
        </Text>
      </View>
      
      <Text style={{
        fontSize: 12,
        color: '#999'
      }}>
        Atualizado: {formatarData(caso.ultimaAtualizacao || caso.updatedAt || caso.createdAt)}
      </Text>
    </Pressable>
  );
};

// Componente principal
export default function RecentCases() {
  const [casosRecentes, setCasosRecentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchCasosRecentes();
  }, []);

  const fetchCasosRecentes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('Token não encontrado. Faça login novamente.');
        return;
      }
  
      console.log('Token encontrado:', token.substring(0, 20) + '...');
      
      const response = await axios.get(`${API_URL}/api/casos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('Response status:', response.status);
      console.log('Casos encontrados:', response.data.length);
  
      // Pegar os 3 casos mais recentes
      const casos = response.data;
      const casosOrdenados = casos
        .sort((a, b) => {
          const dataA = new Date(a.ultimaAtualizacao || a.updatedAt || a.createdAt);
          const dataB = new Date(b.ultimaAtualizacao || b.updatedAt || b.createdAt);
          return dataB - dataA;
        })
        .slice(0, 3);
  
      setCasosRecentes(casosOrdenados);
    } catch (error) {
      console.error('Erro completo:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      
      if (error.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
        // Opcional: redirecionar para login
        // router.replace('/login');
      } else {
        setError('Erro ao carregar casos recentes');
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <View>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 15
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333'
          }}>
            Casos Recentes
          </Text>
          <Pressable onPress={() => router.push('/casos')}>
            <Text style={{
              fontSize: 14,
              color: colors.steelBlue
            }}>
              Ver Todos
            </Text>
          </Pressable>
        </View>

        {/* Loading */}
        <View style={{
          padding: 20,
          alignItems: 'center'
        }}>
          <ActivityIndicator size="large" color={colors.midnightNavy} />
          <Text style={{
            marginTop: 10,
            color: colors.steelBlue
          }}>
            Carregando casos...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 15
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333'
          }}>
            Casos Recentes
          </Text>
          <Pressable onPress={() => router.push('/casos')}>
            <Text style={{
              fontSize: 14,
              color: colors.steelBlue
            }}>
              Ver Todos
            </Text>
          </Pressable>
        </View>

        {/* Error */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 20,
          alignItems: 'center'
        }}>
          <Text style={{
            color: '#e74c3c',
            textAlign: 'center'
          }}>
            {error}
          </Text>
          <Pressable 
            style={{
              marginTop: 10,
              paddingHorizontal: 20,
              paddingVertical: 8,
              backgroundColor: colors.midnightNavy,
              borderRadius: 6
            }}
            onPress={fetchCasosRecentes}
          >
            <Text style={{ color: 'white' }}>Tentar novamente</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333'
        }}>
          Casos Recentes
        </Text>
        <Pressable onPress={() => router.push('/casos')}>
          <Text style={{
            fontSize: 14,
            color: colors.steelBlue
          }}>
            Ver Todos
          </Text>
        </Pressable>
      </View>

      {/* Lista de Casos */}
      <View style={{ marginBottom: 30 }}>
        {casosRecentes.length > 0 ? (
          casosRecentes.map((caso) => (
            <CasoCard key={caso._id} caso={caso} />
          ))
        ) : (
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 20,
            alignItems: 'center'
          }}>
            <Text style={{
              color: '#999',
              textAlign: 'center'
            }}>
              Nenhum caso encontrado
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}