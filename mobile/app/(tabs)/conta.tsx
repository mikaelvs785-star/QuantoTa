import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { styles } from "@/theme/styles";

export default function AccountScreen() {
  const { signOut, profile } = useAuth();
  return <View style={styles.pageCenter}>
    <Text style={styles.eyebrow}>SUA CONTA</Text><Text style={styles.screenTitle}>Olá!</Text>
    <Text style={styles.muted}>{profile?.nome ?? profile?.email ?? "Sua conta QuantoTá"}</Text>
    <TouchableOpacity style={styles.secondaryButton} onPress={() => Alert.alert("Sair da conta", "Deseja encerrar sua sessão?", [{ text: "Cancelar", style: "cancel" }, { text: "Sair", style: "destructive", onPress: signOut }])}><Text style={styles.secondaryButtonText}>Sair da conta</Text></TouchableOpacity>
  </View>;
}