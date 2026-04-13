import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator
} from "react-native";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../database/database";

export default function EditarLanche({ route, navigation }: any) {

  const { lanche } = route.params;

  const [nome, setNome] = useState(lanche.nome);
  const [preco, setPreco] = useState(String(lanche.preco));
  const [descricao, setDescricao] = useState(lanche.descricao);
  const [imagem, setImagem] = useState(lanche.imagem);
  const [loading, setLoading] = useState(false);

  async function atualizarLanche() {

    if (!nome || !preco || !descricao) {
      Alert.alert("Preencha todos os campos");
      return;
    }

    setLoading(true);

    try {

      await updateDoc(doc(db, "lanches", lanche.id), {
        nome,
        preco: parseFloat(preco),
        descricao,
        imagem // mantém a imagem atual (URL)
      });

      Alert.alert("Sucesso", "Lanche atualizado!");

      navigation.goBack();

    } catch (error) {
      console.log(error);
      Alert.alert("Erro ao atualizar");
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>Editar Lanche</Text>

      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
      />

      {/* imagem atual */}
      <Image source={{ uri: imagem }} style={styles.preview} />

      <TouchableOpacity
        style={styles.botaoSalvar}
        onPress={atualizarLanche}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botaoTexto}>Salvar Alterações</Text>
        )}
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  titulo: { fontSize: 26, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 15, borderRadius: 8 },
  botaoSalvar: { backgroundColor: "#27ae60", padding: 15, borderRadius: 8 },
  botaoTexto: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  preview: { width: 150, height: 150, alignSelf: "center", marginBottom: 15 }
});