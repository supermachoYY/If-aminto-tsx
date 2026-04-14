import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Image
} from "react-native";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db, auth } from "../database/database";
import { signOut } from "firebase/auth";

export default function Home({ navigation }: any) {
  const [lanches, setLanches] = useState<any[]>([]);
  const [promocoes, setPromocoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    // Buscar lanches em tempo real
    const unsubscribeLanches = onSnapshot(
      query(collection(db, "lanches"), orderBy("criadoEm", "desc")),
      (snapshot) => {
        const lista: any[] = [];
        snapshot.forEach((doc) => {
          lista.push({ id: doc.id, ...doc.data() });
        });
        setLanches(lista);
        setLoading(false);
      }
    );

    // Buscar promoções (lanches com desconto - você pode adicionar campo "promocao")
    const unsubscribePromos = onSnapshot(
      query(collection(db, "lanches"), orderBy("criadoEm", "desc"), limit(5)),
      (snapshot) => {
        const lista: any[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.promocao) {
            lista.push({ id: doc.id, ...data });
          }
        });
        setPromocoes(lista);
      }
    );

    return () => {
      unsubscribeLanches();
      unsubscribePromos();
    };
  }, []);

  const categorias = [
    { id: 1, nome: "Lanches", icon: "🍔", cor: "#FF6B6B" },
    { id: 2, nome: "Bebidas", icon: "🥤", cor: "#4ECDC4" },
    { id: 3, nome: "Doces", icon: "🍰", cor: "#FFE66D" },
    { id: 4, nome: "Promoções", icon: "🎉", cor: "#FF6B6B" },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      alert("Erro ao sair");
    }
  };

  const filteredLanches = lanches.filter(lanche =>
    lanche.nome.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Carregando delícias...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Olá, {auth.currentUser?.email?.split('@')[0] || "Aluno"}!</Text>
          <Text style={styles.subtitle}>O que você quer comer hoje?</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Perfil")} style={styles.profileButton}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar lanches..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categorias */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriasContainer}>
          {categorias.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoriaItem}>
              <View style={[styles.categoriaIcon, { backgroundColor: cat.cor + "20" }]}>
                <Text style={styles.categoriaIconText}>{cat.icon}</Text>
              </View>
              <Text style={styles.categoriaNome}>{cat.nome}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Promoções */}
        {promocoes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🎯 Promoções com entrega grátis</Text>
              <TouchableOpacity>
                <Text style={styles.seeMore}>Ver mais</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {promocoes.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.promoCard}
                  onPress={() => navigation.navigate("Produto", { produto: item })}
                >
                  <Image source={{ uri: item.imagem }} style={styles.promoImage} />
                  <Text style={styles.promoNome} numberOfLines={2}>{item.nome}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.oldPrice}>R$ {(item.preco * 1.5).toFixed(2)}</Text>
                    <Text style={styles.promoPrice}>R$ {item.preco.toFixed(2)}</Text>
                  </View>
                  <Text style={styles.deliveryTime}>42-52 min • Grátis</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Todos os Lanches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🍔 Todos os Lanches</Text>
            <TouchableOpacity>
              <Text style={styles.seeMore}>Ver mais</Text>
            </TouchableOpacity>
          </View>

          {filteredLanches.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum lanche encontrado</Text>
          ) : (
            filteredLanches.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.lancheCard}
                onPress={() => navigation.navigate("Produto", { produto: item })}
              >
                <Image source={{ uri: item.imagem }} style={styles.lancheImage} />
                <View style={styles.lancheInfo}>
                  <Text style={styles.lancheNome}>{item.nome}</Text>
                  <Text style={styles.lancheDescricao} numberOfLines={2}>
                    {item.descricao}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.rating}>⭐ 4.5</Text>
                    <Text style={styles.ratingCount}>(23 avaliações)</Text>
                  </View>
                  <Text style={styles.lanchePreco}>R$ {item.preco.toFixed(2)}</Text>
                  <Text style={styles.deliveryTime}>30-40 min • Grátis</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
          <Text style={[styles.navIcon, styles.navActive]}>🏠</Text>
          <Text style={[styles.navText, styles.navActiveText]}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Carrinho")}>
          <Text style={styles.navIcon}>🛒</Text>
          <Text style={styles.navText}>Pedidos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Perfil")}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  loadingText: {
    marginTop: 10,
    color: "#FF6B6B",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
  },
  profileButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#FF6B6B20",
    justifyContent: "center",
    alignItems: "center",
  },
  profileIcon: {
    fontSize: 24,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    fontSize: 18,
    color: "#999",
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  categoriasContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  categoriaItem: {
    alignItems: "center",
    marginRight: 20,
  },
  categoriaIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoriaIconText: {
    fontSize: 30,
  },
  categoriaNome: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeMore: {
    color: "#FF6B6B",
    fontSize: 14,
  },
  promoCard: {
    backgroundColor: "#fff",
    width: 180,
    marginLeft: 15,
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  promoImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  promoNome: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 5,
  },
  oldPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
  },
  promoPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  lancheCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lancheImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  lancheInfo: {
    flex: 1,
    marginLeft: 12,
  },
  lancheNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  lancheDescricao: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  rating: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFB800",
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 11,
    color: "#999",
  },
  lanchePreco: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginBottom: 4,
  },
  deliveryTime: {
    fontSize: 11,
    color: "#4ECDC4",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 30,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  navIcon: {
    fontSize: 24,
    color: "#999",
  },
  navText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  navActive: {
    color: "#FF6B6B",
  },
  navActiveText: {
    color: "#FF6B6B",
  },
});