import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../database/database";

export default function LerQRCode({ navigation }: any) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    async function handleBarCodeScanned({ data }: any) {
        if (scanned || loading) return;

        setScanned(true);
        setLoading(true);

        try {
            const qrData = JSON.parse(data);
            const { pedidoId, codigo, vendedorId } = qrData;

            // Verificar se o vendedor logado é o dono do pedido
            if (auth.currentUser?.uid !== vendedorId) {
                Alert.alert("Erro", "Este QR Code não pertence aos seus produtos");
                setScanned(false);
                setLoading(false);
                return;
            }

            // Buscar pedido
            const pedidoRef = doc(db, "pedidos", pedidoId);
            const pedidoSnap = await getDoc(pedidoRef);

            if (!pedidoSnap.exists()) {
                Alert.alert("Erro", "Pedido não encontrado");
                setScanned(false);
                setLoading(false);
                return;
            }

            const pedido = pedidoSnap.data();

            if (pedido.status === "finalizado") {
                Alert.alert("Aviso", "Este pedido já foi retirado");
                setScanned(false);
                setLoading(false);
                return;
            }

            // Confirmar retirada
            await updateDoc(pedidoRef, {
                status: "finalizado",
                retiradoEm: new Date(),
            });

            Alert.alert("Sucesso", "Pedido confirmado e liberado para retirada!");
            navigation.goBack();
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "QR Code inválido");
            setScanned(false);
        } finally {
            setLoading(false);
        }
    }

    if (hasPermission === null) {
        return (
            <View style={styles.center}>
                <Text>Solicitando permissão da câmera...</Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.center}>
                <Text>Sem acesso à câmera</Text>
                <TouchableOpacity
                    style={styles.botao}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.botaoTexto}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />

            {loading && (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Validando pedido...</Text>
                </View>
            )}

            {scanned && !loading && (
                <TouchableOpacity
                    style={styles.botaoEscanear}
                    onPress={() => setScanned(false)}
                >
                    <Text style={styles.botaoTexto}>Escanear novamente</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                style={styles.botaoVoltar}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.botaoTexto}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    loading: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: { color: "#fff", marginTop: 10 },
    botaoEscanear: {
        position: "absolute",
        bottom: 100,
        alignSelf: "center",
        backgroundColor: "#3498db",
        padding: 15,
        borderRadius: 8,
    },
    botaoVoltar: {
        position: "absolute",
        bottom: 30,
        alignSelf: "center",
        backgroundColor: "#e74c3c",
        padding: 15,
        borderRadius: 8,
    },
    botao: { backgroundColor: "#3498db", padding: 15, borderRadius: 8, marginTop: 20 },
    botaoTexto: { color: "#fff", fontWeight: "bold" },
});