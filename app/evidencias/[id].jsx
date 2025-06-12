import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";
import { colors } from "../../constants/colors";

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

// Função para obter ícone baseado no tipo
const getIconeArquivo = (tipoArquivo) => {
  switch (tipoArquivo) {
    case 'imagem':
      return 'image';
    case 'documento':
      return 'description';
    case 'audio':
      return 'audiotrack';
    case 'video':
      return 'videocam';
    default:
      return 'attachment';
  }
};

// Componente de informação detalhada
const InfoSection = ({ title, children }) => (
  <View style={{
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 15,
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
        {title}
      </Text>
    </View>
    <View style={{ padding: 20 }}>
      {children}
    </View>
  </View>
);

// Componente de linha de informação
const InfoRow = ({ icon, label, value, onPress }) => (
  <Pressable 
    style={{
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 15,
      opacity: onPress ? 1 : 1
    }}
    onPress={onPress}
    disabled={!onPress}
  >
    <MaterialIcons name={icon} size={20} color="#666" style={{ marginTop: 2 }} />
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
        color: onPress ? colors.steelBlue : '#333',
        lineHeight: 22,
        textDecorationLine: onPress ? 'underline' : 'none'
      }}>
        {value || 'Não informado'}
      </Text>
    </View>
    {onPress && (
      <AntDesign name="right" size={16} color="#ccc" style={{ marginTop: 2 }} />
    )}
  </Pressable>
);

export default function EvidenceDetails() {
  const [evidencia, setEvidencia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchEvidenceDetails();
    }
  }, [id]);

  const fetchEvidenceDetails = async () => {
    try {
      setError(null);
      const token = await AsyncStorage.getItem('token');

      const response = await axios.get(`${API_URL}/api/evidencias/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setEvidencia(response.data);
    } catch (error) {
      console.error('Erro ao buscar detalhes da evidência:', error);
      
      if (error.response?.status === 404) {
        setError('Evidência não encontrada.');
      } else if (error.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
        Alert.alert(
          "Sessão Expirada",
          "Sua sessão expirou. Você será redirecionado para o login.",
          [{ text: "OK", onPress: () => router.replace('/login') }]
        );
      } else {
        setError('Erro ao carregar detalhes da evidência.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = () => {
    if (evidencia?.arquivo) {
      Alert.alert(
        "Baixar Arquivo",
        "Deseja abrir o arquivo da evidência?",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Abrir", 
            onPress: () => {
              Linking.openURL(evidencia.arquivo).catch(() => {
                Alert.alert("Erro", "Não foi possível abrir o arquivo.");
              });
            }
          }
        ]
      );
    }
  };

  const handleEditEvidence = () => {
    Alert.alert("Em breve", "Funcionalidade de edição será implementada em breve.");
    
  };

  const handleDeleteEvidence = () => {
    Alert.alert(
      "Excluir Evidência",
      "Tem certeza que deseja excluir esta evidência? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: () => {
            // Implementar exclusão
            Alert.alert("Em breve", "Funcionalidade de exclusão será implementada em breve.");
          }
        }
      ]
    );
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

  if (error || !evidencia) {
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
          {error || 'Evidência não encontrada'}
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

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
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
          alignItems: 'center',
          marginBottom: 10
        }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              padding: 8,
              borderRadius: 20,
              backgroundColor: '#f0f0f0',
              marginRight: 15
            }}
          >
            <AntDesign name="arrowleft" size={20} color="#666" />
          </Pressable>
          
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#333'
            }}>
              Detalhes da Evidência
            </Text>
          </View>

          <View style={{
            flexDirection: 'row',
            gap: 10
          }}>
            <Pressable
              onPress={handleEditEvidence}
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: colors.steelBlue
              }}
            >
              <MaterialIcons name="edit" size={20} color="white" />
            </Pressable>
            
            <Pressable
              onPress={handleDeleteEvidence}
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: '#e74c3c'
              }}
            >
              <MaterialIcons name="delete" size={20} color="white" />
            </Pressable>
          </View>
        </View>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <MaterialIcons 
            name={getIconeArquivo(evidencia.tipoArquivo)} 
            size={24} 
            color={colors.steelBlue} 
          />
          <Text style={{
            fontSize: 16,
            color: '#666',
            marginLeft: 8,
            textTransform: 'capitalize'
          }}>
            {evidencia.tipoArquivo}
          </Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Informações Básicas */}
        <InfoSection title="Informações Básicas">
          <InfoRow
            icon="title"
            label="Título"
            value={evidencia.titulo}
          />
          
          <InfoRow
            icon="description"
            label="Descrição"
            value={evidencia.descricao}
          />
          
          <InfoRow
            icon="location-on"
            label="Local da Coleta"
            value={evidencia.localColeta}
          />
          
          <InfoRow
            icon="event"
            label="Data da Coleta"
            value={formatarData(evidencia.dataColeta)}
          />
        </InfoSection>

        {/* Arquivo */}
        <InfoSection title="Arquivo">
          <InfoRow
            icon={getIconeArquivo(evidencia.tipoArquivo)}
            label="Tipo de Arquivo"
            value={evidencia.tipoArquivo?.charAt(0).toUpperCase() + evidencia.tipoArquivo?.slice(1)}
          />
          
          {evidencia.tipoArquivo === 'imagem' && evidencia.arquivo && (
            <View style={{ marginBottom: 15 }}>
              <Text style={{
                fontSize: 14,
                color: '#999',
                marginBottom: 8
              }}>
                Preview
              </Text>
              <Image
                source={{ uri: evidencia.arquivo }}
                style={{
                  width: '100%',
                  height: 200,
                  borderRadius: 8,
                  backgroundColor: '#f0f0f0'
                }}
                resizeMode="cover"
              />
            </View>
          )}
          
          <InfoRow
            icon="cloud-download"
            label="Arquivo"
            value="Tocar para visualizar/baixar"
            onPress={handleDownloadFile}
          />
        </InfoSection>

        {/* Metadados */}
        <InfoSection title="Metadados">
          <InfoRow
            icon="person"
            label="Criado por"
            value={`${evidencia.criadoPor?.name} (${evidencia.criadoPor?.perfil})`}
          />
          
          <InfoRow
            icon="schedule"
            label="Data de Criação"
            value={formatarData(evidencia.criadoEm)}
          />
          
          <InfoRow
            icon="fingerprint"
            label="ID da Evidência"
            value={evidencia._id}
          />
          
          <InfoRow
            icon="folder"
            label="ID do Caso"
            value={evidencia.caso}
          />
        </InfoSection>

        {/* Ações */}
        <View style={{
          backgroundColor: 'white',
          marginHorizontal: 20,
          marginBottom: 30,
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
          padding: 20
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 15
          }}>
            Ações
          </Text>
          
          <View style={{ gap: 10 }}>
            <Pressable
              style={{
                backgroundColor: colors.steelBlue,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={handleDownloadFile}
            >
              <MaterialIcons name="cloud-download" size={20} color="white" />
              <Text style={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
                marginLeft: 8
              }}>
                Visualizar/Baixar Arquivo
              </Text>
            </Pressable>
            
            <Pressable
              style={{
                backgroundColor: '#f0f0f0',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={handleEditEvidence}
            >
              <MaterialIcons name="edit" size={20} color="#666" />
              <Text style={{
                color: '#666',
                fontSize: 16,
                fontWeight: 'bold',
                marginLeft: 8
              }}>
                Editar Evidência
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}