import React, { useContext } from "react";
import { View, Text, Image, Button, StyleSheet } from "react-native";
import { CartContext } from "../services/CartContext";

export default function Produto({ route }) {

  const { produto } = route.params;

  const { adicionarAoCarrinho } = useContext(CartContext);

  return (

    <View style={styles.container}>

      <Image
        source={{ uri: produto.imagem }}
        style={styles.imagem}
      />

      <Text style={styles.nome}>
        {produto.nome}
      </Text>

      <Text style={styles.preco}>
        R$ {produto.preco}
      </Text>

      <Button
        title="Adicionar ao Carrinho"
        onPress={() => adicionarAoCarrinho(produto)}
      />

    </View>

  );

}

const styles = StyleSheet.create({

  container:{
    flex:1,
    alignItems:"center",
    padding:20
  },

  imagem:{
    width:200,
    height:200,
    marginBottom:20
  },

  nome:{
    fontSize:24,
    fontWeight:"bold"
  },

  preco:{
    fontSize:20,
    color:"green",
    marginBottom:20
  }

});