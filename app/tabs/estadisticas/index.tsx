import React from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { estilos, colores } from "@/components/global_styles";

export default function UpdatedEnhancedStatisticsMenu() {
  return (
    <SafeAreaView style={[styles.container, estilos.background2]}>
      <View style={estilos.header}>
        <Text style={estilos.headerTitle}>Statistics</Text>
      </View>
      
      <View style={styles.content}>
        <Link href="/tabs/estadisticas/gastos_por_fecha" asChild>
          <Pressable style={styles.card}>
            <View style={styles.iconContainer}>
              <Ionicons name="calendar-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Expenses by Date</Text>
              <Text style={styles.cardDescription}>View your spending patterns over time</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="#007AFF" />
          </Pressable>
        </Link>

        <Link href="/tabs/estadisticas/gastos_por_categoria" asChild>
          <Pressable style={styles.card}>
            <View style={styles.iconContainer}>
              <Ionicons name="pie-chart-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Expenses by Category</Text>
              <Text style={styles.cardDescription}>Analyze your spending across different categories</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="#007AFF" />
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
 
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: "#007AFF", // This was already the correct color
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
  },
});

