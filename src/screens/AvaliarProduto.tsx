import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

import StarRating from "../components/StarRating";

export default function AvaliarProduto({ route, navigation }: any) {

  const { produto } :any = route.params;

  const [rating, setRating] : any  = useState(0);
  const [comentario, setComentario] : any = useState("");

  function enviarAvaliacao(){

    if(rating === 0){
      alert("Escolha uma nota");
      return;
    }

    alert("Avaliação enviada");

    navigation.goBack();

  }

  return (

    <View style={styles.container}>

      <Text style={styles.titulo}>
        Avaliar {produto.nome}
      </Text>

      <StarRating
        rating={rating}
        setRating={setRating}
      />

      <TextInput
        style={styles.input}
        placeholder="Deixe um comentário"
        value={comentario}
        onChangeText={setComentario}
        multiline
      />

      <Button
        title="Enviar Avaliação"
        onPress={enviarAvaliacao}
      />

    </View>

  );

}

const styles = StyleSheet.create({

  container:{
    flex:1,
    padding:20
  },

  titulo:{
    fontSize:22,
    marginBottom:20
  },

  input:{
    borderWidth:1,
    borderColor:"#ccc",
    borderRadius:8,
    padding:10,
    marginVertical:20,
    height:100
  }

});