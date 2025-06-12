import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

const API_URL = "https://case-api-icfc.onrender.com";

// Cores locais
const colors = {
  darkTeal: '#2C5F5D',
  steelBlue: '#4682B4',
  warmBeige: '#D2B48C',
  grayBlue: '#708090'
};

// Condições dentárias disponíveis
const CONDICOES_DENTARIAS = [
  { tipo: 'presente', nome: 'Presente', cor: '#27ae60' },
  { tipo: 'ausente', nome: 'Ausente', cor: '#e74c3c' },
  { tipo: 'cariado', nome: 'Cariado', cor: '#e67e22' },
  { tipo: 'restaurado', nome: 'Restaurado', cor: '#3498db' },
  { tipo: 'fraturado', nome: 'Fraturado', cor: '#9b59b6' },
  { tipo: 'protese', nome: 'Prótese', cor: '#f39c12' },
  { tipo: 'implante', nome: 'Implante', cor: '#1abc9c' },
  { tipo: 'tratamento_endodontico', nome: 'Tratamento Endodôntico', cor: '#34495e' }
];

// Estrutura dos dentes por quadrante
const QUADRANTES = {
  superiorDireito: {
    nome: 'Superior Direito',
    dentes: [18, 17, 16, 15, 14, 13, 12, 11]
  },
  superiorEsquerdo: {
    nome: 'Superior Esquerdo', 
    dentes: [21, 22, 23, 24, 25, 26, 27, 28]
  },
  inferiorEsquerdo: {
    nome: 'Inferior Esquerdo',
    dentes: [31, 32, 33, 34, 35, 36, 37, 38]
  },
  inferiorDireito: {
    nome: 'Inferior Direito',
    dentes: [41, 42, 43, 44, 45, 46, 47, 48]
  }
};

// Componente de Dente Individual
const DenteComponent = ({ numero, condicoes, onPress, observacoes }) => {
  const getCorDente = () => {
    if (!condicoes || condicoes.length === 0) {
      return '#f8f9fa'; // Cor padrão
    }
    
    // Usar a cor da primeira condição
    const primeiraCondicao = condicoes[0];
    const condicaoInfo = CONDICOES_DENTARIAS.find(c => c.tipo === primeiraCondicao.tipo);
    return condicaoInfo ? condicaoInfo.cor : '#f8f9fa';
  };

  const temCondicoes = condicoes && condicoes.length > 0;

  return (
    <Pressable
      style={[
        styles.dente,
        { 
          backgroundColor: getCorDente(),
          borderColor: temCondicoes ? getCorDente() : '#ddd'
        }
      ]}
      onPress={() => onPress(numero)}
    >
      <Text style={[
        styles.dentNumero,
        { color: temCondicoes ? 'white' : '#333' }
      ]}>
        {numero}
      </Text>
      {observacoes && (
        <View style={styles.denteIndicador}>
          <MaterialIcons name="note" size={8} color="white" />
        </View>
      )}
    </Pressable>
  );
};

// Modal para editar dente
const ModalEditarDente = ({ visible, dente, onClose, onSave }) => {
  const [condicoesSelecionadas, setCondicoesSelecionadas] = useState([]);
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    if (dente) {
      setCondicoesSelecionadas(dente.condicoes || []);
      setObservacoes(dente.observacoes || '');
    }
  }, [dente]);

  const toggleCondicao = (tipoCondicao) => {
    setCondicoesSelecionadas(prev => {
      const existe = prev.find(c => c.tipo === tipoCondicao);
      if (existe) {
        return prev.filter(c => c.tipo !== tipoCondicao);
      } else {
        return [...prev, { tipo: tipoCondicao, faces: [] }];
      }
    });
  };

  const handleSave = () => {
    onSave({
      numero: dente.numero,
      condicoes: condicoesSelecionadas,
      observacoes
    });
    onClose();
  };

  if (!dente) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Pressable onPress={onClose}>
            <AntDesign name="close" size={24} color="#666" />
          </Pressable>
          <Text style={styles.modalTitle}>Dente {dente.numero}</Text>
          <Pressable onPress={handleSave}>
            <MaterialIcons name="check" size={24} color={colors.darkTeal} />
          </Pressable>
        </View>

        <ScrollView style={styles.modalContent}>
          <Text style={styles.sectionTitle}>Condições</Text>
          
          {CONDICOES_DENTARIAS.map((condicao) => {
            const selecionada = condicoesSelecionadas.find(c => c.tipo === condicao.tipo);
            
            return (
              <Pressable
                key={condicao.tipo}
                style={[
                  styles.condicaoItem,
                  { backgroundColor: selecionada ? condicao.cor : '#f8f9fa' }
                ]}
                onPress={() => toggleCondicao(condicao.tipo)}
              >
                <Text style={[
                  styles.condicaoText,
                  { color: selecionada ? 'white' : '#333' }
                ]}>
                  {condicao.nome}
                </Text>
                {selecionada && (
                  <MaterialIcons name="check" size={20} color="white" />
                )}
              </Pressable>
            );
          })}

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Observações</Text>
          <TextInput
            style={styles.observacoesInput}
            value={observacoes}
            onChangeText={setObservacoes}
            placeholder="Observações específicas deste dente..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </ScrollView>
      </View>
    </Modal>
  );
};

