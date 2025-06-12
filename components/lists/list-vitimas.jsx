// components/list-vitimas.jsx
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, FlatList, Pressable, Text, View } from "react-native";

// Cores definidas localmente
const colors = {
  darkTeal: '#2C5F5D',
  steelBlue: '#4682B4',
  warmBeige: '#D2B48C',
  grayBlue: '#708090'
};

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

// Função para formatar idade
const formatarIdade = (idade) => {
  if (!idade) return 'Não informado';
  return `${idade} anos`;
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

// Componente de card individual da vítima
const VitimaCard = ({ vitima, onPress }) => {
  const router = useRouter();

  console.log('=== DEBUG VitimaCard ===');
  console.log('Vítima recebida:', vitima);

  const handlePress = () => {
    console.log('CLICOU! ID da vítima:', vitima._id);
    
    Alert.alert(
      'Vítima selecionada', 
      `Nome: ${vitima.nome}\nNIC: ${vitima.nic}`,
      [
        { text: 'Cancelar' },
        { 
          text: 'Ver detalhes', 
          onPress: () => {
            router.push(`/vitimas/${vitima._id}`);
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
        borderLeftColor: getCorSexo(vitima.sexo),
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
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 4
          }}>
            {vitima.nome}
          </Text>
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <MaterialIcons 
              name="badge" 
              size={14} 
              color={getCorSexo(vitima.sexo)} 
            />
            <Text style={{
              fontSize: 12,
              color: getCorSexo(vitima.sexo),
              marginLeft: 4,
              fontWeight: '600'
            }}>
              NIC: {vitima.nic}
            </Text>
          </View>
        </View>
        
        <View style={{
          backgroundColor: getCorSexo(vitima.sexo),
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12
        }}>
          <Text style={{
            color: 'white',
            fontSize: 10,
            fontWeight: '600'
          }}>
            {vitima.sexo?.toUpperCase() || 'N/I'}
          </Text>
        </View>
      </View>
      
      {/* Informações principais */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6
      }}>
        <MaterialIcons name="cake" size={14} color="#666" />
        <Text style={{
          fontSize: 13,
          color: '#666',
          marginLeft: 6,
          flex: 1
        }}>
          Idade: {formatarIdade(vitima.idade)}
        </Text>
      </View>

      {/* Nacionalidade */}
      {vitima.nacionalidade && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 6
        }}>
          <MaterialIcons name="public" size={14} color="#666" />
          <Text style={{
            fontSize: 13,
            color: '#666',
            marginLeft: 6,
            flex: 1
          }}>
            {vitima.nacionalidade}
          </Text>
        </View>
      )}

      {/* Profissão */}
      {vitima.profissao && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 6
        }}>
          <MaterialIcons name="work" size={14} color="#666" />
          <Text style={{
            fontSize: 13,
            color: '#666',
            marginLeft: 6,
            flex: 1
          }}>
            {vitima.profissao}
          </Text>
        </View>
      )}

      {/* Caso vinculado */}
      {vitima.caso && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 6
        }}>
          <MaterialIcons name="folder" size={14} color="#666" />
          <Text style={{
            fontSize: 13,
            color: '#666',
            marginLeft: 6,
            flex: 1
          }}>
            Caso: {vitima.caso.titulo}
          </Text>
        </View>
      )}

      {/* Regiões anatômicas (se existirem) */}
      {vitima.regioesAnatomicas && vitima.regioesAnatomicas.length > 0 && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 6
        }}>
          <MaterialIcons name="anatomy" size={14} color="#9c27b0" />
          <Text style={{
            fontSize: 13,
            color: '#9c27b0',
            marginLeft: 6,
            flex: 1,
            fontWeight: '600'
          }}>
            {vitima.regioesAnatomicas.length} região(ões) mapeada(s)
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
        <Text style={{
          fontSize: 11,
          color: '#999'
        }}>
          Cadastrado: {formatarData(vitima.createdAt)}
        </Text>
        
        <View style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          {vitima.criadoPor && (
            <Text style={{
              fontSize: 11,
              color: '#999',
              marginRight: 8
            }}>
              por {vitima.criadoPor.name}
            </Text>
          )}
          <AntDesign name="right" size={16} color="#ccc" />
        </View>
      </View>
    </Pressable>
  );
};

// Componente principal da lista de vítimas
export default function ListVitimas({ vitimas, onVitimaPress, onAddVitima }) {
  
  // Debug: vamos ver o que está chegando
  console.log('=== DEBUG ListVitimas ===');
  console.log('Número de vítimas:', vitimas?.length || 0);
  console.log('Vítimas recebidas:', vitimas);

  // Renderização do item da lista
  const renderItem = ({ item }) => {
    console.log('Renderizando vítima:', item._id, item.nome);
    return (
      <VitimaCard 
        vitima={item} 
        onPress={onVitimaPress}
      />
    );
  };

  // Renderização quando não há vítimas
  const renderEmptyState = () => (
    <View style={{
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 40,
      alignItems: 'center',
      margin: 20
    }}>
      <MaterialIcons name="person-outline" size={48} color="#ccc" />
      <Text style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#999',
        marginTop: 15,
        textAlign: 'center'
      }}>
        Nenhuma vítima cadastrada
      </Text>
      <Text style={{
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        textAlign: 'center',
        marginBottom: 20
      }}>
        Este caso ainda não possui vítimas registradas
      </Text>
      
      {onAddVitima && (
        <Pressable
          style={{
            backgroundColor: colors.darkTeal,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center'
          }}
          onPress={onAddVitima}
        >
          <AntDesign name="plus" size={16} color="white" />
          <Text style={{
            color: 'white',
            fontSize: 14,
            fontWeight: 'bold',
            marginLeft: 8
          }}>
            Adicionar Vítima
          </Text>
        </Pressable>
      )}
    </View>
  );

  // Se não há vítimas, mostrar estado vazio
  if (!vitimas || vitimas.length === 0) {
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
          Vítimas ({vitimas.length})
        </Text>
        
        {onAddVitima && (
          <Pressable
            style={{
              backgroundColor: colors.darkTeal,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
              flexDirection: 'row',
              alignItems: 'center'
            }}
            onPress={onAddVitima}
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

      {/* Lista de vítimas */}
      <FlatList
        data={vitimas}
        keyExtractor={(item) => item._id || `vitima-${Date.now()}`}
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