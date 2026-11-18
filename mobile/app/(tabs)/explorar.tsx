import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Product } from "@/types";
import { styles } from "@/theme/styles";

export default function ExploreScreen() {
  const [term, setTerm] = useState("");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["mobile-products", term],
    queryFn: async () => {
      const response = await api.get("/produtos", { params: term ? { busca: term } : undefined });
      const body = response.data;
      return (Array.isArray(body) ? body : body?.content ?? body?.data ?? []) as Product[];
    }
  });
  return <ScrollView style={styles.page} contentContainerStyle={styles.content}>
    <Text style={styles.eyebrow}>CATÁLOGO</Text><Text style={styles.screenTitle}>Explore produtos</Text>
    <Text style={styles.muted}>Encontre produtos para comparar nos mercados.</Text>
    <TextInput style={styles.input} placeholder="Buscar produto..." value={term} onChangeText={setTerm} />
    {isLoading && <ActivityIndicator color="#167A58" />}
    {isError && <Text style={styles.notice}>Não foi possível carregar os produtos. Confira sua conexão.</Text>}
    {data?.map((product, index) => <View key={String(product.id ?? index)} style={styles.productRow}>
      <View style={styles.productThumb}><Text style={styles.productThumbText}>Q</Text></View>
      <View style={{ flex: 1 }}><Text style={styles.productName}>{product.nome ?? product.name ?? "Produto"}</Text><Text style={styles.muted}>{product.marca ?? product.brand ?? "Consulte os mercados"}</Text></View>
    </View>)}
    {!isLoading && !isError && data?.length === 0 && <Text style={styles.notice}>Nenhum produto encontrado.</Text>}
  </ScrollView>;
}