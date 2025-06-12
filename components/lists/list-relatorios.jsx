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

// Função para obter ícone baseado no tipo de relatório
const getIconeRelatorio = (tipoRelatorio) => {
  switch (tipoRelatorio) {
    case 'laudo_evidencia':
      return 'description';
    case 'laudo_odontologico':
      return 'medical-services';
    case 'relatorio_final':
      return 'summarize';
    case 'relatorio_ia':
      return 'auto-awesome';
    default:
      return 'article';
  }
};

// Função para obter nome amigável do tipo
const getNomeTipo = (tipoRelatorio) => {
  switch (tipoRelatorio) {
    case 'laudo_evidencia':
      return 'Laudo de Evidência';
    case 'laudo_odontologico':
      return 'Laudo Odontológico';
    case 'relatorio_final':
      return 'Relatório Final';
    case 'relatorio_ia':
      return 'Relatório com IA';
    default:
      return 'Relatório';
  }
};

// Função para obter cor baseada no tipo
const getCorTipo = (tipoRelatorio) => {
  switch (tipoRelatorio) {
    case 'laudo_evidencia':
      return colors.steelBlue;
    case 'laudo_odontologico':
      return colors.warmBeige;
    case 'relatorio_final':
      return colors.darkTeal;
    case 'relatorio_ia':
      return colors.midnightNavy;
    default:
      return colors.grayBlue;
  }
};

// Componente de card individual do relatório
const RelatorioCard = ({ relatorio, onPress }) => {
  const router = useRouter();

  console.log('=== DEBUG RelatorioCard ===');
  console.log('Relatório recebido:', relatorio);

  const handlePress = () => {
    console.log('CLICOU! ID:', relatorio._id);
    // Determinar rota baseada no tipo
    let rota = `/relatorios/${relatorio._id}`;
    
    if (relatorio.tipo === 'laudo_evidencia') {
      rota = `/laudos/${relatorio._id}`;
    } else if (relatorio.tipo === 'laudo_odontologico') {
      rota = `/laudos-odontologicos/${relatorio._id}`;
    }

    Alert.alert(
      'Relatório selecionado', 
      `Tipo: ${getNomeTipo(relatorio.tipo)}\nTítulo: ${relatorio.titulo || 'Sem título'}`,
      [
        { text: 'Cancelar' },
        { 
          text: 'Ver detalhes', 
          onPress: () => {
            router.push(rota);
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
        borderLeftColor: getCorTipo(relatorio.tipo),
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
            {relatorio.titulo || `${getNomeTipo(relatorio.tipo)} #${relatorio._id?.slice(-6)}`}
          </Text>
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <MaterialIcons 
              name={getIconeRelatorio(relatorio.tipo)} 
              size={14} 
              color={getCorTipo(relatorio.tipo)} 
            />
            <Text style={{
              fontSize: 12,
              color: getCorTipo(relatorio.tipo),
              marginLeft: 4,
              fontWeight: '600'
            }}>
              {getNomeTipo(relatorio.tipo)}
            </Text>
          </View>
        </View>
        
        <View style={{
          backgroundColor: getCorTipo(relatorio.tipo),
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12
        }}>
          <Text style={{
            color: 'white',
            fontSize: 10,
            fontWeight: '600'
          }}>
            {relatorio.status?.toUpperCase() || 'CONCLUÍDO'}
          </Text>
        </View>
      </View>
      
      {/* Resumo/Descrição */}
      {(relatorio.texto || relatorio.observacoes || relatorio.parecer) && (
        <Text style={{
          fontSize: 14,
          color: '#666',
          marginBottom: 8,
          lineHeight: 20
        }}>
          {((relatorio.texto || relatorio.observacoes || relatorio.parecer) || '').length > 120 
            ? `${((relatorio.texto || relatorio.observacoes || relatorio.parecer) || '').substring(0, 120)}...` 
            : (relatorio.texto || relatorio.observacoes || relatorio.parecer)
          }
        </Text>
      )}
      
      {/* Autor */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6
      }}>
        <MaterialIcons name="person" size={14} color="#666" />
        <Text style={{
          fontSize: 13,
          color: '#666',
          marginLeft: 6,
          flex: 1
        }}>
          {relatorio.autor?.name || relatorio.perito?.name || relatorio.criadoPor?.name || 'Autor não identificado'}
        </Text>
      </View>

      {/* Evidências vinculadas (se for laudo de evidência) */}
      {relatorio.evidencias && relatorio.evidencias.length > 0 && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 6
        }}>
          <MaterialIcons name="attachment" size={14} color="#666" />
          <Text style={{
            fontSize: 13,
            color: '#666',
            marginLeft: 6,
            flex: 1
          }}>
            {relatorio.evidencias.length} evidência(s) vinculada(s)
          </Text>
        </View>
      )}

      {/* Vítima (se for laudo odontológico) */}
      {relatorio.vitima && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 6
        }}>
          <MaterialIcons name="badge" size={14} color="#666" />
          <Text style={{
            fontSize: 13,
            color: '#666',
            marginLeft: 6,
            flex: 1
          }}>
            Vítima: {relatorio.vitima.nome} (NIC: {relatorio.vitima.nic})
          </Text>
        </View>
      )}

      {/* IA (se foi gerado com IA) */}
      {relatorio.geradoComIA && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 6
        }}>
          <MaterialIcons name="auto-awesome" size={14} color="#9c27b0" />
          <Text style={{
            fontSize: 13,
            color: '#9c27b0',
            marginLeft: 6,
            flex: 1,
            fontWeight: '600'
          }}>
            Gerado com Inteligência Artificial
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
          Criado: {formatarData(relatorio.criadoEm || relatorio.dataEmissao || relatorio.createdAt)}
        </Text>
        
        <AntDesign name="right" size={16} color="#ccc" />
      </View>
    </Pressable>
  );
};

