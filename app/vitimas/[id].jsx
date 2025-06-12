// app/vitimas/[id].jsx
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useAuth } from "../../components/auth/auth-context";
import { colors } from "../../constants/colors";

const API_URL = "https://case-api-icfc.onrender.com";

export default function VitimaDetalhes() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [vitima, setVitima] = useState(null);
  const [error, setError] = useState(null);

  const { id } = useLocalSearchParams();
  const { auth } = useAuth();
  const router = useRouter();

  // Função para buscar detalhes da vítima
  const fetchVitimaDetalhes = async () => {
    try {
      setError(null);
      const token = await AsyncStorage.getItem("token");
      
      const response = await axios.get(`${API_URL}/api/vitimas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setVitima(response.data);
    } catch (err) {
      console.error("Erro ao buscar vítima:", err);
      setError(err.response?.data?.message || "Erro ao carregar dados da vítima");
      
      if (err.response?.status === 404) {
        Alert.alert("Erro", "Vítima não encontrada", [
          { text: "OK", onPress: () => router.back() }
        ]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Função para refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchVitimaDetalhes();
  };

  // Função para editar vítima
  const handleEditVitima = () => {
    router.push(`/vitimas/${id}/editar`);
  };

  // Função para deletar vítima
  const handleDeleteVitima = () => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir a vítima ${vitima.nome}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              await axios.delete(`${API_URL}/api/vitimas/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              
              Alert.alert("Sucesso", "Vítima excluída com sucesso", [
                { text: "OK", onPress: () => router.back() }
              ]);
            } catch (err) {
              Alert.alert("Erro", "Não foi possível excluir a vítima");
            }
          }
        }
      ]
    );
  };

  // Função para formatar data
  const formatarData = (dataString) => {
    if (!dataString) return 'Não informado';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para obter cor baseada no sexo
  const getCorSexo = (sexo) => {
    switch (sexo?.toLowerCase()) {
      case 'masculino':
      case 'm':
        return colors.steelBlue;
      case 'feminino':
      case 'f':
        return colors.warmBeige;
      default:
        return colors.grayBlue;
    }
  };

  useEffect(() => {
    fetchVitimaDetalhes();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.darkTeal} />
        <Text style={styles.loadingText}>Carregando dados da vítima...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color={colors.warmBeige} />
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={fetchVitimaDetalhes}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </Pressable>
      </View>
    );
  }

  if (!vitima) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="person-outline" size={48} color="#ccc" />
        <Text style={styles.errorText}>Vítima não encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>Detalhes da Vítima</Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.actionButton} onPress={() => router.push(`/vitimas/${id}/odontograma`)}>
            <MaterialIcons name="medical-services" size={20} color="white" />
          </Pressable>
          <Pressable style={styles.actionButton} onPress={handleEditVitima}>
            <MaterialIcons name="edit" size={20} color="white" />
          </Pressable>
          <Pressable style={styles.actionButton} onPress={handleDeleteVitima}>
            <MaterialIcons name="delete" size={20} color="white" />
          </Pressable>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Card Principal */}
        <View style={styles.mainCard}>
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, { backgroundColor: getCorSexo(vitima.sexo) }]}>
              <MaterialIcons name="person" size={40} color="white" />
            </View>
            <View style={styles.nameSection}>
              <Text style={styles.name}>{vitima.nome}</Text>
              <Text style={styles.nic}>NIC: {vitima.nic}</Text>
            </View>
          </View>
        </View>

        {/* Informações Pessoais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="wc" size={20} color={getCorSexo(vitima.sexo)} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Sexo</Text>
              <Text style={styles.infoValue}>{vitima.sexo || 'Não informado'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="cake" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Idade</Text>
              <Text style={styles.infoValue}>
                {vitima.idade ? `${vitima.idade} anos` : 'Não informado'}
              </Text>
            </View>
          </View>

          {vitima.nacionalidade && (
            <View style={styles.infoRow}>
              <MaterialIcons name="public" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nacionalidade</Text>
                <Text style={styles.infoValue}>{vitima.nacionalidade}</Text>
              </View>
            </View>
          )}

          {vitima.profissao && (
            <View style={styles.infoRow}>
              <MaterialIcons name="work" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Profissão</Text>
                <Text style={styles.infoValue}>{vitima.profissao}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Botão do Odontograma */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exame Odontológico</Text>
          
          <Pressable 
            style={styles.odontogramaButton}
            onPress={() => router.push(`/vitimas/${id}/odontograma`)}
          >
            <MaterialIcons name="medical-services" size={32} color={colors.darkTeal} />
            <View style={styles.odontogramaInfo}>
              <Text style={styles.odontogramaTitle}>Acessar Odontograma</Text>
              <Text style={styles.odontogramaSubtitle}>
                Visualizar e editar mapa dentário completo
              </Text>
            </View>
            <AntDesign name="right" size={20} color="#ccc" />
          </Pressable>
        </View>

        {/* Caso Vinculado */}
        {vitima.caso && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Caso Vinculado</Text>
            
            <Pressable 
              style={styles.caseCard}
              onPress={() => router.push(`/casos/${vitima.caso._id}`)}
            >
              <MaterialIcons name="folder" size={24} color={colors.darkTeal} />
              <View style={styles.caseInfo}>
                <Text style={styles.caseTitle}>{vitima.caso.titulo}</Text>
                <Text style={styles.caseStatus}>Status: {vitima.caso.status}</Text>
              </View>
              <AntDesign name="right" size={16} color="#ccc" />
            </Pressable>
          </View>
        )}

        {/* Regiões Anatômicas */}
        {vitima.regioesAnatomicas && vitima.regioesAnatomicas.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Regiões Anatômicas ({vitima.regioesAnatomicas.length})
            </Text>
            
            {vitima.regioesAnatomicas.map((regiao, index) => (
              <View key={index} style={styles.regiaoCard}>
                <MaterialIcons name="anatomy" size={20} color="#9c27b0" />
                <View style={styles.regiaoInfo}>
                  <Text style={styles.regiaoNome}>{regiao.nome}</Text>
                  {regiao.observacoes && (
                    <Text style={styles.regiaoObs}>{regiao.observacoes}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Informações do Sistema */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do Sistema</Text>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="schedule" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Data de Cadastro</Text>
              <Text style={styles.infoValue}>{formatarData(vitima.createdAt)}</Text>
            </View>
          </View>

          {vitima.criadoPor && (
            <View style={styles.infoRow}>
              <MaterialIcons name="person" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Cadastrado por</Text>
                <Text style={styles.infoValue}>{vitima.criadoPor.name}</Text>
              </View>
            </View>
          )}

          {vitima.updatedAt && vitima.updatedAt !== vitima.createdAt && (
            <View style={styles.infoRow}>
              <MaterialIcons name="update" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Última Atualização</Text>
                <Text style={styles.infoValue}>{formatarData(vitima.updatedAt)}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.darkTeal,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: colors.darkTeal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  mainCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  nameSection: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  nic: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  caseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  caseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  caseTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.darkTeal,
  },
  caseStatus: {
    fontSize: 12,
    color: '#666',
  },
  regiaoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    backgroundColor: '#f8f4ff',
    borderRadius: 8,
    marginBottom: 8,
  },
  regiaoInfo: {
    flex: 1,
    marginLeft: 12,
  },
  regiaoNome: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9c27b0',
  },
  regiaoObs: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  odontogramaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.darkTeal,
    borderStyle: 'dashed',
  },
  odontogramaInfo: {
    flex: 1,
    marginLeft: 16,
  },
  odontogramaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkTeal,
  },
  odontogramaSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});