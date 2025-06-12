import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert
} from "react-native";
import { colors, statusColors } from "../../constants/colors";

const API_URL = "https://case-api-icfc.onrender.com";

// Função para formatar data
const formatarData = (dataString) => {
  const data = new Date(JSON.stringify(dataString));
  return data.toLocaleDateString('pt-BR');
};

// Função para obter cor do status
const getStatusColor = (status) => {
  return statusColors[status?.toLowerCase()] || '#999';
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
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: getStatusColor(caso.status),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
      onPress={handlePress}
    >
      {/* Header do card */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8
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
      
      {/* Tipo do caso */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6
      }}>
        <MaterialIcons name="category" size={14} color="#666" />
        <Text style={{
          fontSize: 14,
          color: '#666',
          marginLeft: 6,
          textTransform: 'capitalize'
        }}>
          {caso.tipo}
        </Text>
      </View>
      
      {/* Local */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6
      }}>
        <MaterialIcons name="location-on" size={14} color="#666" />
        <Text style={{
          fontSize: 14,
          color: '#666',
          marginLeft: 6,
          flex: 1
        }}>
          {caso.localDoCaso}
        </Text>
      </View>
      
      {/* Perito responsável */}
      {caso.peritoResponsavel && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 6
        }}>
          <MaterialIcons name="person" size={14} color="#666" />
          <Text style={{
            fontSize: 14,
            color: '#666',
            marginLeft: 6
          }}>
            {caso.peritoResponsavel.name || 'Não atribuído'}
          </Text>
        </View>
      )}
      
      {/* Data */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8
      }}>
        <Text style={{
          fontSize: 12,
          color: '#999'
        }}>
          Criado: {formatarData(caso.data)}
        </Text>
        <Text style={{
          fontSize: 12,
          color: '#999'
        }}>
          Atualizado: {formatarData(caso.ultimaAtualizacao || caso.updatedAt)}
        </Text>
      </View>
    </Pressable>
  );
};

export default function ListCases() {
  const [casos, setCasos] = useState([]);
  const [filteredCasos, setFilteredCasos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    fetchCasos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [casos, searchQuery, filterStatus]);

  // Buscar casos da API
  const fetchCasos = async () => {
    try {
      setError(null);
      const token = await AsyncStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/api/casos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Ordenar por data de atualização (mais recente primeiro)
      const casosOrdenados = response.data.sort((a, b) => {
        const dataA = new Date(a.ultimaAtualizacao || a.updatedAt);
        const dataB = new Date(b.ultimaAtualizacao || b.updatedAt);
        return dataB - dataA;
      });
      setCasos(casosOrdenados);
    } catch (error) {
      console.error('Erro ao buscar casos:', error);
      
      if (error.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
        Alert.alert(
          "Sessão Expirada",
          "Sua sessão expirou. Você será redirecionado para o login.",
          [
            {
              text: "OK",
              onPress: () => router.replace('/login')
            }
          ]
        );
      } else {
        setError('Erro ao carregar casos. Tente novamente.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Aplicar filtros de busca e status
  const aplicarFiltros = () => {
    let casosFiltrados = [...casos];

    // Filtro por texto
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      casosFiltrados = casosFiltrados.filter(caso =>
        caso.titulo.toLowerCase().includes(query) ||
        caso.tipo.toLowerCase().includes(query) ||
        caso.localDoCaso.toLowerCase().includes(query) ||
        (caso.peritoResponsavel?.name || '').toLowerCase().includes(query)
      );
    }

    // Filtro por status
    if (filterStatus !== "todos") {
      casosFiltrados = casosFiltrados.filter(caso => 
        caso.status === filterStatus
      );
    }

    setFilteredCasos(casosFiltrados);
  };

  // Refresh da lista
  const onRefresh = () => {
    setRefreshing(true);
    fetchCasos();
  };

  // Status disponíveis para filtro
  const statusOptions = [
    { label: "Todos", value: "todos" },
    { label: "Em Andamento", value: "em andamento" },
    { label: "Finalizados", value: "finalizado" },
    { label: "Arquivados", value: "arquivado" }
  ];

  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <ActivityIndicator size="large" color={colors.midnightNavy} />
        <Text style={{
          marginTop: 10,
          fontSize: 16,
          color: colors.steelBlue
        }}>
          Carregando casos...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20
      }}>
        <MaterialIcons name="error" size={48} color="#e74c3c" />
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333',
          textAlign: 'center',
          marginTop: 15,
          marginBottom: 10
        }}>
          Ops! Algo deu errado
        </Text>
        <Text style={{
          fontSize: 16,
          color: '#666',
          textAlign: 'center',
          marginBottom: 20
        }}>
          {error}
        </Text>
        <Pressable
          style={{
            backgroundColor: colors.midnightNavy,
            paddingHorizontal: 30,
            paddingVertical: 12,
            borderRadius: 8
          }}
          onPress={fetchCasos}
        >
          <Text style={{
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold'
          }}>
            Tentar Novamente
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header fixo */}
      <View style={{
        backgroundColor: 'white',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0'
      }}>
        {/* Título e total */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 15
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#333'
          }}>
            Casos
          </Text>
          <Text style={{
            fontSize: 16,
            color: colors.steelBlue
          }}>
            {filteredCasos.length} {filteredCasos.length === 1 ? 'caso' : 'casos'}
          </Text>
        </View>

        {/* Barra de busca */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#f0f0f0',
          borderRadius: 10,
          paddingHorizontal: 15,
          paddingVertical: 12,
          marginBottom: 15
        }}>
          <AntDesign name="search1" size={20} color="#666" />
          <TextInput
            style={{
              flex: 1,
              marginLeft: 10,
              fontSize: 16,
              color: '#333'
            }}
            placeholder="Buscar casos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <AntDesign name="close" size={18} color="#666" />
            </Pressable>
          )}
        </View>

        {/* Filtros de status */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {statusOptions.map((status) => (
            <Pressable
              key={status.value}
              style={{
                backgroundColor: filterStatus === status.value ? colors.midnightNavy : 'transparent',
                borderWidth: 1,
                borderColor: filterStatus === status.value ? colors.midnightNavy : '#ddd',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 10
              }}
              onPress={() => setFilterStatus(status.value)}
            >
              <Text style={{
                color: filterStatus === status.value ? 'white' : '#666',
                fontSize: 14,
                fontWeight: filterStatus === status.value ? 'bold' : 'normal'
              }}>
                {status.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Lista de casos */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.midnightNavy]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredCasos.length > 0 ? (
          filteredCasos.map((caso) => (
            <CasoCard key={caso._id} caso={caso} />
          ))
        ) : (
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 40,
            alignItems: 'center'
          }}>
            <MaterialIcons name="search-off" size={48} color="#ccc" />
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#999',
              marginTop: 15,
              textAlign: 'center'
            }}>
              Nenhum caso encontrado
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#999',
              marginTop: 5,
              textAlign: 'center'
            }}>
              {searchQuery || filterStatus !== "todos" 
                ? "Tente ajustar os filtros de busca"
                : "Ainda não há casos cadastrados"
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}