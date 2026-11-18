import { StyleSheet } from "react-native";

export const colors = { green: "#167A58", dark: "#17352A", text: "#24342B", muted: "#718078", canvas: "#F5F7F4", white: "#FFFFFF", border: "#E4EAE5", pale: "#EAF3ED" };

export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: 22, paddingTop: 58, paddingBottom: 36, gap: 16 },
  pageCenter: { flex: 1, backgroundColor: colors.canvas, padding: 26, justifyContent: "center", gap: 16 },
  authPage: { flex: 1, backgroundColor: colors.canvas, justifyContent: "center", padding: 26, gap: 16 },
  brandMark: { width: 54, height: 54, borderRadius: 18, backgroundColor: colors.green, alignItems: "center", justifyContent: "center" },
  brandMarkText: { color: colors.white, fontSize: 28, fontWeight: "900" },
  brand: { color: colors.dark, fontSize: 25, fontWeight: "900", letterSpacing: -1 },
  topline: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  pill: { color: colors.green, backgroundColor: colors.pale, borderRadius: 20, overflow: "hidden", paddingHorizontal: 10, paddingVertical: 6, fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  eyebrow: { color: colors.green, fontSize: 10, fontWeight: "800", letterSpacing: 1.6 },
  heroTitle: { color: colors.dark, fontSize: 39, lineHeight: 43, fontWeight: "900", letterSpacing: -1.5 },
  screenTitle: { color: colors.dark, fontSize: 30, fontWeight: "800", letterSpacing: -1 },
  muted: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  input: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 15, color: colors.text, fontSize: 15 },
  primaryButton: { backgroundColor: colors.green, padding: 17, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  primaryButtonText: { color: colors.white, fontSize: 15, fontWeight: "800" },
  secondaryButton: { backgroundColor: colors.pale, padding: 16, borderRadius: 14, alignItems: "center" },
  secondaryButtonText: { color: colors.green, fontWeight: "800" },
  inline: { flexDirection: "row", justifyContent: "center" },
  link: { color: colors.green, fontWeight: "800" },
  featureCard: { backgroundColor: colors.dark, borderRadius: 22, padding: 22, gap: 12, marginTop: 10 },
  cardEyebrow: { color: "#9BD5B8", fontSize: 10, fontWeight: "800", letterSpacing: 1.4 },
  cardTitle: { color: colors.white, fontSize: 22, fontWeight: "800", lineHeight: 28 },
  cardBody: { color: "#D2E1D7", fontSize: 14, lineHeight: 21 },
  sectionHeader: { gap: 4, marginTop: 10 },
  sectionTitle: { color: colors.dark, fontSize: 20, fontWeight: "800" },
  productRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 13, borderRadius: 16, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  productThumb: { width: 54, height: 54, borderRadius: 14, backgroundColor: colors.pale, alignItems: "center", justifyContent: "center" },
  productThumbText: { color: colors.green, fontWeight: "900", fontSize: 22 },
  productName: { color: colors.text, fontSize: 15, fontWeight: "800" },
  notice: { color: colors.muted, paddingVertical: 12, lineHeight: 20 }
});