import React, { useContext, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from "react-native";
import { CartContext } from "../services/CartContext";
import { auth, db } from "../database/database";
import { collection, addDoc } from "firebase/firestore";

export default function ConfirmarPedido({ navigation }: any) {
  const { cart, limparCarrinho } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  // Calcular data de retirada (próximo dia útil)
  function calcularDataRetirada() {
    const hoje = new Date();
    let dataRetirada = new Date(hoje);
    dataRetirada.setDate(hoje.getDate() + 1); // próximo dia

    // Se for sábado, pula para segunda
    if (dataRetirada.getDay() === 6) {
      dataRetirada.setDate(dataRetirada.getDate() + 2);
    }
    // Se for domingo, pula para segunda
    else if (dataRetirada.getDay() === 0) {
      dataRetirada.setDate(dataRetirada.getDate() + 1);
    }

    return dataRetirada;
  }

  function formatarData(data: Date) {
    return data.toLocaleDateString("pt-BR", {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  function calcularTotal() {
    return cart.reduce((total, item) => total + item.preco * item.quantidade, 0);
  }

  async function finalizarPedido() {
    if (!auth.currentUser) {
      Alert.alert("Erro", "Usuário não autenticado");
      return;
    }

    if (cart.length === 0) {
      Alert.alert("Erro", "Carrinho vazio");
      return;
    }

    setLoading(true);

    try {
      // Agrupar lanches por vendedor (userId)
      const pedidosPorVendedor = new Map();

      cart.forEach((item) => {
        const vendedorId = item.userId || item.vendedorId;
        if (!vendedorId) {
          console.warn("Item sem vendedorId:", item);
          return;
        }

        if (!pedidosPorVendedor.has(vendedorId)) {
          pedidosPorVendedor.set(vendedorId, []);
        }
        pedidosPorVendedor.get(vendedorId).push(item);
      });

      // Verificar se há pedidos para criar
      if (pedidosPorVendedor.size === 0) {
        Alert.alert("Erro", "Nenhum vendedor identificado nos produtos");
        return;
      }

      // Criar um pedido para cada vendedor
      const pedidosCriados = [];

      for (const [vendedorId, itens] of pedidosPorVendedor) {
        const dataRetirada = calcularDataRetirada();
        const idUnico = `${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

        const pedido = {
          compradorId: auth.currentUser.uid,
          compradorEmail: auth.currentUser.email,
          vendedorId: vendedorId,
          lanches: itens.map((item: any) => ({
            id: item.id,
            nome: item.nome,
            preco: item.preco,
            quantidade: item.quantidade,
          })),
          total: itens.reduce((sum: number, item: any) => sum + item.preco * item.quantidade, 0),
          dataRetirada: dataRetirada,
          status: "pendente", // pendente, confirmado, finalizado, cancelado
          qrCode: idUnico,
          criadoEm: new Date(),
        };

        const docRef = await addDoc(collection(db, "pedidos"), pedido);
        pedidosCriados.push({ ...pedido, id: docRef.id });
      }

      Alert.alert(
        "✅ Pedido Confirmado!",
        `Seu pedido foi realizado com sucesso!\n\n📅 Retirada: ${formatarData(calcularDataRetirada())}\n💰 Total: R$ ${calcularTotal().toFixed(2)}\n\n⚠️ Não esqueça de apresentar o QR Code na retirada!`,
        [
          {
            text: "Ver QR Code",
            onPress: () => {
              limparCarrinho();
              navigation.replace("QRCodePedido", {
                pedidos: pedidosCriados
              });
            },
          },
        ]
      );
    } catch (error: any) {
      console.log("Erro ao finalizar pedido:", error);
      Alert.alert("Erro", `Não foi possível finalizar o pedido: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Renderizar item vazio se carrinho estiver vazio
  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.botaoTexto}>Voltar às compras</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Confirmar Pedido</Text>

      <FlatList
        data={cart}
        keyExtractor={(item, index) => `${item.id}_${index}`}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.detalhes}>
              {item.quantidade}x R$ {item.preco.toFixed(2)}
            </Text>
            <Text style={styles.subtotal}>
              Subtotal: R$ {(item.preco * item.quantidade).toFixed(2)}
            </Text>
          </View>
        )}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.total}>Total: R$ {calcularTotal().toFixed(2)}</Text>
        <Text style={styles.retirada}>
          📅 Retirada: {formatarData(calcularDataRetirada())}
        </Text>
        <Text style={styles.horario}>
          🕐 Horário: Entre 11:00 e 13:00 (intervalo)
        </Text>
        <Text style={styles.aviso}>⚠️ Apresente o QR Code na retirada</Text>
      </View>

      <TouchableOpacity
        style={styles.botaoConfirmar}
        onPress={finalizarPedido}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botaoTexto}>Confirmar Pedido</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff"
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff"
  },

  emptyIcon: {
    fontSize: 80,
    marginBottom: 20
  },

  emptyText: {
    fontSize: 18,
    color: "#999",
    marginBottom: 30
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333"
  },

  item: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee"
  },

  nome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5
  },

  detalhes: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5
  },

  subtotal: {
    color: "#27ae60",
    marginTop: 5,
    fontWeight: "500"
  },

  totalContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff"
  },

  total: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#27ae60",
    marginBottom: 10
  },

  retirada: {
    fontSize: 16,
    marginTop: 5,
    color: "#e74c3c",
    fontWeight: "500"
  },

  horario: {
    fontSize: 14,
    color: "#666",
    marginTop: 5
  },

  aviso: {
    fontSize: 12,
    color: "#f39c12",
    marginTop: 10,
    fontWeight: "500"
  },

  botaoConfirmar: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },

  botaoVoltar: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    elevation: 3
  },

  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16
  }
});