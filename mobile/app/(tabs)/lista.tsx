import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { api } from "@/services/api";
import { styles } from "@/theme/styles";

export default function ListScreen() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["mobile-lists"], queryFn: async () => {
    const response = await api.get("/listas");
    return response.data;
  }});
  return <ScrollView style={styles.page} contentContainerStyle={styles.content}>
    <Text style={styles.eyebrow}>PLANEJE SUAS COMPRAS</Text><Text style={styles.screenTitle}>Minha lista</Text>
    <Text style={styles.muted}>Suas listas ficam sincronizadas com sua conta QuantoTá.</Text>
    {isLoading && <ActivityIndicator color="#167A58" />}
    {isError && <Text style={styles.notice}>Não foi possível carregar suas listas.</Text>}
    {!isLoading && !isError && <View style={styles.featureCard}><Text style={styles.cardTitle}>Suas listas</Text><Text style={styles.cardBody}>{Array.isArray(data) ? data.length + " lista(s) encontrada(s)." : "Conexão com listas estabelecida. A apresentação detalhada será ajustada ao DTO confirmado."}</Text></View>}
  </ScrollView>;
}