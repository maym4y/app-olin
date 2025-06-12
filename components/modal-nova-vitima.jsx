import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { colors } from "../constants/colors";

const API_URL = "https://case-api-icfc.onrender.com";

export default function ModalNovaVitima({ 
  visible, 
  onClose, 
  casoId, 
  onVitimaCreated 
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nic: '',
    nome: '',
    genero: '',
    idade: '',
    documento: '',
    endereco: '',
    corEtnia: '',
    nacionalidade: '',
    profissao: '',
    observacoes: ''
  });

  // Função para resetar o formulário
  const resetForm = () => {
    setFormData({
      nic: '',
      nome: '',
      genero: '',
      idade: '',
      documento: '',
      endereco: '',
      corEtnia: '',
      nacionalidade: '',
      profissao: '',
      observacoes: ''
    });
  };

  // Função para validar o formulário
  const validarFormulario = () => {
    const { nic, nome, genero, idade, documento } = formData;
    
    if (!nic.trim()) {
      Alert.alert("Erro", "NIC é obrigatório");
      return false;
    }
    
    if (!nome.trim()) {
      Alert.alert("Erro", "Nome é obrigatório");
      return false;
    }
    
    if (!genero) {
      Alert.alert("Erro", "Sexo é obrigatório");
      return false;
    }
    
    if (!idade || isNaN(idade) || idade <= 0) {
      Alert.alert("Erro", "Idade deve ser um número válido");
      return false;
    }
    
    if (!documento.trim()) {
      Alert.alert("Erro", "Documento é obrigatório");
      return false;
    }
    
    return true;
  };

  // Função para criar a vítima
  const handleCreateVitima = async () => {
    if (!validarFormulario()) return;

    setLoading(true);
    
    try {
      const token = await AsyncStorage.getItem("token");
      
      const dadosEnvio = {
        ...formData,
        idade: parseInt(formData.idade),
        caso: casoId,
        // Campos opcionais
        endereco: formData.endereco.trim() || undefined,
        corEtnia: formData.corEtnia.trim() || undefined,
        nacionalidade: formData.nacionalidade.trim() || undefined,
        profissao: formData.profissao.trim() || undefined,
        observacoes: formData.observacoes.trim() || undefined
      };

      console.log("Enviando dados:", dadosEnvio);

      const response = await axios.post(
        `${API_URL}/api/vitimas`,
        dadosEnvio,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      Alert.alert(
        "Sucesso", 
        "Vítima cadastrada com sucesso!",
        [
          {
            text: "OK",
            onPress: () => {
              resetForm();
              onClose();
              if (onVitimaCreated) {
                onVitimaCreated(response.data.vitima);
              }
            }
          }
        ]
      );

    } catch (error) {
      console.error("Erro ao criar vítima:", error);
      
      let mensagemErro = "Erro ao cadastrar vítima";
      
      if (error.response) {
        if (error.response.status === 400) {
          mensagemErro = error.response.data.message || "Dados inválidos";
        } else if (error.response.status === 403) {
          mensagemErro = "Acesso negado";
        } else if (error.response.status === 404) {
          mensagemErro = "Caso não encontrado";
        }
      }
      
      Alert.alert("Erro", mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  // Função para fechar o modal
  const handleClose = () => {
    if (loading) return;
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable 
              style={styles.closeButton} 
              onPress={handleClose}
              disabled={loading}
            >
              <AntDesign name="close" size={24} color="white" />
            </Pressable>
            <Text style={styles.headerTitle}>Nova Vítima</Text>
            <Pressable 
              style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
              onPress={handleCreateVitima}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <MaterialIcons name="check" size={24} color="white" />
              )}
            </Pressable>
          </View>

          {/* Formulário */}
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Seção: Identificação */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Identificação</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  NIC (Número de Identificação Criminal) *
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.nic}
                  onChangeText={(text) => setFormData({...formData, nic: text})}
                  placeholder="Ex: 12345678"
                  autoCapitalize="characters"
                  maxLength={20}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome Completo *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nome}
                  onChangeText={(text) => setFormData({...formData, nome: text})}
                  placeholder="Digite o nome completo"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Documento de Identificação *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.documento}
                  onChangeText={(text) => setFormData({...formData, documento: text})}
                  placeholder="CPF, RG, CNH, etc."
                />
              </View>
            </View>

            {/* Seção: Dados Pessoais */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dados Pessoais</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Sexo *</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.genero}
                    onValueChange={(value) => setFormData({...formData, genero: value})}
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecione..." value="" />
                    <Picker.Item label="Masculino" value="masculino" />
                    <Picker.Item label="Feminino" value="feminino" />
                    <Picker.Item label="Não informado" value="nao_informado" />
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Idade *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.idade}
                  onChangeText={(text) => setFormData({...formData, idade: text})}
                  placeholder="Digite a idade"
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cor/Etnia</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.corEtnia}
                    onValueChange={(value) => setFormData({...formData, corEtnia: value})}
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecione..." value="" />
                    <Picker.Item label="Branca" value="branca" />
                    <Picker.Item label="Preta" value="preta" />
                    <Picker.Item label="Parda" value="parda" />
                    <Picker.Item label="Amarela" value="amarela" />
                    <Picker.Item label="Indígena" value="indigena" />
                    <Picker.Item label="Não informado" value="nao_informado" />
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nacionalidade</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nacionalidade}
                  onChangeText={(text) => setFormData({...formData, nacionalidade: text})}
                  placeholder="Ex: Brasileira"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Profissão</Text>
                <TextInput
                  style={styles.input}
                  value={formData.profissao}
                  onChangeText={(text) => setFormData({...formData, profissao: text})}
                  placeholder="Ex: Engenheiro"
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Seção: Localização */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Localização</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Endereço</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.endereco}
                  onChangeText={(text) => setFormData({...formData, endereco: text})}
                  placeholder="Endereço completo (opcional)"
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Seção: Observações */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Observações Adicionais</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Observações</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.observacoes}
                  onChangeText={(text) => setFormData({...formData, observacoes: text})}
                  placeholder="Informações adicionais relevantes (opcional)"
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Aviso */}
            <View style={styles.warningBox}>
              <MaterialIcons name="info" size={20} color={colors.warmBeige} />
              <Text style={styles.warningText}>
                Os campos marcados com * são obrigatórios. O odontograma será inicializado automaticamente.
              </Text>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  closeButton: {
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
  saveButton: {
    backgroundColor: colors.steelBlue,
    padding: 8,
    borderRadius: 20,
    minWidth: 40,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkTeal,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  textArea: {
    minHeight: 80,
    maxHeight: 120,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.warmBeige,
    marginTop: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#856404',
    marginLeft: 8,
    lineHeight: 18,
  },
});