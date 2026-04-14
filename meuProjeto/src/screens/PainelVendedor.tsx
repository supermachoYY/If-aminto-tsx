import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert
} from "react-native";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where
} from "firebase/firestore";

import { db, auth } from "../database/database";

export default function PainelVendedor({ navigation }: any) {

  const [lanches, setLanches] = useState<any[]>([]);

  // 🔥 BUSCAR LANCHES DO USUÁRIO
  async function buscarLanches() {
    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Erro", "Usuário não logado");
        return;
      }

      const q = query(
        collection(db, "lanches"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      const lista: any[] = [];

      snapshot.forEach((docItem) => {
        lista.push({
          id: docItem.id,
          ...docItem.data()
        });
      });

      setLanches(lista);

    } catch (error: any) {
      console.log("Erro ao buscar:", error);
      Alert.alert("Erro ao buscar", error.message);
    }
  }

  useEffect(() => {
    buscarLanches();
  }, []);

  // 🔥 DELETAR LANCHES (COM DEBUG)
  function deletarLanche(id: string) {

    console.log("CLICOU EXCLUIR:", id);

    Alert.alert("Excluir", "Deseja excluir este lanche?", [
      {
        text: "Cancelar",
        style: "cancel"
      },
      {
        text: "Excluir",
        onPress: async () => {
          try {

            console.log("TENTANDO DELETAR...");

            await deleteDoc(doc(db, "lanches", id));

            console.log("DELETADO COM SUCESSO");

            Alert.alert("Sucesso", "Lanche excluído");

            // 🔥 atualiza lista sem recarregar
            setLanches((prev) =>
              prev.filter((item) => item.id !== id)
            );

          } catch (error: any) {

            console.log("ERRO AO DELETAR:", error);

            Alert.alert(
              "Erro ao deletar",
              error.message || "Sem permissão ou erro desconhecido"
            );
          }
        }
      }
    ]);
  }

  function renderItem({ item }: any) {
    return (
      <View style={styles.card}>

        <Image source={{ uri: item.imagem }} style={styles.imagem} />

        <View style={styles.info}>

          <Text style={styles.nome}>{item.nome}</Text>

          <Text style={styles.preco}>R$ {item.preco}</Text>

          <View style={styles.botoes}>

            <TouchableOpacity
              style={styles.editar}
              onPress={() =>
                navigation.navigate("EditarLanche", { lanche: item })
              }
            >
              <Text style={styles.textoBotao}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.excluir}
              onPress={() => deletarLanche(item.id)}
            >
              <Text style={styles.textoBotao}>Excluir</Text>
            </TouchableOpacity>

          </View>

        </View>

      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>Meus Lanches</Text>

      <FlatList
        data={lanches}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Nenhum lanche encontrado
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.botaoLerQR}
        onPress={() => navigation.navigate("LerQRCode")}
      >
        <Text style={styles.botaoTexto}>📷 Ler QR Code do Cliente</Text>
      </TouchableOpacity>

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
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3
  },

  imagem: {
    width: 80,
    height: 80,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },

  info: {
    flex: 1,
    padding: 10
  },

  nome: {
    fontSize: 18,
    fontWeight: "bold"
  },

  preco: {
    color: "green",
    marginBottom: 10
  },

  botoes: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  editar: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 5,
    alignItems: "center"
  },

  excluir: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 5,
    alignItems: "center"
  },

  textoBotao: {
    color: "#fff",
    fontWeight: "bold"
  },

  botaoLerQR: {
    backgroundColor: "#9b59b6",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 30
  },

  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  }

});