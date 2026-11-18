import { Tabs } from "expo-router";
import { Text } from "react-native";

const tabIcon = (symbol: string) => ({ color }: { color: string }) => <Text style={{ color, fontSize: 18, fontWeight: "700" }}>{symbol}</Text>;

export default function TabsLayout() {
  return <Tabs screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: "#167A58",
    tabBarInactiveTintColor: "#87938B",
    tabBarStyle: { height: 66, paddingTop: 8, paddingBottom: 8, borderTopColor: "#E6EBE6", backgroundColor: "#FFFFFF" },
    tabBarLabelStyle: { fontSize: 11, fontWeight: "600" }
  }}>
    <Tabs.Screen name="index" options={{ title: "Início", tabBarIcon: tabIcon("⌂") }} />
    <Tabs.Screen name="explorar" options={{ title: "Explorar", tabBarIcon: tabIcon("⌕") }} />
    <Tabs.Screen name="comparador" options={{ title: "Comparar", tabBarIcon: tabIcon("⇄") }} />
    <Tabs.Screen name="lista" options={{ title: "Minha lista", tabBarIcon: tabIcon("☷") }} />
    <Tabs.Screen name="conta" options={{ title: "Conta", tabBarIcon: tabIcon("○") }} />
  </Tabs>;
}