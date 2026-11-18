import { useState } from "react";
import { Link, router } from "expo-router";
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { styles } from "@/theme/styles";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { signIn } = useAuth();

  async function submit() {
    if (!email.trim() || !password) return Alert.alert("Dados incompletos", "Informe e-mail e senha.");
    setBusy(true);
    try { await signIn(email.trim(), password); router.replace("/(tabs)"); }
    catch { Alert.alert("Não foi possível entrar", "Confira suas credenciais e tente novamente."); }
    finally { setBusy(false); }
  }

  return <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.authPage}>
    <View style={styles.brandMark}><Text style={styles.brandMarkText}>Q</Text></View>
    <Text style={styles.eyebrow}>COMPRAR MELHOR COMEÇA AQUI</Text>
    <Text style={styles.heroTitle}>Seu mercado,{ "\n" }seu preço.{ "\n" }sua economia.</Text>
    <Text style={styles.muted}>Entre para comparar preços e organizar suas compras.</Text>
    <TextInput style={styles.input} placeholder="Seu e-mail" placeholderTextColor="#829087" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
    <TextInput style={styles.input} placeholder="Sua senha" placeholderTextColor="#829087" secureTextEntry value={password} onChangeText={setPassword} />
    <TouchableOpacity style={styles.primaryButton} onPress={submit} disabled={busy}><Text style={styles.primaryButtonText}>{busy ? "Entrando..." : "Entrar"}</Text></TouchableOpacity>
    <View style={styles.inline}><Text style={styles.muted}>Ainda não tem conta? </Text><Link href="/(auth)/register" style={styles.link}>Criar conta</Link></View>
  </KeyboardAvoidingView>;
}