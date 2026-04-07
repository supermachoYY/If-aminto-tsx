import React, { useContext } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { CartContext } from "../services/CartContext";

export default function ConfirmarPedido({ navigation }) {

  const { cart } = useContext(CartContext);

  function confirmar() {

    if(cart.length === 0){
      alert("Carrinho vazio");
      return;
    }

    const pedidoId = Date.now().toString();

    navigation.navigate("QRCodePedido", { pedidoId });

  }

  return (

    <View style={styles.container}>

      <Text style={styles.titulo}>Confirmar Pedido</Text>

      <Text>
        Itens no carrinho: {cart.length}
      </Text>

      <Button
        title="Confirmar Compra"
        onPress={confirmar}
      />

    </View>

  );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },

  titulo:{
    fontSize:24,
    marginBottom:20
  }

});