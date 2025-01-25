import React, { useState } from "react";
import {  View,  Text,  StyleSheet,  FlatList,  Pressable,  SafeAreaView,} from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useUserContext } from "@/context/UserContext";
import { error_alert } from "@/components/my_alert";
import Toast from "react-native-toast-message";
import Presupuesto from "./presupuesto";
import { estilos } from "@/components/global_styles";
import { ActionButton,ActionButtonProps } from "@/components/tipos";

interface Presupuesto {
  id: number;
  descripcion: string;
  montoTotal: number;
  total_acumulado: number;
}

export default function Dashboard() {
  const context = useUserContext();
  const [datosPresupuestos, setDatosPresupuestos] = useState<Presupuesto[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const rspPresupuestos = await fetch(
            `${process.env.EXPO_PUBLIC_DATABASE_URL}/presupuestos/activos/${context.id}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (rspPresupuestos.ok) {
            const presupuestosData: Presupuesto[] =
              await rspPresupuestos.json();
            setDatosPresupuestos(presupuestosData.reverse());
          }
        } catch (e) {
          console.error(e);
          error_alert("Hubo un error al obtener los datos de presupuestos.");
        }
      };

      fetchData();
      return () => {};
    }, [context.id])
  );

  const Item: React.FC<Presupuesto> = ({
    id,
    descripcion,
    montoTotal,
    total_acumulado,
  }) =>  {
    return (
    <View style={styles.item} >
      <MaterialIcons name="account-balance" size={24} color="#4CAF50" />
      <View>
        <Text style={styles.itemType}>{descripcion}</Text>
        <Text style={styles.itemAmount}>
          %{((total_acumulado / montoTotal) * 100).toFixed(2)}
        </Text>
      </View>
    </View>
    
  );}

  return (
    <SafeAreaView style={estilos.flex1}>
      <View style={estilos.header}>
        <Text style={estilos.headerTitle}>Dashboard</Text>
      </View>

      <View style={styles.recentTransactions}>
        <Text style={styles.sectionTitle}>Presupuestos activos</Text>
        {datosPresupuestos.length > 0 ? (
          <FlatList<Presupuesto>
            data={datosPresupuestos}
            renderItem={({ item }) => <Item {...item} />}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
          />
        ) : (
          <Text>No hay presupuestos</Text>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.actionButtonsColumn}>
          <ActionButton
            icon="add"
            label="Agregar Gasto"
            href="/tabs/nuevo/gasto"
          />
          <ActionButton
            icon="savings"
            label="Agregar Ingreso"
            href="/tabs/nuevo/ingreso"
          />
          <ActionButton
            icon="account-balance"
            label="Agregar Presupuesto"
            href="/tabs/nuevo/presupuesto"
          />
        </View>
      </View>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 15,
    color: "#007AFF",
  },
  recentTransactions: {
    flex: 1,
    padding: 20,
    zIndex:-1
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 15,
    marginBottom: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemTextContainer: {
    marginLeft: 10,
  },
  itemType: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginLeft: 5
  },
  itemAmount: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5
  },
  actionsContainer: {
    padding: 20,
  },
  actionButtonsColumn: {
    alignItems: "stretch",
  },
 
});
