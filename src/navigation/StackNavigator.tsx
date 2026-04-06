import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Carrinho from "../screens/Carrinho";
import Login from "../screens/Login";
import Cadastro from "../screens/Cadastro";
import Home from "../screens/Home";
import Produto from "../screens/Produto";
import ConfirmarPedido from "../screens/ConfirmarPedido";
import QRCodePedido from "../screens/QRCodePedido";
import AvaliarProduto from "../screens/AvaliarProduto";


const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator>



      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Cadastro"
        component={Cadastro}
      />

      <Stack.Screen
        name="Home"
        component={Home}
      />

      <Stack.Screen
        name="Produto"
        component={Produto}
      />

        <Stack.Screen
        name="Carrinho"
        component={Carrinho}
        />

      <Stack.Screen
  name="ConfirmarPedido"
  component={ConfirmarPedido}
/>

<Stack.Screen
  name="QRCodePedido"
  component={QRCodePedido}
/>

<Stack.Screen
  name="AvaliarProduto"
  component={AvaliarProduto}
/>
    </Stack.Navigator>
  );
}