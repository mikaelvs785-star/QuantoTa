import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { styles } from "@/theme/styles";

export default function HomeScreen() {
  return <ScrollView style={styles.page} contentContainerStyle={styles.content}>
    <View style={styles.topline}><Text style={styles.brand}>Quanto<Text style={{ color: "#167A58" }}>Tá</Text></Text><Text style={styles.pill}>ECONOMIA INTELIGENTE</Text></View>
    <Text style={styles.eyebrow}>BEM-VINDO AO QUANTOTÁ</Text>
    <Text style={styles.heroTitle}>O melhor preço{ "\n" }está mais perto.</Text>
    <Text style={styles.muted}>Compare mercados, encontre ofertas e monte uma lista de compras mais econômica.</Text>
    <Link href="/(tabs)/explorar" asChild><TouchableOpacity style={styles.primaryButton}><Text style={styles.primaryButtonText}>Explorar produtos  →</Text></TouchableOpacity></Link>
    <View style={styles.featureCard}><Text style={styles.cardEyebrow}>COMPARE COM INTELIGÊNCIA</Text><Text style={styles.cardTitle}>O preço certo vai além da etiqueta.</Text><Text style={styles.cardBody}>Compare valores por kg, litro e unidade para entender qual embalagem realmente compensa.</Text><Link href="/(tabs)/comparador" style={styles.link}>Abrir comparador →</Link></View>
    <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Sua próxima economia</Text><Text style={styles.muted}>Comece pesquisando</Text></View>
    <Link href="/(tabs)/lista" asChild><TouchableOpacity style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>Organizar minha lista</Text></TouchableOpacity></Link>
  </ScrollView>;
}