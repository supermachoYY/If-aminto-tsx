import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { CartContext } from "../services/CartContext";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "../database/database";
import StarRating from "../components/StarRating";

export default function Produto({ route, navigation }: any) {
  const { produto } = route.params;
  const { adicionarAoCarrinho } = useContext(CartContext);
  const [quantidade, setQuantidade] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [mediaAvaliacao, setMediaAvaliacao] = useState(0);
  const [loadingAvaliacoes, setLoadingAvaliacoes] = useState(true);

  useEffect(() => {
    buscarAvaliacoes();
  }, []);

  async function buscarAvaliacoes() {
    try {
      const q = query(
        collection(db, "avaliacoes_produto"),
        where("produtoId", "==", produto.id),
        orderBy("criadoEm", "desc"),
        limit(10)
      );

      const snapshot = await getDocs(q);
      const lista: any[] = [];
      let soma = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        lista.push({ id: doc.id, ...data });
        soma += data.nota;
      });

      setAvaliacoes(lista);
      setMediaAvaliacao(lista.length > 0 ? soma / lista.length : 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingAvaliacoes(false);
    }
  }

  function incrementar() {
    if (quantidade < 3) {
      setQuantidade(quantidade + 1);
    } else {
      Alert.alert("Limite atingido", "Você pode adicionar no máximo 3 unidades deste lanche");
    }
  }

  function decrementar() {
    if (quantidade > 1) {
      setQuantidade(quantidade - 1);
    }
  }

  function adicionarAoCarrinhoComQuantidade() {
    for (let i = 0; i < quantidade; i++) {
      adicionarAoCarrinho(produto);
    }
    setShowModal(true);
    setTimeout(() => setShowModal(false), 1500);
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Imagem do produto */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: produto.imagem }} style={styles.imagem} />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        {/* Nome e preço */}
        <Text style={styles.nome}>{produto.nome}</Text>

        <View style={styles.ratingSection}>
          <StarRating rating={mediaAvaliacao} readonly={true} />
          <Text style={styles.ratingText}>
            {mediaAvaliacao.toFixed(1)} ({avaliacoes.length} avaliações)
          </Text>
        </View>

        <Text style={styles.preco}>R$ {produto.preco.toFixed(2)}</Text>

        {/* Descrição */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Descrição</Text>
          <Text style={styles.descricao}>{produto.descricao}</Text>
        </View>

        {/* Informações adicionais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ Informações</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>⏱️</Text>
              <View>
                <Text style={styles.infoLabel}>Tempo de preparo</Text>
                <Text style={styles.infoValue}>15-25 minutos</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📍</Text>
              <View>
                <Text style={styles.infoLabel}>Retirada</Text>
                <Text style={styles.infoValue}>Cantina do IFSul - Sala 101</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>👨‍🍳</Text>
              <View>
                <Text style={styles.infoLabel}>Vendedor</Text>
                <Text style={styles.infoValue}>Vendedor #{produto.userId?.slice(-6)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Avaliações */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⭐ Avaliações</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {loadingAvaliacoes ? (
            <ActivityIndicator color="#FF6B6B" />
          ) : avaliacoes.length === 0 ? (
            <Text style={styles.noReviews}>Ainda não há avaliações para este lanche</Text>
          ) : (
            avaliacoes.map((avaliacao, index) => (
              <View key={index} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewUser}>Aluno #{avaliacao.compradorId?.slice(-6)}</Text>
                  <StarRating rating={avaliacao.nota} readonly={true} />
                </View>
                {avaliacao.comentario && (
                  <Text style={styles.reviewComment}>"{avaliacao.comentario}"</Text>
                )}
                <Text style={styles.reviewDate}>
                  {new Date(avaliacao.criadoEm?.toDate()).toLocaleDateString("pt-BR")}
                </Text>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Botão de adicionar ao carrinho (fixo) */}
      <View style={styles.bottomBar}>
        <View style={styles.quantidadeContainer}>
          <TouchableOpacity style={styles.quantidadeButton} onPress={decrementar}>
            <Text style={styles.quantidadeButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantidade}>{quantidade}</Text>
          <TouchableOpacity style={styles.quantidadeButton} onPress={incrementar}>
            <Text style={styles.quantidadeButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.botaoComprar} onPress={adicionarAoCarrinhoComQuantidade}>
          <Text style={styles.botaoComprarTexto}>
            Adicionar • R$ {(produto.preco * quantidade).toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de sucesso */}
      <Modal transparent={true} visible={showModal} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalIcon}>✅</Text>
            <Text style={styles.modalText}>Adicionado ao carrinho!</Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  imageContainer: {
    position: "relative",
    backgroundColor: "#fff",
  },
  imagem: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  content: {
    padding: 20,
  },
  nome: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  preco: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAll: {
    color: "#FF6B6B",
    fontSize: 14,
  },
  descricao: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewUser: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  reviewComment: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontStyle: "italic",
  },
  reviewDate: {
    fontSize: 11,
    color: "#999",
  },
  noReviews: {
    textAlign: "center",
    color: "#999",
    padding: 20,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 15,
  },
  quantidadeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 5,
  },
  quantidadeButton: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 1,
  },
  quantidadeButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  quantidade: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 20,
    color: "#333",
  },
  botaoComprar: {
    flex: 1,
    backgroundColor: "#FF6B6B",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },
  botaoComprarTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    elevation: 5,
  },
  modalIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});