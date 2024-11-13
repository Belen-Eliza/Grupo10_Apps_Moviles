import React, { useState, useEffect } from "react";
import {ImageBackground, Pressable, Text, View, StyleSheet, FlatList, StatusBar } from "react-native";
import { estilos } from "@/components/global_styles";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons"; 
import { useUserContext } from "@/context/UserContext";

export default function Index() {
  const context = useUserContext();
  const [datosGastos, setDatosGastos] = useState([]); 
  const [datosIngresos, setDatosIngresos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const rspIngresos = await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/ingresos/${context.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });


        if (rspIngresos.ok) {
          const ingresosData = await rspIngresos.json();
          setDatosIngresos(ingresosData); 
        }
      } catch (e) {
        console.log(e);
        alert("Hubo un error al obtener los datos.");
      }
    };

    fetchData();
  }, [context.id]);

  const movimientosRecientes = [
    ...datosIngresos.slice(-10).map((ingreso) => ({
      id: `ingreso-${ingreso.id}`,
      type: "Ingreso",
      monto: ingreso.monto,
    })),
  ];

  movimientosRecientes.sort((a, b) => b.id.localeCompare(a.id));

  const Item = ({ type, monto }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{type}: {monto}</Text>
    </View>
  );

  return (
    <ImageBackground source={require('@/assets/images/fondo.jpg')} style={estilos.background}>
    <View style={[{ flex: 1 }, estilos.centrado]}>
      <Text style={styles.sectionTitle}>Últimos ingresos </Text>
      <Text>(Desde el ultimo login)</Text>
      <FlatList
        horizontal={true}
        data={movimientosRecientes}
        renderItem={({ item }) => <Item type={item.type} monto={item.monto} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      />

      <View style={styles.buttonsContainer}>
        <View style={styles.buttonRow}>
          <Link href="/tabs/nuevo/gasto" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Agregar Gasto</Text>
            </Pressable>
          </Link>
          <Link href="/tabs/nuevo/ahorro" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Agregar Ahorro</Text>
            </Pressable>
          </Link>
        </View>

        <Link href="/tabs/nuevo/presupuesto" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Agregar Presupuesto</Text>
          </Pressable>
        </Link>
      </View>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  item: {
    maxHeight: 60,
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 16,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '80%',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    minWidth: 150,
    maxHeight:50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});