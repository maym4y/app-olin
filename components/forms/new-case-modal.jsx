import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Location from 'expo-location';
import axios from "axios";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform
} from "react-native";
import { colors } from "../../constants/colors";

const API_URL = "https://case-api-icfc.onrender.com";

export default function NewCaseModal({ visible, onClose, onSuccess }) {
  // Estados do formulário
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("acidente");
  const [descricao, setDescricao] = useState("");
  const [localDoCaso, setLocalDoCaso] = useState("");
  const [enderecoCompleto, setEnderecoCompleto] = useState("");
  const [complemento, setComplemento] = useState("");
  const [pontoReferencia, setPontoReferencia] = useState("");
  const [data, setData] = useState(new Date());
  const [status, setStatus] = useState("em andamento");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estados para localização
  const [localizacaoAtual, setLocalizacaoAtual] = useState(null);
  const [buscandoLocalizacao, setBuscandoLocalizacao] = useState(false);

  // Capturar localização quando o modal abrir
  useEffect(() => {
    if (visible) {
      obterLocalizacaoAtual();
    }
  }, [visible]);

  // Tipos de caso disponíveis
  const tiposCaso = [
    { label: "Acidente", value: "acidente" },
    { label: "Violência Doméstica", value: "violência doméstica" },
    { label: "Homicídio", value: "homicídio" },
    { label: "Identificação de Vítima", value: "identificação de vítima" },
    { label: "Avaliação de Lesões", value: "avaliação de lesões" },
    { label: "Exame Criminal", value: "exame criminal" },
    { label: "Outros", value: "outros" }
  ];

  // Status disponíveis
  const statusOptions = [
    { label: "Em Andamento", value: "em andamento" },
    { label: "Finalizado", value: "finalizado" },
    { label: "Arquivado", value: "arquivado" }
  ];

  // Função para obter localização atual
  const obterLocalizacaoAtual = async () => {
    try {
      setBuscandoLocalizacao(true);
      
      // Solicitar permissão de localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Negada',
          'Permissão de localização é necessária para preencher automaticamente o endereço.'
        );
        return;
      }

      // Obter localização atual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Fazer geocoding reverso para obter endereço
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addressResponse.length > 0) {
        const endereco = addressResponse[0];
        
        // Construir endereço completo
        const enderecoFormatado = [
          endereco.street,
          endereco.streetNumber,
          endereco.district,
          endereco.city,
          endereco.region
        ].filter(Boolean).join(', ');

        // Preencher campos automaticamente
        setEnderecoCompleto(enderecoFormatado);
        setLocalDoCaso(`${endereco.district || endereco.city}, ${endereco.city}`);
        
        // Salvar coordenadas
        setLocalizacaoAtual({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          endereco: enderecoFormatado
        });

        Alert.alert(
          'Localização Capturada',
          'Endereço preenchido automaticamente com base na sua localização atual.'
        );
      }
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      Alert.alert(
        'Erro de Localização',
        'Não foi possível obter sua localização atual. Preencha o endereço manualmente.'
      );
    } finally {
      setBuscandoLocalizacao(false);
    }
  };

  // Função para limpar o formulário
  const limparFormulario = () => {
    setTitulo("");
    setTipo("acidente");
    setDescricao("");
    setLocalDoCaso("");
    setEnderecoCompleto("");
    setComplemento("");
    setPontoReferencia("");
    setData(new Date());
    setStatus("em andamento");
    setLocalizacaoAtual(null);
  };

  // Função para fechar o modal
  const handleClose = () => {
    limparFormulario();
    onClose();
  };

  // Função para salvar o caso
  const handleSalvarCaso = async () => {
    // Validação básica
    if (!titulo.trim()) {
      Alert.alert("Erro", "Título do caso é obrigatório");
      return;
    }
    if (!descricao.trim()) {
      Alert.alert("Erro", "Descrição é obrigatória");
      return;
    }
    if (!localDoCaso.trim()) {
      Alert.alert("Erro", "Local do caso é obrigatório");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      const novoCaso = {
        titulo: titulo.trim(),
        tipo,
        descricao: descricao.trim(),
        localDoCaso: localDoCaso.trim(),
        data: data.toISOString(),
        status,
        // Incluir dados de localização se disponíveis
        ...(localizacaoAtual && {
          localizacao: {
            tipo: 'Point',
            coordenadas: [localizacaoAtual.longitude, localizacaoAtual.latitude],
            endereco: enderecoCompleto.trim(),
            complemento: complemento.trim(),
            referencia: pontoReferencia.trim()
          }
        })
      };

      const response = await axios.post(`${API_URL}/api/casos`, novoCaso, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      Alert.alert(
        "Sucesso", 
        "Caso criado com sucesso!",
        [
          {
            text: "OK",
            onPress: () => {
              limparFormulario();
              onSuccess && onSuccess(response.data);
              onClose();
            }
          }
        ]
      );

    } catch (error) {
      console.error('Erro ao criar caso:', error);
      
      let mensagemErro = "Erro ao criar caso. Tente novamente.";
      
      if (error.response?.status === 401) {
        mensagemErro = "Sessão expirada. Faça login novamente.";
      } else if (error.response?.data?.message) {
        mensagemErro = error.response.data.message;
      }

      Alert.alert("Erro", mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com mudança de data
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || data;
    setShowDatePicker(Platform.OS === 'ios');
    setData(currentDate);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: 50,
          paddingBottom: 20,
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0'
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#333'
          }}>
            Novo Caso
          </Text>
          <Pressable onPress={handleClose}>
            <AntDesign name="close" size={24} color="#666" />
          </Pressable>
        </View>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Indicador de localização */}
          {buscandoLocalizacao && (
            <View style={{
              backgroundColor: '#e3f2fd',
              borderLeftWidth: 4,
              borderLeftColor: '#2196f3',
              padding: 15,
              borderRadius: 5,
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <ActivityIndicator size="small" color="#2196f3" style={{ marginRight: 10 }} />
              <Text style={{
                fontSize: 14,
                color: '#1976d2'
              }}>
                Obtendo sua localização atual...
              </Text>
            </View>
          )}

          {/* Indicador de localização capturada */}
          {localizacaoAtual && (
            <View style={{
              backgroundColor: '#e8f5e8',
              borderLeftWidth: 4,
              borderLeftColor: '#4caf50',
              padding: 15,
              borderRadius: 5,
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <MaterialIcons name="location-on" size={20} color="#4caf50" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 14,
                  color: '#2e7d32',
                  fontWeight: '600'
                }}>
                  Localização capturada!
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: '#388e3c'
                }}>
                  Endereço preenchido automaticamente
                </Text>
              </View>
              <Pressable onPress={obterLocalizacaoAtual}>
                <MaterialIcons name="refresh" size={20} color="#4caf50" />
              </Pressable>
            </View>
          )}

          {/* Título do Caso */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>Título do Caso *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Caso de homicídio na Rua X"
              value={titulo}
              onChangeText={setTitulo}
              maxLength={100}
            />
          </View>

          {/* Tipo do Caso */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>Tipo do Caso *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={tipo}
                onValueChange={setTipo}
                style={styles.picker}
              >
                {tiposCaso.map((item) => (
                  <Picker.Item key={item.value} label={item.label} value={item.value} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Descrição */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>Descrição *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva os detalhes do caso..."
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Local do Caso */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>Local do Caso *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Descrição resumida do local"
              value={localDoCaso}
              onChangeText={setLocalDoCaso}
            />
          </View>

          {/* Endereço Completo */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>Endereço Completo</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Ex: Rua das Flores, 123 - Centro"
                value={enderecoCompleto}
                onChangeText={setEnderecoCompleto}
              />
              <Pressable 
                onPress={obterLocalizacaoAtual}
                style={{
                  marginLeft: 10,
                  padding: 12,
                  backgroundColor: colors.steelBlue,
                  borderRadius: 8
                }}
              >
                <MaterialIcons name="my-location" size={20} color="white" />
              </Pressable>
            </View>
          </View>

          {/* Complemento */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>Complemento</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Apartamento 101, Bloco A"
              value={complemento}
              onChangeText={setComplemento}
            />
          </View>

          {/* Ponto de Referência */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>Ponto de Referência</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Próximo ao shopping center"
              value={pontoReferencia}
              onChangeText={setPontoReferencia}
            />
          </View>

          {/* Data do Caso */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>Data do Caso</Text>
            <Pressable
              style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}
              onPress={() => setShowDatePicker(true)}
            >
              <MaterialIcons name="date-range" size={20} color="#666" style={{ marginRight: 10 }} />
              <Text style={{ color: '#333', fontSize: 16 }}>
                {data.toLocaleDateString('pt-BR')}
              </Text>
            </Pressable>
          </View>

          {/* Status */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={status}
                onValueChange={setStatus}
                style={styles.picker}
              >
                {statusOptions.map((item) => (
                  <Picker.Item key={item.value} label={item.label} value={item.value} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Nota informativa */}
          <View style={{
            backgroundColor: '#e3f2fd',
            borderLeftWidth: 4,
            borderLeftColor: '#2196f3',
            padding: 15,
            borderRadius: 5,
            marginBottom: 30
          }}>
            <Text style={{
              fontSize: 14,
              color: '#1976d2',
              fontStyle: 'italic'
            }}>
              Como administrador, você pode atribuir este caso a um perito após a criação.
            </Text>
          </View>

          {/* Botões */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 40
          }}>
            <Pressable
              style={[styles.button, styles.buttonSecondary]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={[styles.buttonText, { color: colors.midnightNavy }]}>
                Cancelar
              </Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonPrimary, loading && { opacity: 0.7 }]}
              onPress={handleSalvarCaso}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={[styles.buttonText, { color: 'white' }]}>
                  Salvar Caso
                </Text>
              )}
            </Pressable>
          </View>
        </ScrollView>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={data}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChangeDate}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = {
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
  },
  button: {
    flex: 0.48,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: colors.midnightNavy,
  },
  buttonPrimary: {
    backgroundColor: colors.midnightNavy,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
};