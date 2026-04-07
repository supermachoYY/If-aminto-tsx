import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function ProductCard({ produto, onPress }) {

  return (

    <TouchableOpacity style={styles.card} onPress={onPress}>

      <Image
        source={{ uri: produto.imagem }}
        style={styles.imagem}
      />

      <View style={styles.info}>

        <Text style={styles.nome}>
          {produto.nome}
        </Text>

        <Text style={styles.preco}>
          R$ {produto.preco}
        </Text>

      </View>

    </TouchableOpacity>

  );
}

const styles = StyleSheet.create({

  card:{
    backgroundColor:"#fff",
    borderRadius:10,
    marginBottom:15,
    flexDirection:"row",
    elevation:3
  },

  imagem:{
    width:80,
    height:80,
    borderTopLeftRadius:10,
    borderBottomLeftRadius:10
  },

  info:{
    padding:10,
    justifyContent:"center"
  },

  nome:{
    fontSize:18,
    fontWeight:"bold"
  },

  preco:{
    fontSize:16,
    color:"green"
  }

});