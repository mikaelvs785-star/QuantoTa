import { Redirect } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { token, loading } = useAuth();
  if (loading) return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><ActivityIndicator color="#167A58" /></View>;
  return <Redirect href={token ? "/(tabs)" : "/(auth)/login"} />;
}