import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import StackNavigator from "./src/navigation/StackNavigator";
import { CartProvider } from "./src/services/CartContext";

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </CartProvider>
  );
}