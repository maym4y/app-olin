import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { colors } from "../../constants/colors";

// Função para formatar data
const formatarData = (dataString) => {
  if (!dataString) return 'N/A';
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Função para obter ícone baseado no tipo de arquivo
const getIconeArquivo = (tipoArquivo) => {
  switch (tipoArquivo) {
    case 'imagem':
      return 'image';
    case 'documento':
      return 'description';
    case 'video':
      return 'videocam';
    default:
      return 'attachment';
  }
};

// Componente de card individual da evidência
const EvidenciaCard = ({ evidencia, onPress }) => {
  const router = useRouter();

  console.log('=== DEBUG EvidenciaCard ===');
  console.log('Evidência recebida:', evidencia);

  const handlePress = () => {
    console.log('CLICOU! ID:', evidencia._id);
    // Só um alert simples para testar se o clique funciona
    Alert.alert(
      'Evidência selecionada', 
      `Título: ${evidencia.titulo}\nID: ${evidencia._id}`,
      [
        { text: 'Cancelar' },
        { 
          text: 'Ir para detalhes', 
          onPress: () => {
            router.push(`/evidencias/${evidencia._id}`);
          }
        }
      ]
    );
  };

  return (
    <Pressable 
      style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: colors.steelBlue,
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
          {evidencia.titulo}
        </Text>
        <View style={{
          backgroundColor: colors.steelBlue,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12
        }}>
          <Text style={{
            color: 'white',
            fontSize: 10,
            fontWeight: '600'
          }}>
            {evidencia.tipoArquivo?.toUpperCase()}
          </Text>
        </View>
      </View>
      
      {/* Descrição */}
      {evidencia.descricao && (
        <Text style={{
          fontSize: 14,
          color: '#666',
          marginBottom: 8,
          lineHeight: 20
        }}>
          {evidencia.descricao.length > 100 
            ? `${evidencia.descricao.substring(0, 100)}...` 
            : evidencia.descricao
          }
        </Text>
      )}
      
      {/* Local da coleta */}
      {evidencia.localColeta && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 6
        }}>
          <MaterialIcons name="location-on" size={14} color="#666" />
          <Text style={{
            fontSize: 13,
            color: '#666',
            marginLeft: 6,
            flex: 1
          }}>
            {evidencia.localColeta}
          </Text>
        </View>
      )}
      
      {/* Informações do rodapé */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0'
      }}>
        <View>
          <Text style={{
            fontSize: 11,
            color: '#999'
          }}>
            Coletado: {formatarData(evidencia.dataColeta)}
          </Text>
          <Text style={{
            fontSize: 11,
            color: '#999'
          }}>
            Por: {evidencia.criadoPor?.name || 'Usuário não identificado'}
          </Text>
        </View>
        
        <Text style={{
          fontSize: 11,
          color: '#999'
        }}>
          {formatarData(evidencia.criadoEm)}
        </Text>
      </View>
    </Pressable>
  );
};

// Componente principal da lista de evidências
export default function ListEvidencias({ evidencias, onEvidenciaPress, onAddEvidence }) {
  
  // Debug: vamos ver o que está chegando
  console.log('=== DEBUG ListEvidencias ===');
  console.log('Número de evidências:', evidencias?.length || 0);
  console.log('Evidências recebidas:', evidencias);

  // Renderização do item da lista
  const renderItem = ({ item }) => {
    console.log('Renderizando item:', item._id, item.titulo);
    return (
      <EvidenciaCard 
        evidencia={item} 
        onPress={onEvidenciaPress}
      />
    );
  };

  // Renderização quando não há evidências
  const renderEmptyState = () => (
    <View style={{
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 40,
      alignItems: 'center',
      margin: 20
    }}>
      <MaterialIcons name="insert-drive-file" size={48} color="#ccc" />
      <Text style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#999',
        marginTop: 15,
        textAlign: 'center'
      }}>
        Nenhuma evidência cadastrada
      </Text>
      <Text style={{
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        textAlign: 'center',
        marginBottom: 20
      }}>
        Este caso ainda não possui evidências registradas
      </Text>
      
      {onAddEvidence && (
        <Pressable
          style={{
            backgroundColor: colors.steelBlue,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center'
          }}
          onPress={onAddEvidence}
        >
          <AntDesign name="plus" size={16} color="white" />
          <Text style={{
            color: 'white',
            fontSize: 14,
            fontWeight: 'bold',
            marginLeft: 8
          }}>
            Adicionar Evidência
          </Text>
        </Pressable>
      )}
    </View>
  );

  // Se não há evidências, mostrar estado vazio
  if (!evidencias || evidencias.length === 0) {
    return renderEmptyState();
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header da lista */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0'
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333'
        }}>
          Evidências ({evidencias.length})
        </Text>
        
        {onAddEvidence && (
          <Pressable
            style={{
              backgroundColor: colors.steelBlue,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
              flexDirection: 'row',
              alignItems: 'center'
            }}
            onPress={onAddEvidence}
          >
            <AntDesign name="plus" size={14} color="white" />
            <Text style={{
              color: 'white',
              fontSize: 12,
              fontWeight: 'bold',
              marginLeft: 4
            }}>
              Adicionar
            </Text>
          </Pressable>
        )}
      </View>

      {/* Lista de evidências */}
      <FlatList
        data={evidencias}
        keyExtractor={(item) => item._id || item.titulo}
        renderItem={renderItem}
        contentContainerStyle={{ 
          padding: 20,
          paddingBottom: 40
        }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </View>
  );
}