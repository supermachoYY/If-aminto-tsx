import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function Login({ navigation }) {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function fazerLogin() {

    // depois aqui virá a conexão com banco
    if (email === "" || senha === "") {
      alert("Preencha todos os campos");
      return;
    }

    alert("Login realizado");

    navigation.navigate("Home");
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>IF-aminto</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.botao} onPress={fazerLogin}>
        <Text style={styles.botaoTexto}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
        <Text style={styles.link}>Criar conta</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20
  },

  titulo: {
    fontSize: 32,
    textAlign: "center",
    marginBottom: 40,
    fontWeight: "bold"
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8
  },

  botao: {
    backgroundColor: "#2e86de",
    padding: 15,
    borderRadius: 8
  },

  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  },

  link: {
    textAlign: "center",
    marginTop: 20
  }

});