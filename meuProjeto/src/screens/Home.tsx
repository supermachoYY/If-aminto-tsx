import React from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import ProductCard from "../components/ProductCard";

export default function Home({ navigation }: any) {

  const lanches = [
    {
      id: "1",
      nome: "X-Burger",
      preco: 10,
      imagem: "https://via.placeholder.com/150"
    },
    {
      id: "2",
      nome: "X-Salada",
      preco: 12,
      imagem: "https://via.placeholder.com/150"
    },
    {
      id: "3",
      nome: "Cachorro Quente",
      preco: 8,
      imagem: "https://via.placeholder.com/150"
    }
  ];

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>Lanches Disponíveis</Text>

      <FlatList
        data={lanches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            produto={item}
            onPress={() => navigation.navigate("Produto", { produto: item })}
          />
        )}
      />

      <Button
        title="Ver Carrinho"
        onPress={() => navigation.navigate("Carrinho")}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20
  }

});