import { Text, View } from "react-native";
import { styles } from "@/theme/styles";

export default function ComparatorScreen() {
  return <View style={styles.pageCenter}>
    <Text style={styles.eyebrow}>DECISÃO INTELIGENTE</Text>
    <Text style={styles.screenTitle}>Comparador</Text>
    <Text style={styles.muted}>Pesquise um produto em Explorar para começar a comparar preços e tamanhos de embalagem.</Text>
  </View>;
}