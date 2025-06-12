import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  RefreshControl
} from "react-native";
import Swiper from "react-native-screens-swiper";
import { colors, statusColors } from "../../constants/colors";
import NewEvidenceModal from "../../components/forms/new-evidence-modal";
import NewRelatorioModal from "../../components/forms/new-relatorio-modal";
import ModalNovaVitima from "../../components/modal-nova-vitima";
import ListEvidencias from "../../components/lists/list-evidencias";
import ListRelatorios from "../../components/lists/list-relatorios";
import ListVitimas from "../../components/lists/list-vitimas";

const API_URL = "https://case-api-icfc.onrender.com";

// Função para formatar data
const formatarData = (dataString) => {
  if (!dataString) return 'N/A';
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Função para obter cor do status
const getStatusColor = (status) => {
  return statusColors[status?.toLowerCase()] || '#999';
};

// Componente de informação
const InfoRow = ({ icon, label, value, color }) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingHorizontal: 20
  }}>
    <MaterialIcons name={icon} size={20} color={color || '#666'} style={{ marginTop: 2 }} />
    <View style={{ marginLeft: 12, flex: 1 }}>
      <Text style={{
        fontSize: 14,
        color: '#999',
        marginBottom: 2
      }}>
        {label}
      </Text>
      <Text style={{
        fontSize: 16,
        color: '#333',
        lineHeight: 22
      }}>
        {value || 'Não informado'}
      </Text>
    </View>
  </View>
);

// Tab 1: Detalhes do Caso
const DetalhesTab = ({ caso }) => (
  <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
    <View style={{
      backgroundColor: 'white',
      margin: 20,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    }}>
      <View style={{
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333'
        }}>
          Informações do Caso
        </Text>
      </View>
      
      <View style={{ paddingVertical: 15 }}>
        <InfoRow
          icon="description"
          label="Descrição"
          value={caso.descricao}
        />
        <InfoRow
          icon="location-on"
          label="Local do Caso"
          value={caso.localDoCaso}
        />
        {caso.localizacao?.endereco && (
          <InfoRow
            icon="home"
            label="Endereço Completo"
            value={caso.localizacao.endereco}
          />
        )}
        {caso.localizacao?.complemento && (
          <InfoRow
            icon="apartment"
            label="Complemento"
            value={caso.localizacao.complemento}
          />
        )}
        {caso.localizacao?.referencia && (
          <InfoRow
            icon="place"
            label="Ponto de Referência"
            value={caso.localizacao.referencia}
          />
        )}
        <InfoRow
          icon="event"
          label="Data do Caso"
          value={formatarData(caso.data)}
        />
        <InfoRow
          icon="person"
          label="Perito Responsável"
          value={caso.peritoResponsavel?.name || 'Não atribuído'}
        />
        <InfoRow
          icon="schedule"
          label="Criado em"
          value={formatarData(caso.createdAt)}
        />
        <InfoRow
          icon="update"
          label="Última Atualização"
          value={formatarData(caso.ultimaAtualizacao || caso.updatedAt)}
        />
      </View>
    </View>
  </ScrollView>
);

// Tab 2: Evidências - USANDO O COMPONENTE QUE CRIAMOS
const EvidenciasTab = ({ evidencias, onAddEvidence }) => (
  <ListEvidencias 
    evidencias={evidencias}
    onAddEvidence={onAddEvidence}
  />
);

// Tab 3: Relatórios - USANDO O COMPONENTE QUE CRIAMOS
const RelatoriosTab = ({ relatorios, onAddRelatorio }) => (
  <ListRelatorios 
    relatorios={relatorios}
    onAddRelatorio={onAddRelatorio}
  />
);

// Tab 4: Vítimas - USANDO O COMPONENTE COMPLETO QUE CRIAMOS
const VitimasTab = ({ vitimas, onAddVitima, onVitimaPress }) => (
  <ListVitimas 
    vitimas={vitimas}
    onVitimaPress={onVitimaPress}
    onAddVitima={onAddVitima}
  />
);

