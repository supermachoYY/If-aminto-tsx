import React from "react";
import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QRCodePedido({ route }) {

  const { pedidoId } = route.params;

  return (

    <View style={styles.container}>

      <Text style={styles.titulo}>
        Pedido Confirmado
      </Text>

      <QRCode
        value={pedidoId}
        size={200}
      />

      <Text style={styles.codigo}>
        Código do pedido: {pedidoId}
      </Text>

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
  },

  codigo:{
    marginTop:20
  }

});