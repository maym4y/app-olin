import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState } from "react";
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

const tiposRelatorio = [
  {
    id: 'laudo_evidencia',
    nome: 'Laudo de Evidência',
    descricao: 'Análise técnica de evidências coletadas',
    icone: 'description',
    cor: colors.steelBlue
  },
  {
    id: 'laudo_odontologico',
    nome: 'Laudo Odontológico',
    descricao: 'Análise odontológica forense de vítimas',
    icone: 'medical-services',
    cor: colors.warmBeige
  },
  {
    id: 'relatorio_final',
    nome: 'Relatório Final',
    descricao: 'Relatório conclusivo do caso',
    icone: 'summarize',
    cor: colors.darkTeal
  },
  {
    id: 'relatorio_ia',
    nome: 'Relatório com IA',
    descricao: 'Relatório gerado automaticamente',
    icone: 'auto-awesome',
    cor: colors.midnightNavy
  }
];

export default function NewRelatorioModal({ 
  visible, 
  onClose, 
  casoId, 
  evidencias = [],
  vitimas = [],
  onRelatorioAdded 
}) {
  const [step, setStep] = useState(1); // 1: Escolher tipo, 2: Preencher dados
  const [tipoSelecionado, setTipoSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gerandoComIA, setGerandoComIA] = useState(false);
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    titulo: "",
    texto: "",
    observacoes: "",
    parecer: "",
    evidenciasSelecionadas: [],
    vitimaSelecionada: null
  });

  // Função para resetar o modal
  const resetModal = () => {
    setStep(1);
    setTipoSelecionado(null);
    setFormData({
      titulo: "",
      texto: "",
      observacoes: "",
      parecer: "",
      evidenciasSelecionadas: [],
      vitimaSelecionada: null
    });
  };

  // Função para fechar modal
  const handleClose = () => {
    if (!loading) {
      resetModal();
      onClose();
    }
  };

  // Função para selecionar tipo de relatório
  const selecionarTipo = (tipo) => {
    setTipoSelecionado(tipo);
    setStep(2);
    
    // Pré-preencher título baseado no tipo
    setFormData(prev => ({
      ...prev,
      titulo: `${tipo.nome} - Caso #${casoId?.slice(-6) || ''}`
    }));
  };

  // Função para atualizar campos do formulário
  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Função para criar o relatório
  const criarRelatorio = async () => {
    if (!validarFormulario()) return;

    setLoading(true);
    
    try {
      const token = await AsyncStorage.getItem('token');
      let response;

      switch (tipoSelecionado.id) {
        case 'laudo_evidencia':
          response = await criarLaudoEvidencia(token);
          break;
        case 'laudo_odontologico':
          response = await criarLaudoOdontologico(token);
          break;
        case 'relatorio_final':
          response = await criarRelatorioFinal(token);
          break;
        case 'relatorio_ia':
          response = await criarRelatorioIA(token);
          break;
        default:
          throw new Error('Tipo de relatório não implementado');
      }

      Alert.alert("Sucesso", "Relatório criado com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            handleClose();
            if (onRelatorioAdded) {
              onRelatorioAdded(response.data);
            }
          }
        }
      ]);

    } catch (error) {
      console.error('Erro ao criar relatório:', error);
      const mensagemErro = error.response?.data?.message || 'Erro ao criar relatório.';
      Alert.alert("Erro", mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  // Validação do formulário
  const validarFormulario = () => {
    if (!formData.titulo.trim()) {
      Alert.alert("Erro", "Título é obrigatório.");
      return false;
    }

    if (tipoSelecionado.id === 'laudo_odontologico') {
      if (!formData.vitimaSelecionada) {
        Alert.alert("Erro", "Selecione uma vítima para o laudo odontológico.");
        return false;
      }
      if (!formData.parecer.trim()) {
        Alert.alert("Erro", "Parecer técnico é obrigatório para laudos odontológicos.");
        return false;
      }
    } else if (tipoSelecionado.id !== 'relatorio_ia') {
      if (!formData.texto.trim()) {
        Alert.alert("Erro", "Conteúdo do relatório é obrigatório.");
        return false;
      }
    }

    return true;
  };

  // Criar laudo de evidência
  const criarLaudoEvidencia = async (token) => {
    return await axios.post(`${API_URL}/api/laudos`, {
      caso: casoId,
      evidencias: formData.evidenciasSelecionadas,
      texto: formData.texto
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  // Criar laudo odontológico
  const criarLaudoOdontologico = async (token) => {
    return await axios.post(`${API_URL}/api/laudos-odontologicos/${formData.vitimaSelecionada}`, {
      observacoes: formData.observacoes,
      parecer: formData.parecer
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  // Criar relatório final
  const criarRelatorioFinal = async (token) => {
    return await axios.post(`${API_URL}/api/relatorios/${casoId}`, {
      titulo: formData.titulo,
      texto: formData.texto
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  // Função para gerar conteúdo com IA
  const gerarConteudoComIA = async () => {
    setGerandoComIA(true);
    
    try {
      const token = await AsyncStorage.getItem('token');
      let prompt = '';
      let endpoint = '';

      switch (tipoSelecionado.id) {
        case 'laudo_evidencia':
          prompt = gerarPromptLaudoEvidencia();
          endpoint = `/api/ia/gerar-laudo-evidencia`;
          break;
        case 'laudo_odontologico':
          if (!formData.vitimaSelecionada) {
            Alert.alert("Erro", "Selecione uma vítima primeiro para gerar o laudo odontológico.");
            return;
          }
          prompt = gerarPromptLaudoOdontologico();
          endpoint = `/api/ia/gerar-laudo-odontologico`;
          break;
        case 'relatorio_final':
          prompt = gerarPromptRelatorioFinal();
          endpoint = `/api/ia/gerar-relatorio-final`;
          break;
        case 'relatorio_ia':
          prompt = gerarPromptRelatorioIA();
          endpoint = `/api/ia/gerar-relatorio-completo`;
          break;
      }

      const response = await axios.post(`${API_URL}${endpoint}`, {
        casoId,
        prompt,
        evidencias: evidencias,
        vitimas: vitimas,
        vitimaSelecionada: formData.vitimaSelecionada,
        evidenciasSelecionadas: formData.evidenciasSelecionadas
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Preencher os campos com o conteúdo gerado
      const conteudoGerado = response.data.conteudo;
      
      if (tipoSelecionado.id === 'laudo_odontologico') {
        updateField('observacoes', conteudoGerado.observacoes || '');
        updateField('parecer', conteudoGerado.parecer || '');
      } else {
        updateField('texto', conteudoGerado.texto || conteudoGerado);
      }

      Alert.alert(
        "Conteúdo Gerado!",
        "A IA gerou o conteúdo do relatório. Você pode editar as informações antes de salvar.",
        [{ text: "OK" }]
      );

    } catch (error) {
      console.error('Erro ao gerar conteúdo com IA:', error);
      Alert.alert(
        "Erro na Geração",
        error.response?.data?.message || "Não foi possível gerar o conteúdo com IA. Você pode preencher manualmente.",
        [{ text: "OK" }]
      );
    } finally {
      setGerandoComIA(false);
    }
  };

  // Prompts específicos para cada tipo
  const gerarPromptLaudoEvidencia = () => {
    const evidenciasSelecionadasData = evidencias.filter(ev => 
      formData.evidenciasSelecionadas.includes(ev._id)
    );
    
    return `Gere um laudo técnico de evidências para um caso pericial.
    
Evidências analisadas:
${evidenciasSelecionadasData.map(ev => `
- ${ev.titulo}
  Tipo: ${ev.tipoArquivo}
  Descrição: ${ev.descricao}
  Local de coleta: ${ev.localColeta}
`).join('\n')}

O laudo deve conter:
1. Metodologia de análise
2. Resultados encontrados
3. Interpretação técnica
4. Conclusões
5. Grau de certeza científica

Formato: Texto técnico formal em português brasileiro.`;
  };

  const gerarPromptLaudoOdontologico = () => {
    const vitimaSelecionadaData = vitimas.find(v => v._id === formData.vitimaSelecionada);
    
    return `Gere um laudo odontológico forense.
    
Dados da vítima:
- Nome: ${vitimaSelecionadaData?.nome}
- NIC: ${vitimaSelecionadaData?.nic}
- Idade: ${vitimaSelecionadaData?.idade} anos
- Gênero: ${vitimaSelecionadaData?.genero}

Gere separadamente:
1. Observações: Descrição técnica dos achados odontológicos
2. Parecer: Conclusão pericial baseada nos achados

Responda em formato JSON:
{
  "observacoes": "texto das observações",
  "parecer": "texto do parecer técnico"
}`;
  };

  const gerarPromptRelatorioFinal = () => {
    return `Gere um relatório final conclusivo para este caso pericial.
    
Dados do caso:
- Total de evidências: ${evidencias.length}
- Total de vítimas: ${vitimas.length}

Evidências disponíveis:
${evidencias.map(ev => `- ${ev.titulo}: ${ev.descricao}`).join('\n')}

O relatório deve incluir:
1. Resumo executivo
2. Metodologia utilizada
3. Principais achados
4. Análise técnica
5. Conclusões finais
6. Recomendações

Formato: Relatório formal e conclusivo.`;
  };

  const gerarPromptRelatorioIA = () => {
    return `Gere um relatório completo e abrangente deste caso pericial usando IA.
    
Este relatório deve ser gerado automaticamente baseado em todos os dados disponíveis:
- ${evidencias.length} evidências
- ${vitimas.length} vítimas

Inclua análise automatizada, correlações encontradas e insights gerados pela IA.`;
  };
  const criarRelatorioIA = async (token) => {
    return await axios.post(`${API_URL}/api/relatorios/${casoId}/generate-ia`, {
      titulo: formData.titulo
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  // Renderizar Step 1: Escolher tipo
  const renderEscolherTipo = () => (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
      <Text style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center'
      }}>
        Que tipo de relatório deseja criar?
      </Text>

      {tiposRelatorio.map((tipo) => (
        <Pressable
          key={tipo.id}
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 20,
            marginBottom: 15,
            borderLeftWidth: 4,
            borderLeftColor: tipo.cor,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
          onPress={() => selecionarTipo(tipo)}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8
          }}>
            <MaterialIcons name={tipo.icone} size={24} color={tipo.cor} />
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#333',
              marginLeft: 12,
              flex: 1
            }}>
              {tipo.nome}
            </Text>
            <AntDesign name="right" size={16} color="#ccc" />
          </View>
          
          <Text style={{
            fontSize: 14,
            color: '#666',
            marginLeft: 36
          }}>
            {tipo.descricao}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );

  // Renderizar Step 2: Formulário
  const renderFormulario = () => (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
      {/* Header do tipo selecionado */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: tipoSelecionado.cor
      }}>
        <MaterialIcons name={tipoSelecionado.icone} size={24} color={tipoSelecionado.cor} />
        <Text style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: '#333',
          marginLeft: 12
        }}>
          {tipoSelecionado.nome}
        </Text>
      </View>

      {/* Título */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: '#333',
          marginBottom: 8
        }}>
          Título *
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
          placeholder="Digite o título do relatório"
          value={formData.titulo}
          onChangeText={(text) => updateField('titulo', text)}
          editable={!loading}
        />
      </View>

      {/* Campos específicos por tipo */}
      {tipoSelecionado.id === 'laudo_odontologico' && (
        <>
          {/* Seleção de vítima */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 8
            }}>
              Vítima *
            </Text>
            
            {vitimas.length > 0 ? (
              vitimas.map((vitima) => (
                <Pressable
                  key={vitima._id}
                  style={{
                    backgroundColor: formData.vitimaSelecionada === vitima._id ? colors.lightGray : 'white',
                    borderRadius: 8,
                    padding: 15,
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: formData.vitimaSelecionada === vitima._id ? tipoSelecionado.cor : '#e0e0e0'
                  }}
                  onPress={() => updateField('vitimaSelecionada', vitima._id)}
                >
                  <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    {vitima.nome}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: '#666'
                  }}>
                    NIC: {vitima.nic}
                  </Text>
                </Pressable>
              ))
            ) : (
              <Text style={{
                fontSize: 14,
                color: '#999',
                fontStyle: 'italic'
              }}>
                Nenhuma vítima cadastrada neste caso
              </Text>
            )}
          </View>

          {/* Observações com IA */}
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
                Observações
              </Text>
              
              <Pressable
                style={{
                  backgroundColor: gerandoComIA ? '#ccc' : '#9c27b0',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 6,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
                onPress={gerarConteudoComIA}
                disabled={gerandoComIA || loading || !formData.vitimaSelecionada}
              >
                {gerandoComIA ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <MaterialIcons name="auto-awesome" size={14} color="white" />
                )}
                <Text style={{
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 'bold',
                  marginLeft: 4
                }}>
                  {gerandoComIA ? 'Gerando...' : 'IA'}
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
                borderColor: '#e0e0e0',
                minHeight: 100,
                textAlignVertical: 'top'
              }}
              placeholder="Observações sobre o exame odontológico ou use a IA..."
              value={formData.observacoes}
              onChangeText={(text) => updateField('observacoes', text)}
              multiline
              numberOfLines={4}
              editable={!loading && !gerandoComIA}
            />
          </View>

          {/* Parecer com IA */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 8
            }}>
              Parecer Técnico *
            </Text>
            <TextInput
              style={{
                backgroundColor: 'white',
                borderRadius: 8,
                padding: 15,
                fontSize: 16,
                borderWidth: 1,
                borderColor: '#e0e0e0',
                minHeight: 120,
                textAlignVertical: 'top'
              }}
              placeholder="Parecer técnico do perito odontológico..."
              value={formData.parecer}
              onChangeText={(text) => updateField('parecer', text)}
              multiline
              numberOfLines={5}
              editable={!loading && !gerandoComIA}
            />
          </View>
        </>
      )}

      {/* Campos para laudos de evidência */}
      {tipoSelecionado.id === 'laudo_evidencia' && (
        <>
          {/* Seleção de evidências */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 8
            }}>
              Evidências Analisadas
            </Text>
            
            {evidencias.length > 0 ? (
              evidencias.map((evidencia) => (
                <Pressable
                  key={evidencia._id}
                  style={{
                    backgroundColor: formData.evidenciasSelecionadas.includes(evidencia._id) ? colors.lightGray : 'white',
                    borderRadius: 8,
                    padding: 15,
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: formData.evidenciasSelecionadas.includes(evidencia._id) ? tipoSelecionado.cor : '#e0e0e0'
                  }}
                  onPress={() => {
                    const selecionadas = formData.evidenciasSelecionadas;
                    if (selecionadas.includes(evidencia._id)) {
                      updateField('evidenciasSelecionadas', selecionadas.filter(id => id !== evidencia._id));
                    } else {
                      updateField('evidenciasSelecionadas', [...selecionadas, evidencia._id]);
                    }
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    {evidencia.titulo}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: '#666'
                  }}>
                    Tipo: {evidencia.tipoArquivo}
                  </Text>
                </Pressable>
              ))
            ) : (
              <Text style={{
                fontSize: 14,
                color: '#999',
                fontStyle: 'italic'
              }}>
                Nenhuma evidência cadastrada neste caso
              </Text>
            )}
          </View>

          {/* Conteúdo do laudo com botão de IA */}
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
                Conteúdo do Laudo *
              </Text>
              
              <Pressable
                style={{
                  backgroundColor: gerandoComIA ? '#ccc' : '#9c27b0',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 6,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
                onPress={gerarConteudoComIA}
                disabled={gerandoComIA || loading}
              >
                {gerandoComIA ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <MaterialIcons name="auto-awesome" size={14} color="white" />
                )}
                <Text style={{
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 'bold',
                  marginLeft: 4
                }}>
                  {gerandoComIA ? 'Gerando...' : 'IA'}
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
                borderColor: '#e0e0e0',
                minHeight: 150,
                textAlignVertical: 'top'
              }}
              placeholder="Digite o conteúdo técnico do laudo ou use a IA para gerar automaticamente..."
              value={formData.texto}
              onChangeText={(text) => updateField('texto', text)}
              multiline
              numberOfLines={8}
              editable={!loading && !gerandoComIA}
            />
          </View>
        </>
      )}

      {/* Campos para relatório final */}
      {(tipoSelecionado.id === 'relatorio_final') && (
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
              Conteúdo do Relatório *
            </Text>
            
            <Pressable
              style={{
                backgroundColor: gerandoComIA ? '#ccc' : '#9c27b0',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={gerarConteudoComIA}
              disabled={gerandoComIA || loading}
            >
              {gerandoComIA ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <MaterialIcons name="auto-awesome" size={14} color="white" />
              )}
              <Text style={{
                color: 'white',
                fontSize: 12,
                fontWeight: 'bold',
                marginLeft: 4
              }}>
                {gerandoComIA ? 'Gerando...' : 'IA'}
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
              borderColor: '#e0e0e0',
              minHeight: 200,
              textAlignVertical: 'top'
            }}
            placeholder="Digite o conteúdo do relatório final ou use a IA para gerar automaticamente..."
            value={formData.texto}
            onChangeText={(text) => updateField('texto', text)}
            multiline
            numberOfLines={10}
            editable={!loading && !gerandoComIA}
          />
        </View>
      )}

      {/* Info para relatório com IA */}
      {tipoSelecionado.id === 'relatorio_ia' && (
        <View style={{
          backgroundColor: '#f0f8ff',
          borderRadius: 8,
          padding: 20,
          marginBottom: 20,
          borderLeftWidth: 4,
          borderLeftColor: colors.midnightNavy
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10
          }}>
            <MaterialIcons name="auto-awesome" size={20} color={colors.midnightNavy} />
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: colors.midnightNavy,
              marginLeft: 8
            }}>
              Relatório com Inteligência Artificial
            </Text>
          </View>
          <Text style={{
            fontSize: 14,
            color: '#666',
            lineHeight: 20,
            marginBottom: 15
          }}>
            Este relatório será gerado automaticamente pela IA com base em todas as evidências e laudos do caso.
          </Text>
          
          <Pressable
            style={{
              backgroundColor: gerandoComIA ? '#ccc' : colors.midnightNavy,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPress={gerarConteudoComIA}
            disabled={gerandoComIA || loading}
          >
            {gerandoComIA ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <MaterialIcons name="auto-awesome" size={16} color="white" />
            )}
            <Text style={{
              color: 'white',
              fontSize: 14,
              fontWeight: 'bold',
              marginLeft: 8
            }}>
              {gerandoComIA ? 'Gerando Relatório...' : 'Gerar com IA'}
            </Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );

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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {step === 2 && (
              <Pressable
                onPress={() => setStep(1)}
                style={{
                  padding: 8,
                  borderRadius: 20,
                  backgroundColor: '#f0f0f0',
                  marginRight: 15
                }}
              >
                <AntDesign name="arrowleft" size={20} color="#666" />
              </Pressable>
            )}
            
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#333'
            }}>
              {step === 1 ? 'Novo Relatório' : tipoSelecionado?.nome}
            </Text>
          </View>
          
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

        {/* Conteúdo */}
        {step === 1 ? renderEscolherTipo() : renderFormulario()}

        {/* Botões de ação - apenas no step 2 */}
        {step === 2 && (
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            flexDirection: 'row',
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
              onPress={() => setStep(1)}
              disabled={loading}
            >
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#666'
              }}>
                Voltar
              </Text>
            </Pressable>

            <Pressable
              style={{
                flex: 1,
                backgroundColor: loading || gerandoComIA ? '#ccc' : tipoSelecionado?.cor || colors.midnightNavy,
                paddingVertical: 15,
                borderRadius: 8,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center'
              }}
              onPress={criarRelatorio}
              disabled={loading || gerandoComIA}
            >
              {(loading || gerandoComIA) && (
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
                {loading ? 'Criando...' : gerandoComIA ? 'Aguarde...' : 'Criar Relatório'}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </Modal>
  );
}