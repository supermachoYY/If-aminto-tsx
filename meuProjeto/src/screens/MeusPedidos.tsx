import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from "../database/database";

export default function MeusPedidos({ navigation }: any) {
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        buscarPedidos();
    }, []);

    async function buscarPedidos() {
        if (!auth.currentUser) return;

        try {
            const q = query(
                collection(db, "pedidos"),
                where("compradorId", "==", auth.currentUser.uid),
                orderBy("criadoEm", "desc")
            );

            const snapshot = await getDocs(q);
            const lista: any[] = [];
            snapshot.forEach((doc) => {
                lista.push({ id: doc.id, ...doc.data() });
            });
            setPedidos(lista);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    function getStatusColor(status: string) {
        switch (status) {
            case "pendente":
                return "#FFB800";
            case "finalizado":
                return "#27ae60";
            case "cancelado":
                return "#e74c3c";
            default:
                return "#999";
        }
    }

    function getStatusText(status: string) {
        switch (status) {
            case "pendente":
                return "Aguardando retirada";
            case "finalizado":
                return "Finalizado";
            case "cancelado":
                return "Cancelado";
            default:
                return status;
        }
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#FF6B6B" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Meus Pedidos</Text>

            <FlatList
                data={pedidos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() =>
                            navigation.navigate("DetalhesPedido", { pedido: item })
                        }
                    >
                        <View style={styles.header}>
                            <Text style={styles.pedidoId}>Pedido #{item.id.slice(-6)}</Text>
                            <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
                                {getStatusText(item.status)}
                            </Text>
                        </View>

                        <Text style={styles.data}>
                            {new Date(item.criadoEm?.toDate()).toLocaleDateString("pt-BR")}
                        </Text>

                        <Text style={styles.total}>Total: R$ {item.total.toFixed(2)}</Text>

                        {item.status === "finalizado" && !item.avaliado && (
                            <TouchableOpacity
                                style={styles.botaoAvaliar}
                                onPress={() =>
                                    navigation.navigate("AvaliarProduto", {
                                        pedidoId: item.id,
                                        produto: item.lanches[0],
                                        vendedorId: item.vendedorId,
                                    })
                                }
                            >
                                <Text style={styles.botaoAvaliarTexto}>Avaliar Pedido</Text>
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Nenhum pedido encontrado</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    titulo: {
        fontSize: 24,
        fontWeight: "bold",
        padding: 20,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    card: {
        backgroundColor: "#fff",
        margin: 15,
        padding: 15,
        borderRadius: 12,
        elevation: 2,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    pedidoId: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#666",
    },
    status: {
        fontSize: 14,
        fontWeight: "500",
    },
    data: {
        fontSize: 12,
        color: "#999",
        marginBottom: 10,
    },
    total: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FF6B6B",
    },
    botaoAvaliar: {
        backgroundColor: "#4ECDC4",
        padding: 10,
        borderRadius: 8,
        marginTop: 15,
    },
    botaoAvaliarTexto: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
    emptyText: {
        textAlign: "center",
        marginTop: 50,
        color: "#999",
    },
});