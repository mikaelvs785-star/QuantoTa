import { useState } from "react";
import { router } from "expo-router";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { api } from "@/services/api";
import { styles } from "@/theme/styles";

export default function RegisterScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!nome.trim() || !email.trim() || senha.length < 8) return Alert.alert("Confira os dados", "Informe nome, e-mail e senha com pelo menos 6 caracteres.");
    setBusy(true);
    try {
      await api.post("/auth/register", { nome: nome.trim(), email: email.trim(), senha });
      Alert.alert("Cadastro recebido", "Agora entre com seu e-mail e senha.", [{ text: "Continuar", onPress: () => router.replace("/(auth)/login") }]);
    } catch { Alert.alert("Não foi possível cadastrar", "Confira os dados e tente novamente."); }
    finally { setBusy(false); }
  }

  return <View style={styles.authPage}>
    <Text style={styles.eyebrow}>QUANTOTÁ</Text><Text style={styles.screenTitle}>Criar sua conta</Text>
    <Text style={styles.muted}>Seus dados serão registrados no mesmo sistema do site.</Text>
    <TextInput style={styles.input} placeholder="Nome completo" value={nome} onChangeText={setNome} />
    <TextInput style={styles.input} placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
    <TextInput style={styles.input} placeholder="Senha (mínimo 8 caracteres)" secureTextEntry value={senha} onChangeText={setSenha} />
    <TouchableOpacity style={styles.primaryButton} onPress={submit} disabled={busy}><Text style={styles.primaryButtonText}>{busy ? "Criando..." : "Criar conta"}</Text></TouchableOpacity>
  </View>;
}