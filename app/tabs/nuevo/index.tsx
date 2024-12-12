import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, SafeAreaView } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useUserContext } from "@/context/UserContext";
import { error_alert} from '@/components/my_alert';
import { RootSiblingParent } from 'react-native-root-siblings';

interface Ingreso {
  id: number;
  monto: number;
}

interface Movimiento {
  id: string;
  type: string;
  monto: number;
}

interface ItemProps {
  type: string;
  monto: number;
}

interface ActionButtonProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  href: string;
}

export default function Dashboard() {
  const context = useUserContext();
  const [datosIngresos, setDatosIngresos] = useState<Ingreso[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const rspIngresos = await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/ingresos/${context.id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
  
          if (rspIngresos.ok) {
            const ingresosData: Ingreso[] = await rspIngresos.json();
            setDatosIngresos(ingresosData.reverse());
            
          }
        } catch (e) {
          console.error(e);
          error_alert("Hubo un error al obtener los datos.");
        }
      };
  
      fetchData();
      return () => {
        
      };
    }, [context.id])
  );

  const movimientosRecientes: Movimiento[] = datosIngresos.slice(-5).map((ingreso) => ({
    id: `ingreso-${ingreso.id}`,
    type: "Ingreso",
    monto: ingreso.monto,
  }));

  const Item: React.FC<ItemProps> = ({ type, monto }) => (
    <View style={styles.item}>
      <MaterialIcons name="attach-money" size={24} color="#4CAF50" />
      <View>
        <Text style={styles.itemType}>{type}</Text>
        <Text style={styles.itemAmount}>${monto.toFixed(2)}</Text>
      </View>
    </View>
  );

  const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, href }) => (
    <Link href={href} asChild>
      <Pressable style={styles.actionButton}>
        <MaterialIcons name={icon} size={24} color="#FFFFFF" />
        <Text style={styles.actionButtonText}>{label}</Text>
      </Pressable>
    </Link>
  );

  return (
    <RootSiblingParent>
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>
      
      <View style={styles.recentTransactions}>
        <Text style={styles.sectionTitle}>Movimientos Recientes</Text>
        <FlatList<Movimiento>
          data={movimientosRecientes}
          renderItem={({ item }) => <Item type={item.type} monto={item.monto} />}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      </View>

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.actionButtonsColumn}>
          <ActionButton icon="add" label="Agregar Gasto" href="/tabs/nuevo/gasto" />
          <ActionButton icon="savings" label="Agregar Ingreso" href="/tabs/nuevo/ingreso" />
          <ActionButton icon="account-balance" label="Agregar Presupuesto" href="/tabs/nuevo/presupuesto" />
        </View>
      </View>
    </SafeAreaView>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    backgroundColor: "#3F51B5",
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  recentTransactions: {
    flex: 1,
    padding: 20,
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  itemType: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  itemAmount: {
    fontSize: 14,
    color: "#666",
  },
  actionsContainer: {
    padding: 20,
  },
  actionButtonsColumn: {
    alignItems: "stretch",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3F51B5",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  actionButtonText: {
    color: "#FFFFFF",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
  },
});

