import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "../database/database";

export default function Cadastro({ navigation }: any) {

  const [nome, setNome] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");

  async function cadastrar(){

    if(nome === "" || telefone === "" || email === "" || senha === ""){
      alert("Preencha todos os campos");
      return;
    }

    try {

      // 🔐 Cria usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );

      const user = userCredential.user;

      // 💾 Salva dados adicionais no Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        nome,
        telefone,
        email,
        criadoEm: new Date()
      });

      alert("Usuário cadastrado com sucesso");

      navigation.replace("Home");

    } catch (error: any) {
      alert(error.message);
    }

  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
      />

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

      <TouchableOpacity style={styles.botao} onPress={cadastrar}>
        <Text style={styles.botaoTexto}>Cadastrar</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    justifyContent:"center",
    padding:20
  },

  titulo:{
    fontSize:28,
    textAlign:"center",
    marginBottom:30
  },

  input:{
    borderWidth:1,
    borderColor:"#ccc",
    padding:10,
    marginBottom:15,
    borderRadius:8
  },

  botao:{
    backgroundColor:"#27ae60",
    padding:15,
    borderRadius:8
  },

  botaoTexto:{
    color:"#fff",
    textAlign:"center",
    fontWeight:"bold"
  }

});