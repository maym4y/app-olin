import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import { colors } from "../../constants/colors";

const API_URL = "https://case-api-icfc.onrender.com";

// Função para obter ícone baseado no tipo de arquivo
const getIconeArquivo = (tipoArquivo) => {
  switch (tipoArquivo) {
    case 'imagem':
      return 'image';
    case 'documento':
      return 'description';
    case 'audio':
      return 'mic';
    default:
      return 'attachment';
  }
};

export default function EditEvidenceModal({ 
  visible, 
  onClose, 
  evidence, 
  onEvidenceAdded
}) {
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  
  // Estados dos campos do formulário
  const [formData, setFormData] = useState({
    titulo: evidence.titulo,
    descricao: evidence.descricao,
    localColeta: evidence.localColeta,
    dataColeta: evidence.dataColeta,
    arquivo: evidence?.arquivo,
    tipoArquivo: evidence.tipoArquito
  });

  // Buscar localização automática quando o modal abre
  useEffect(() => {
    if (visible) {
      buscarLocalizacaoAutomatica();
    }
  }, [visible]);

  // Função para buscar localização automática
  const buscarLocalizacaoAutomatica = async () => {
    try {
      setLoadingLocation(true);
      
      // Solicitar permissão de localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          "Permissão de Localização",
          "Para preencher automaticamente o local da coleta, é necessário permitir o acesso à localização.",
          [
            { text: "Entendi", style: "default" }
          ]
        );
        return;
      }

      // Obter localização atual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Converter coordenadas em endereço
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const endereco = reverseGeocode[0];
        const localFormatado = formatarEndereco(endereco);
        updateField('localColeta', localFormatado);
      }

    } catch (error) {
      console.error('Erro ao buscar localização:', error);
      // Não mostra alerta para não incomodar o usuário
    } finally {
      setLoadingLocation(false);
    }
  };

  // Função para formatar o endereço
  const formatarEndereco = (endereco) => {
    const partes = [];
    
    if (endereco.street) partes.push(endereco.street);
    if (endereco.streetNumber) partes.push(endereco.streetNumber);
    if (endereco.district) partes.push(endereco.district);
    if (endereco.city) partes.push(endereco.city);
    if (endereco.region) partes.push(endereco.region);
    
    return partes.join(', ') || 'Localização obtida automaticamente';
  };
  // Função para resetar o formulário
  const resetForm = () => {
    setFormData({
      titulo: "",
      descricao: "",
      localColeta: "",
      dataColeta: new Date(),
      arquivo: null,
      tipoArquivo: ""
    });
  };

  // Função para atualizar campos do formulário
  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Função para selecionar arquivo (imagem ou documento)
  const selecionarArquivo = () => {
    Alert.alert(
      "Selecionar Arquivo",
      "Escolha o tipo de evidência que deseja adicionar:",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "📷 Tirar Foto",
          onPress: abrirCamera
        },
        {
          text: "🖼️ Galeria",
          onPress: abrirGaleria
        },
        {
          text: "📄 Documento",
          onPress: abrirDocumentos
        }
      ]
    );
  };

  // Abrir câmera para tirar foto
  const abrirCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert("Erro", "Permissão de câmera necessária!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        updateField('arquivo', result.assets[0]);
        updateField('tipoArquivo', 'imagem');
      }
    } catch (error) {
      console.error('Erro ao abrir câmera:', error);
      Alert.alert("Erro", "Falha ao abrir a câmera.");
    }
  };

  // Abrir galeria de fotos
  const abrirGaleria = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert("Erro", "Permissão de galeria necessária!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        updateField('arquivo', result.assets[0]);
        updateField('tipoArquivo', 'imagem');
      }
    } catch (error) {
      console.error('Erro ao abrir galeria:', error);
      Alert.alert("Erro", "Falha ao abrir a galeria.");
    }
  };

  // Abrir seletor de documentos
  const abrirDocumentos = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        copyToCacheDirectory: true
      });

      if (!result.canceled && result.assets[0]) {
        updateField('arquivo', result.assets[0]);
        updateField('tipoArquivo', 'documento');
      }
    } catch (error) {
      console.error('Erro ao abrir documentos:', error);
      Alert.alert("Erro", "Falha ao selecionar documento.");
    }
  };

  // Função para validar formulário
  const validarFormulario = () => {
    if (!formData.titulo.trim()) {
      Alert.alert("Erro", "Título é obrigatório.");
      return false;
    }
    
    if (!formData.descricao.trim()) {
      Alert.alert("Erro", "Descrição é obrigatória.");
      return false;
    }
    
    if (!formData.localColeta.trim()) {
      Alert.alert("Erro", "Local da coleta é obrigatório.");
      return false;
    }
    
    if (!formData.arquivo) {
      Alert.alert("Erro", "Arquivo da evidência é obrigatório.");
      return false;
    }

    return true;
  };

  // Função para enviar evidência para a API
  const enviarEvidencia = async () => {
    if (!validarFormulario()) return;

    setLoading(true);
    
    try {
      const token = await AsyncStorage.getItem('token');
      
      // Criar FormData para upload
      const formDataToSend = new FormData();
      
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('descricao', formData.descricao);
      formDataToSend.append('localColeta', formData.localColeta);
      formDataToSend.append('dataColeta', formData.dataColeta.toISOString());
      formDataToSend.append('caso', casoId);
      
      // Preparar arquivo para upload
      const arquivoUpload = {
        uri: formData.arquivo.uri,
        type: formData.arquivo.mimeType || (formData.tipoArquivo === 'imagem' ? 'image/jpeg' : 'application/pdf'),
        name: formData.arquivo.name || `evidencia_${Date.now()}.${formData.tipoArquivo === 'imagem' ? 'jpg' : 'pdf'}`
      };
      
      formDataToSend.append('arquivo', arquivoUpload);

      const response = await axios.post(`${API_URL}/api/evidencias`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert("Sucesso", "Evidência cadastrada com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            resetForm();
            onClose();
            if (onEvidenceAdded) {
              onEvidenceAdded(response.data.evidencia);
            }
          }
        }
      ]);

    } catch (error) {
      console.error('Erro ao enviar evidência:', error);
      
      const mensagemErro = error.response?.data?.message || 'Erro ao cadastrar evidência.';
      Alert.alert("Erro", mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  // Função para fechar modal
  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
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
          backgroundColor: 'white',
          paddingTop: 50,
          paddingHorizontal: 20,
          paddingBottom: 15,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#333'
          }}>
            Nova Evidência
          </Text>
          
          <Pressable 
            onPress={handleClose}
            disabled={loading}
            style={{
              padding: 8,
              borderRadius: 20,
              backgroundColor: '#f0f0f0'
            }}
          >
            <AntDesign name="close" size={20} color="#666" />
          </Pressable>
        </View>

        {/* Formulário */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
          {/* Título */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 8
            }}>
              Título da Evidência *
            </Text>
            <TextInput
              style={{
                backgroundColor: 'white',
                borderRadius: 8,
                padding: 15,
                fontSize: 16,
                borderWidth: 1,
                borderColor: '#e0e0e0'
              }}
              placeholder="Ex: Documento de identidade da vítima"
              value={formData.titulo}
              onChangeText={(text) => updateField('titulo', text)}
              editable={!loading}
            />
          </View>

          {/* Descrição */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 8
            }}>
              Descrição *
            </Text>
            <TextInput
              style={{
                backgroundColor: 'white',
                borderRadius: 8,
                padding: 15,
                fontSize: 16,
                borderWidth: 1,
                borderColor: '#e0e0e0',
                minHeight: 100,
                textAlignVertical: 'top'
              }}
              placeholder="Descreva os detalhes da evidência..."
              value={formData.descricao}
              onChangeText={(text) => updateField('descricao', text)}
              multiline
              numberOfLines={4}
              editable={!loading}
            />
          </View>

          {/* Local da Coleta */}
          <View style={{ marginBottom: 20 }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#333'
              }}>
                Local da Coleta *
              </Text>
              
              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 6,
                  backgroundColor: loadingLocation ? '#f0f0f0' : colors.steelBlue
                }}
                onPress={buscarLocalizacaoAutomatica}
                disabled={loading || loadingLocation}
              >
                {loadingLocation ? (
                  <ActivityIndicator size="small" color="#666" />
                ) : (
                  <MaterialIcons name="my-location" size={16} color="white" />
                )}
                <Text style={{
                  fontSize: 12,
                  color: loadingLocation ? '#666' : 'white',
                  marginLeft: 4,
                  fontWeight: 'bold'
                }}>
                  {loadingLocation ? 'Obtendo...' : 'Auto'}
                </Text>
              </Pressable>
            </View>
            
            <TextInput
              style={{
                backgroundColor: 'white',
                borderRadius: 8,
                padding: 15,
                fontSize: 16,
                borderWidth: 1,
                borderColor: '#e0e0e0'
              }}
              placeholder="Ex: Delegacia Central - Setor de Perícia"
              value={formData.localColeta}
              onChangeText={(text) => updateField('localColeta', text)}
              editable={!loading && !loadingLocation}
              multiline
            />
            
            {loadingLocation && (
              <Text style={{
                fontSize: 12,
                color: '#666',
                marginTop: 4,
                fontStyle: 'italic'
              }}>
                Obtendo localização automática...
              </Text>
            )}
          </View>

          {/* Data da Coleta */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 8
            }}>
              Data da Coleta *
            </Text>
            <Pressable
              style={{
                backgroundColor: 'white',
                borderRadius: 8,
                padding: 15,
                borderWidth: 1,
                borderColor: '#e0e0e0',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onPress={() => !loading && setShowDatePicker(true)}
              disabled={loading}
            >
              <Text style={{
                fontSize: 16,
                color: '#333'
              }}>
                {formData.dataColeta.toLocaleDateString('pt-BR')}
              </Text>
              <MaterialIcons name="calendar-today" size={20} color="#666" />
            </Pressable>
          </View>

          {/* Arquivo */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 8
            }}>
              Arquivo da Evidência *
            </Text>
            
            <Pressable
              style={{
                backgroundColor: formData.arquivo ? colors.lightGray : 'white',
                borderRadius: 8,
                padding: 15,
                borderWidth: 1,
                borderColor: formData.arquivo ? colors.steelBlue : '#e0e0e0',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 60
              }}
              onPress={selecionarArquivo}
              disabled={loading}
            >
              {formData.arquivo ? (
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1
                }}>
                  <MaterialIcons 
                    name={getIconeArquivo(formData.tipoArquivo)} 
                    size={24} 
                    color={colors.steelBlue} 
                  />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: '#333'
                    }}>
                      {formData.arquivo.name || 'Arquivo selecionado'}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: '#666',
                      textTransform: 'capitalize'
                    }}>
                      {formData.tipoArquivo}
                    </Text>
                  </View>
                  <AntDesign name="check" size={20} color={colors.steelBlue} />
                </View>
              ) : (
                <View style={{
                  alignItems: 'center'
                }}>
                  <MaterialIcons name="add-a-photo" size={32} color="#999" />
                  <Text style={{
                    fontSize: 16,
                    color: '#999',
                    marginTop: 8
                  }}>
                    Selecionar Arquivo
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: '#ccc',
                    marginTop: 4
                  }}>
                    Foto ou documento
                  </Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Botões de ação */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 30,
            gap: 15
          }}>
            <Pressable
              style={{
                flex: 1,
                backgroundColor: '#f0f0f0',
                paddingVertical: 15,
                borderRadius: 8,
                alignItems: 'center'
              }}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#666'
              }}>
                Cancelar
              </Text>
            </Pressable>

            <Pressable
              style={{
                flex: 1,
                backgroundColor: loading ? '#ccc' : colors.midnightNavy,
                paddingVertical: 15,
                borderRadius: 8,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center'
              }}
              onPress={enviarEvidencia}
              disabled={loading}
            >
              {loading && (
                <ActivityIndicator 
                  size="small" 
                  color="white" 
                  style={{ marginRight: 8 }} 
                />
              )}
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: 'white'
              }}>
                {loading ? 'Salvando...' : 'Salvar Evidência'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* DateTimePicker */}
        {showDatePicker && (
          <DateTimePicker
            value={formData.dataColeta}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                updateField('dataColeta', selectedDate);
              }
            }}
            maximumDate={new Date()}
          />
        )}
      </View>
    </Modal>
  );
}