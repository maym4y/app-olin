import { AntDesign } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import {
    Animated,
    Easing,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function DetalhesCaso() {
  const { caso } = useLocalSearchParams();

  let dados = null;
  try {
    dados = JSON.parse(caso);
  } catch (e) {
    console.error("Erro ao converter caso:", e);
  }

  if (!dados) return <Text style={styles.msg}>Caso não encontrado</Text>;

  const {
    id,
    titulo,
    responsavel,
    descricao,
    status,
    historico = [],
    evidencias = [],
    laudos = [],
  } = dados;

  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, []);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color="#0d1f38" /> 
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes do caso:</Text> 
        </View>

        <Text style={styles.caseTitle}>{titulo}</Text> 

        <Text style={styles.value}>ID do Caso: {id}</Text>

        <View style={styles.inline}>
          <Text style={styles.label}>Responsável:</Text>
          <TextInput
            style={[styles.input, styles.inputSmall]}
            editable={false}
            value={responsavel || "--"}
          />
        </View>

        <Text style={styles.label}>Descrição:</Text>
        <TextInput
          style={styles.textArea}
          multiline
          editable={false}
          value={descricao || "--"}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Status:</Text>
        <View style={[styles.statusBtn, status === "Concluído" && styles.statusConcluido]}>
          <Text style={{ color: "#fff" }}>{status || "Em andamento"}</Text>
        </View>

        <Text style={styles.label}>Histórico:</Text>
        <View style={styles.history}>
          {historico.length > 0 ? (
            historico.map((item, index) => (
              <Text key={index}>• {item}</Text>
            ))
          ) : (
            <Text>Sem histórico</Text>
          )}
        </View>

        <Text style={styles.label}>Evidências:</Text>
        {evidencias.length > 0 ? (
          evidencias.map((ev, index) => (
            <View style={styles.infoBox} key={index}>
              <TextInput style={styles.input} value={ev.tipo} editable={false} />
              <TextInput style={styles.input} value={ev.descricao} editable={false} />
              <TouchableOpacity style={styles.viewButton}>
                <Text style={{ color: "#fff" }}>Visualizar evidência</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={{ marginTop: 5 }}>Nenhuma evidência adicionada</Text>
        )}

        <Text style={styles.label}>Laudos:</Text>
        {laudos.length > 0 ? (
          laudos.map((arquivo, index) => (
            <View style={styles.infoBox} key={index}>
              <Text style={{ color: "#fff" }}>{arquivo}</Text>
            </View>
          ))
        ) : (
          <Text style={{ marginTop: 5 }}>Nenhum laudo disponível</Text>
        )}

        {/* Botões com texto branco */}
        <View style={styles.buttonRow}>
          <Pressable style={styles.infoBox}><Text style={{ color: "#fff" }}>Adicionar evidências</Text></Pressable>
          <Pressable style={styles.infoBox}><Text style={{ color: "#fff" }}>Adicionar laudos</Text></Pressable>
        </View>
        <View style={styles.buttonRow}>
          <Pressable style={styles.infoBox}><Text style={{ color: "#fff" }}>Editar Caso</Text></Pressable>
          <Pressable style={styles.infoBox}><Text style={{ color: "#fff" }}>Compartilhar</Text></Pressable>
        </View>

        <Pressable style={styles.primaryBtn}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>GERAR RELATÓRIO</Text>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#e8edf2",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80,
    flexGrow: 1,
  },
  msg: {
    textAlign: "center",
    marginTop: 100,
    fontSize: 18,
    color: "gray",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#0d1f38", 
  },
  caseTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#0d1f38", 
  },
  label: {
    fontWeight: "bold",
    marginTop: 15,
    fontSize: 16, 
    color: "#0d1f38", 
  },
  value: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 8,
    marginTop: 5,
    flex: 1,
  },
  inputSmall: {
    maxWidth: 200,
    marginLeft: 10,
  },
  inline: {
    flexDirection: "row",
    alignItems: "center",
  },
  textArea: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 8,
    minHeight: 100,
    marginTop: 5,
  },
  statusBtn: {
    backgroundColor: "#5a7599",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  statusConcluido: {
    backgroundColor: "#4CAF50",
  },
  history: {
    marginTop: 5,
    gap: 5,
  },
  infoBox: {
    backgroundColor: "#5a7599",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    flex: 0.48,
    alignItems: "center",
  },
  viewButton: {
    marginTop: 10,
    backgroundColor: "#2b3e57",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  primaryBtn: {
    backgroundColor: "#0d1f38",
    padding: 12,
    borderRadius: 6,
    marginTop: 25,
    alignItems: "center",
  },
});
