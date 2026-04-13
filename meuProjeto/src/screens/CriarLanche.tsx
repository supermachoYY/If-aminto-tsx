import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";

import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../database/database";

export default function CriarLanche({ navigation }: any) {

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState(""); // agora será URL opcional

  async function salvarLanche() {

    if (!nome || !preco || !descricao) {
      Alert.alert("Erro", "Preencha nome, preço e descrição");
      return;
    }

    if (!auth.currentUser) {
      Alert.alert("Erro", "Usuário não autenticado");
      return;
    }

    try {

      await addDoc(collection(db, "lanches"), {
        nome,
        preco: parseFloat(preco),
        descricao,
        imagem: imagem || "https://via.placeholder.com/150", // fallback
        criadoEm: new Date(),
        userId: auth.currentUser.uid
      });

      Alert.alert("Sucesso", "Lanche criado!");

      navigation.goBack();

    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível salvar");
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>Criar Lanche</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Preço (ex: 10.50)"
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />

      <TextInput
        style={styles.input}
        placeholder="URL da imagem (opcional)"
        value={imagem}
        onChangeText={setImagem}
      />

      <TouchableOpacity style={styles.botaoSalvar} onPress={salvarLanche}>
        <Text style={styles.botaoTexto}>Salvar Lanche</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center"
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8
  },
  botaoSalvar: {
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 8
  },
  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  }
});