export default function CaseDetails() {
  const [caso, setCaso] = useState(null);
  const [evidencias, setEvidencias] = useState([]);
  const [relatorios, setRelatorios] = useState([]);
  const [vitimas, setVitimas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados do modal
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showRelatorioModal, setShowRelatorioModal] = useState(false);
  const [showVitimaModal, setShowVitimaModal] = useState(false);

  const { id } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchCaseDetails();
    }
  }, [id]);

  const fetchCaseDetails = async () => {
    try {
      setError(null);
      const token = await AsyncStorage.getItem('token');

      // Buscar todos os dados relacionados ao caso
      const [casoResponse, evidenciasResponse, vitimasResponse] = await Promise.all([
        axios.get(`${API_URL}/api/casos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/api/evidencias?casoId=${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/vitimas/caso/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch((err) => {
          console.log('Erro ao buscar vítimas:', err.response?.status);
          return { data: [] };
        })
      ]);

      setCaso(casoResponse.data);
      setEvidencias(evidenciasResponse.data);
      setVitimas(vitimasResponse.data);

      console.log('Vítimas carregadas:', vitimasResponse.data.length);

      // Buscar todos os tipos de relatórios/laudos
      await fetchAllRelatorios(token);

    } catch (error) {
      console.error('Erro ao buscar detalhes do caso:', error);
      
      if (error.response?.status === 404) {
        setError('Caso não encontrado.');
      } else if (error.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
        Alert.alert(
          "Sessão Expirada",
          "Sua sessão expirou. Você será redirecionado para o login.",
          [{ text: "OK", onPress: () => router.replace('/login') }]
        );
      } else {
        setError('Erro ao carregar detalhes do caso.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Função para buscar vítimas do caso
  const fetchVitimas = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/vitimas/caso/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVitimas(response.data);
      console.log('Vítimas atualizadas:', response.data.length);
    } catch (error) {
      console.error('Erro ao buscar vítimas:', error);
    }
  };

  // Função para buscar todos os tipos de relatórios
  const fetchAllRelatorios = async (token) => {
    try {
      const relatorioRequests = [
        // Laudos de evidência
        axios.get(`${API_URL}/api/laudos?casoId=${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => res.data.map(item => ({ ...item, tipo: 'laudo_evidencia' }))).catch(() => []),
        
        // Laudos odontológicos
        axios.get(`${API_URL}/api/laudos-odontologicos?casoId=${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => res.data.map(item => ({ ...item, tipo: 'laudo_odontologico' }))).catch(() => []),
        
        // Relatórios finais
        axios.get(`${API_URL}/api/relatorios/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => [res.data].map(item => ({ ...item, tipo: 'relatorio_final' }))).catch(() => [])
      ];

      const [laudosEvidencia, laudosOdontologicos, relatoriosFinais] = await Promise.all(relatorioRequests);
      
      // Combinar todos os relatórios e ordenar por data
      const todosRelatorios = [
        ...laudosEvidencia,
        ...laudosOdontologicos,
        ...relatoriosFinais
      ].sort((a, b) => {
        const dataA = new Date(a.criadoEm || a.dataEmissao || a.createdAt);
        const dataB = new Date(b.criadoEm || b.dataEmissao || b.createdAt);
        return dataB - dataA; // Mais recente primeiro
      });

      setRelatorios(todosRelatorios);
      console.log('Relatórios carregados:', todosRelatorios.length);

    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
      setRelatorios([]);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCaseDetails();
  };

  // Funções de callback para adicionar itens
  const handleAddEvidence = () => {
    setShowEvidenceModal(true);
  };

  const handleEvidenceAdded = (novaEvidencia) => {
    // Atualizar lista de evidências
    setEvidencias(prev => [novaEvidencia, ...prev]);
    Alert.alert("Sucesso", "Evidência adicionada com sucesso!");
  };

  const handleAddLaudo = () => {
    setShowRelatorioModal(true);
  };

  const handleRelatorioAdded = (novoRelatorio) => {
    // Atualizar lista de relatórios
    setRelatorios(prev => [{ ...novoRelatorio, tipo: novoRelatorio.tipo || 'relatorio_final' }, ...prev]);
    Alert.alert("Sucesso", "Relatório adicionado com sucesso!");
  };

  const handleAddVitima = () => {
    setShowVitimaModal(true);
  };

  const handleVitimaAdded = (novaVitima) => {
    // Atualizar lista de vítimas
    setVitimas(prev => [novaVitima, ...prev]);
    console.log('Nova vítima adicionada:', novaVitima.nome);
  };

  const handleVitimaPress = (vitima) => {
    // Navegar para detalhes da vítima
    router.push(`/vitimas/${vitima._id}`);
  };

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
          Carregando detalhes...
        </Text>
      </View>
    );
  }

  if (error || !caso) {
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
          {error || 'Caso não encontrado'}
        </Text>
        <Pressable
          style={{
            backgroundColor: colors.midnightNavy,
            paddingHorizontal: 30,
            paddingVertical: 12,
            borderRadius: 8
          }}
          onPress={() => router.back()}
        >
          <Text style={{
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold'
          }}>
            Voltar
          </Text>
        </Pressable>
      </View>
    );
  }

  // Configuração das tabs
  const tabsData = [
    {
      tabLabel: 'Detalhes',
      component: DetalhesTab,
      props: { caso }
    },
    {
      tabLabel: 'Evidências',
      component: EvidenciasTab,
      props: { evidencias, onAddEvidence: handleAddEvidence }
    },
    {
      tabLabel: 'Relatórios',
      component: RelatoriosTab,
      props: { relatorios, onAddRelatorio: handleAddLaudo }
    },
    {
      tabLabel: `Vítimas (${vitimas.length})`,
      component: VitimasTab,
      props: { 
        vitimas, 
        onAddVitima: handleAddVitima,
        onVitimaPress: handleVitimaPress 
      }
    }
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header com título e status */}
      <View style={{
        backgroundColor: 'white',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0'
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <Text style={{
            fontSize: 22,
            fontWeight: 'bold',
            color: '#333',
            flex: 1,
            marginRight: 15
          }}>
            {caso.titulo}
          </Text>
          <View style={{
            backgroundColor: getStatusColor(caso.status),
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 12
          }}>
            <Text style={{
              color: 'white',
              fontSize: 11,
              fontWeight: '600'
            }}>
              {caso.status?.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={{
          fontSize: 16,
          color: '#666',
          textTransform: 'capitalize',
          marginTop: 8
        }}>
          {caso.tipo}
        </Text>
      </View>

      {/* Swiper com as tabs logo abaixo do título */}
      <Swiper
        data={tabsData}
        isStaticPills={true}
        scrollableContainer={true}
        stickyHeaderEnabled={false}
        style={{
          staticPillContainer: {
            backgroundColor: 'white',
            borderBottomWidth: 1,
            borderBottomColor: '#e0e0e0',
            paddingVertical: 10
          },
          borderActive: {
            borderColor: colors.midnightNavy,
            borderWidth: 2
          },
          activeLabel: {
            color: colors.midnightNavy,
            fontWeight: 'bold',
            fontSize: 14
          },
          inactiveLabel: {
            color: '#666',
            fontSize: 14
          },
          pill: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            marginHorizontal: 6
          }
        }}
      />

      {/* Modal para adicionar evidência */}
      <NewEvidenceModal
        visible={showEvidenceModal}
        onClose={() => setShowEvidenceModal(false)}
        casoId={id}
        onEvidenceAdded={handleEvidenceAdded}
      />

      {/* Modal para adicionar relatório */}
      <NewRelatorioModal
        visible={showRelatorioModal}
        onClose={() => setShowRelatorioModal(false)}
        casoId={id}
        evidencias={evidencias}
        vitimas={vitimas}
        onRelatorioAdded={handleRelatorioAdded}
      />

      {/* Modal para adicionar vítima */}
      <ModalNovaVitima
        visible={showVitimaModal}
        onClose={() => setShowVitimaModal(false)}
        casoId={id}
        onVitimaCreated={handleVitimaAdded}
      />
    </View>
  );
}