export default function OdontogramaPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vitima, setVitima] = useState(null);
  const [odontograma, setOdontograma] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [denteSelecionado, setDenteSelecionado] = useState(null);

  const { id } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchVitima();
  }, [id]);

  const fetchVitima = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      
      const response = await axios.get(`${API_URL}/api/vitimas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setVitima(response.data);
      
      // Buscar odontograma
      await fetchOdontograma();
      
    } catch (error) {
      console.error("Erro ao buscar vítima:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados da vítima");
    } finally {
      setLoading(false);
    }
  };

  const fetchOdontograma = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      
      const response = await axios.get(`${API_URL}/api/vitimas/${id}/odontograma`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setOdontograma(response.data);
      
    } catch (error) {
      console.error("Erro ao buscar odontograma:", error);
      // Inicializar odontograma vazio se não existir
      setOdontograma({
        tipoOdontograma: 'adulto',
        arcadaSuperior: [],
        arcadaInferior: [],
        observacoesGerais: ''
      });
    }
  };

  const handleDentePress = (numeroDente) => {
    // Encontrar dente existente ou criar novo
    let denteExistente = null;
    
    if (odontograma) {
      const arcadaSuperior = odontograma.arcadaSuperior || [];
      const arcadaInferior = odontograma.arcadaInferior || [];
      
      denteExistente = [...arcadaSuperior, ...arcadaInferior]
        .find(d => d.numero === numeroDente);
    }
    
    setDenteSelecionado(denteExistente || {
      numero: numeroDente,
      condicoes: [],
      observacoes: ''
    });
    
    setModalVisible(true);
  };

  const handleSaveDente = async (denteAtualizado) => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("token");
      
      await axios.put(
        `${API_URL}/api/vitimas/${id}/odontograma/dente/${denteAtualizado.numero}`,
        {
          condicao: denteAtualizado.condicoes,
          observacoes: denteAtualizado.observacoes,
          presente: denteAtualizado.condicoes.length > 0
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Recarregar odontograma
      await fetchOdontograma();
      
      Alert.alert("Sucesso", `Dente ${denteAtualizado.numero} atualizado`);
      
    } catch (error) {
      console.error("Erro ao salvar dente:", error);
      Alert.alert("Erro", "Não foi possível salvar as alterações");
    } finally {
      setSaving(false);
    }
  };

  const renderQuadrante = (quadranteKey) => {
    const quadrante = QUADRANTES[quadranteKey];
    
    return (
      <View key={quadranteKey} style={styles.quadrante}>
        <Text style={styles.quadranteTitulo}>{quadrante.nome}</Text>
        <View style={styles.dentesContainer}>
          {quadrante.dentes.map(numeroDente => {
            // Encontrar dados do dente
            let dadosDente = null;
            
            if (odontograma) {
              const arcadaSuperior = odontograma.arcadaSuperior || [];
              const arcadaInferior = odontograma.arcadaInferior || [];
              
              dadosDente = [...arcadaSuperior, ...arcadaInferior]
                .find(d => d.numero === numeroDente);
            }
            
            return (
              <DenteComponent
                key={numeroDente}
                numero={numeroDente}
                condicoes={dadosDente?.condicoes || []}
                observacoes={dadosDente?.observacoes}
                onPress={handleDentePress}
              />
            );
          })}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.darkTeal} />
        <Text style={styles.loadingText}>Carregando odontograma...</Text>
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
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Odontograma</Text>
          <Text style={styles.headerSubtitle}>
            {vitima?.nome} - NIC: {vitima?.nic}
          </Text>
        </View>
      </View>

      {/* Legenda */}
      <View style={styles.legenda}>
        <Text style={styles.legendaTitle}>Legenda:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CONDICOES_DENTARIAS.map((condicao) => (
            <View key={condicao.tipo} style={styles.legendaItem}>
              <View 
                style={[styles.legendaCor, { backgroundColor: condicao.cor }]} 
              />
              <Text style={styles.legendaTexto}>{condicao.nome}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Odontograma */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.odontogramaContainer}>
          
          {/* Arcada Superior */}
          <View style={styles.arcada}>
            <Text style={styles.arcadaTitulo}>Arcada Superior</Text>
            <View style={styles.arcadaContainer}>
              {renderQuadrante('superiorDireito')}
              {renderQuadrante('superiorEsquerdo')}
            </View>
          </View>

          {/* Separador */}
          <View style={styles.separador} />

          {/* Arcada Inferior */}
          <View style={styles.arcada}>
            <Text style={styles.arcadaTitulo}>Arcada Inferior</Text>
            <View style={styles.arcadaContainer}>
              {renderQuadrante('inferiorEsquerdo')}
              {renderQuadrante('inferiorDireito')}
            </View>
          </View>

          {/* Observações Gerais */}
          <View style={styles.observacoesContainer}>
            <Text style={styles.observacoesTitulo}>Observações Gerais</Text>
            <TextInput
              style={styles.observacoesInput}
              value={odontograma?.observacoesGerais || ''}
              onChangeText={(text) => {
                setOdontograma(prev => ({
                  ...prev,
                  observacoesGerais: text
                }));
              }}
              placeholder="Observações gerais do odontograma..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      {/* Modal de Edição */}
      <ModalEditarDente
        visible={modalVisible}
        dente={denteSelecionado}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveDente}
      />

      {/* Loading overlay */}
      {saving && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.darkTeal} />
          <Text style={styles.loadingText}>Salvando...</Text>
        </View>
      )}
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
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.darkTeal,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 2,
  },
  legenda: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  legendaTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  legendaCor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendaTexto: {
    fontSize: 10,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  odontogramaContainer: {
    padding: 20,
  },
  arcada: {
    marginBottom: 30,
  },
  arcadaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  arcadaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quadrante: {
    flex: 1,
    margin: 5,
  },
  quadranteTitulo: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  dentesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  dente: {
    width: 35,
    height: 35,
    borderRadius: 18,
    borderWidth: 2,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dentNumero: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  denteIndicador: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.warmBeige,
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separador: {
    height: 2,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  observacoesContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  observacoesTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  observacoesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  condicaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  condicaoText: {
    fontSize: 14,
    fontWeight: '500',
  },
});