import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AdicionarEvidenciaScreen(props) {
  const [descricao, setDescricao] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [descricaoHeight, setDescricaoHeight] = useState(100);
  const [observacoesHeight, setObservacoesHeight] = useState(100);  
  const [tipoEvidencia, setTipoEvidencia] = useState('');
  const [vincularCaso, setVincularCaso] = useState('');

  const handleSalvar = () => {
    console.log('Descrição:', descricao);
    console.log('Observações:', observacoes);
    console.log('Tipo de Evidência:', tipoEvidencia);
    console.log('Vincular ao Caso:', vincularCaso);

    // Limpar campos após salvar
    setDescricao('');
    setObservacoes('');
    setTipoEvidencia('');
    setVincularCaso('');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={props.closeScreen}>
          <Text style={styles.voltar}>{'←'}</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Adicionar Evidência</Text>
      </View>

      <TouchableOpacity style={styles.buttonUpload}>
        <Text style={styles.buttonUploadText}>+ Adicionar arquivos</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Descrição :</Text>
      <TextInput
        style={[styles.inputMultiline, { height: descricaoHeight }]}
        placeholder="Digite a descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        textAlignVertical="top"
        onContentSizeChange={(event) =>
        setDescricaoHeight(event.nativeEvent.contentSize.height + 20)
        }
      />

      <Text style={styles.label}>Observações :</Text>
      <TextInput
        style={[styles.inputMultiline, { height: observacoesHeight }]}
        placeholder="Digite as observações"
        value={observacoes}
        onChangeText={setObservacoes}
        multiline
        textAlignVertical="top"
        onContentSizeChange={(event) =>
        setObservacoesHeight(event.nativeEvent.contentSize.height + 20)
        }
      />

      <Text style={styles.label}>Tipo de evidência:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Fotografia, Documento..."
        value={tipoEvidencia}
        onChangeText={setTipoEvidencia}
      />

      <Text style={styles.label}>Vincular ao caso:</Text>
      <Picker
        selectedValue={vincularCaso}
        onValueChange={(itemValue) => setVincularCaso(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione o caso" value="" />
        <Picker.Item label="Nome do Caso" value="nomeCaso" />
        {/* Adicione dinamicamente os casos aqui */}
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>SALVAR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#d8e0e8',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  voltar: {
    fontSize: 24,
    color: '#001f4d',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#001f4d',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },

  inputMultiline: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },

  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  buttonUpload: {
    backgroundColor: '#6e849e',
    padding: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  buttonUploadText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#001f4d',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
