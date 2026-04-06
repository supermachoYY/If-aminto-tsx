import React, { useContext } from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import { CartContext } from "../services/CartContext";

export default function Carrinho({ navigation }) {

  const { cart, removerItem } = useContext(CartContext);

  function calcularTotal(){

    return cart.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0
    );

  }

  return (

    <View style={styles.container}>

      <Text style={styles.titulo}>Seu Carrinho</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (

          <View style={styles.item}>

            <Text>{item.nome}</Text>

            <Text>
              {item.quantidade}x - R$ {item.preco}
            </Text>

            <Button
              title="Remover"
              onPress={() => removerItem(item.id)}
            />

          </View>

        )}
      />

      <Text style={styles.total}>
        Total: R$ {calcularTotal()}
      </Text>

      <Button
        title="Confirmar Pedido"
        onPress={() => navigation.navigate("ConfirmarPedido")}
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
    fontSize:24,
    fontWeight:"bold",
    marginBottom:20
  },

  item:{
    backgroundColor:"#eee",
    padding:15,
    marginBottom:10,
    borderRadius:8
  },

  total:{
    fontSize:20,
    fontWeight:"bold",
    marginTop:20
  }

});