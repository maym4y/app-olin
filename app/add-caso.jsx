import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CadastrarCasoScreen(props) {
  const [nome, setNome] = useState("");
  const [ID, setIDcaso] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [descricao, setDescricao] = useState("");
  const [descricaoHeight, setDescricaoHeight] = useState(100);
  const [data, setData] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [status, setStatus] = useState("Em andamento");

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || data;
    setShowDatePicker(Platform.OS === "ios");
    setData(currentDate);
  };

  const handleCadastrar = () => {
    // Aqui você pode tratar o cadastro, enviar para banco de dados, API, etc.
    console.log("Nome:", nome);
    console.log("Descrição:", descricao);
    console.log("Id co Caso:", ID);
    console.log("Responsável:", responsavel);
    console.log("Data:", data.toLocaleDateString());
    console.log("Status:", status);

    // Limpar campos após cadastro
    setNome("");
    setDescricao("");
    setIDcaso("");
    setResponsavel("");
    setData(new Date());
    setStatus("Em andamento");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={styles.closeButton}
      >
        <Text style={styles.titulo}>Cadastrar Caso</Text>
        {props.closeScreen()}
      </View>
      <Text style={styles.label}>Nome do Caso:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do Caso"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>ID do Caso:</Text>
      <TextInput
        style={styles.input}
        placeholder="ID do Caso"
        value={ID}
        onChangeText={setIDcaso}
      />

      <Text style={styles.label}>Responsável:</Text>
      <TextInput
        style={styles.input}
        placeholder="Responsável"
        value={responsavel}
        onChangeText={setResponsavel}
      />

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

      <Text style={styles.label}>Data de criação:</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateInput}
      >
        <Text>Data: {data.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={data}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <Text style={styles.label}>Status:</Text>
      <Picker
        selectedValue={status}
        onValueChange={(itemValue) => setStatus(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Em andamento" value="Em andamento" />
        <Picker.Item label="Concluído" value="Concluído" />
        <Picker.Item label="Pendente" value="Pendente" />
      </Picker>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => {
          /* ação desejada */
        }}
      >
        <Text style={styles.buttonText}>+ Adicionar Evidências</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleCadastrar}>
        <Text style={styles.buttonText}>SALVAR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0e9f1",
    paddingHorizontal: 20,
    paddingTop: 20, // se quiser topo
    paddingBottom: 80,
    minHeight: 800, // força uma altura mínima
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#001f4d",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
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
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#001f4d",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
    color: "#333",
  },

  buttonSecondary: {
    backgroundColor: "#fff",
    borderColor: "#003366",
    borderWidth: 2,
    padding: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: 'flex-start', 
    marginTop: 10,
  },

  buttonText: {
    color: "#003366",
    fontWeight: "bold",
  },
  closeButton: {
    display: "flex",
    flexDirection: "row",
    alignContent: "space-between",
    alignItems: "center",
  },
});
