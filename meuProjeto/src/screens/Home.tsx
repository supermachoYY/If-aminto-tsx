import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator } from "react-native";
import ProductCard from "../components/ProductCard";

import { signOut } from "firebase/auth";
import { auth } from "../database/database";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../database/database";

export default function Home({ navigation }: any) {

  const [lanches, setLanches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = onSnapshot(collection(db, "lanches"), (snapshot) => {

      const lista: any[] = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setLanches(lista);
      setLoading(false);

    });

    return unsubscribe;

  }, []);

  async function sair() {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      alert("Erro ao sair");
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text>Carregando lanches...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>🍔 Lanches Disponíveis</Text>

      {lanches.length === 0 ? (
        <Text style={styles.vazio}>Nenhum lanche cadastrado</Text>
      ) : (
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
      )}

      <View style={styles.botoes}>

        <Button
          title="Ver Carrinho"
          onPress={() => navigation.navigate("Carrinho")}
        />
        <Button
          title="Painel do Vendedor"
          onPress={() => navigation.navigate("PainelVendedor")}
        />
        <Button
          title="Adicionar Lanche"
          onPress={() => navigation.navigate("CriarLanche")}
        />

        <Button
          title="Sair"
          onPress={sair}
        />

      </View>

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

  vazio:{
    textAlign:"center",
    marginTop:20,
    fontSize:16,
    color:"#999"
  },

  botoes:{
    marginTop:10,
    gap:10
  },

  loadingContainer:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  }

});