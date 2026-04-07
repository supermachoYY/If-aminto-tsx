import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function Cadastro({ navigation }: any ) {

  const [nome, setNome] : any = useState("");
  const [telefone, setTelefone] : any = useState("");
  const [email, setEmail] : any = useState("");
  const [senha, setSenha] : any = useState("");

  function cadastrar(){

    if(nome === "" || telefone === "" || email === "" || senha === ""){
      alert("Preencha todos os campos");
      return;
    }

    alert("Usuário cadastrado");

    navigation.navigate("Login");
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