// Componente principal da lista de relatórios
export default function ListRelatorios({ relatorios, onRelatorioPress, onAddRelatorio }) {
  
  // Debug: vamos ver o que está chegando
  console.log('=== DEBUG ListRelatorios ===');
  console.log('Número de relatórios:', relatorios?.length || 0);
  console.log('Relatórios recebidos:', relatorios);

  // Renderização do item da lista
  const renderItem = ({ item }) => {
    console.log('Renderizando item:', item._id, item.titulo || item.tipo);
    return (
      <RelatorioCard 
        relatorio={item} 
        onPress={onRelatorioPress}
      />
    );
  };

  // Renderização quando não há relatórios
  const renderEmptyState = () => (
    <View style={{
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 40,
      alignItems: 'center',
      margin: 20
    }}>
      <MaterialIcons name="article" size={48} color="#ccc" />
      <Text style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#999',
        marginTop: 15,
        textAlign: 'center'
      }}>
        Nenhum relatório cadastrado
      </Text>
      <Text style={{
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        textAlign: 'center',
        marginBottom: 20
      }}>
        Este caso ainda não possui relatórios ou laudos
      </Text>
      
      {onAddRelatorio && (
        <Pressable
          style={{
            backgroundColor: colors.darkTeal,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center'
          }}
          onPress={onAddRelatorio}
        >
          <AntDesign name="plus" size={16} color="white" />
          <Text style={{
            color: 'white',
            fontSize: 14,
            fontWeight: 'bold',
            marginLeft: 8
          }}>
            Adicionar Relatório
          </Text>
        </Pressable>
      )}
    </View>
  );

  // Se não há relatórios, mostrar estado vazio
  if (!relatorios || relatorios.length === 0) {
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
          Relatórios e Laudos ({relatorios.length})
        </Text>
        
        {onAddRelatorio && (
          <Pressable
            style={{
              backgroundColor: colors.darkTeal,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
              flexDirection: 'row',
              alignItems: 'center'
            }}
            onPress={onAddRelatorio}
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

      {/* Lista de relatórios */}
      <FlatList
        data={relatorios}
        keyExtractor={(item) => item._id || `${item.tipo}-${Date.now()}`}
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