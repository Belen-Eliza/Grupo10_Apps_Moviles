import React, { useState, useEffect } from "react";
import {ImageBackground, Pressable, Text, View, StyleSheet, FlatList, StatusBar } from "react-native";
import { colores, estilos } from "@/components/global_styles";
import { Link } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons"; 
import { useUserContext } from "@/context/UserContext";
import { Ingreso,Gasto } from "@/components/tipos";

export default function Index() {
  const context = useUserContext();
  const [datosGastos, setDatosGastos] = useState<Gasto[]>([]); 
  const [datosIngresos, setDatosIngresos] = useState<Ingreso[]>([]);

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

  const Item = ({ type, monto }:{type:string,monto:number}) => (
    <View style={styles.item}>
      <Text style={styles.title}>{type}: {monto}</Text>
    </View>
  );

  return (
    <View style={[estilos.background,colores.fondo2]}>
    <View style={[{ flex: 1 }, estilos.centrado]}>
      <Text style={[styles.sectionTitle,{color: "white"}]}>Últimos ingresos </Text>
      <Text style={{color:"white"}}>(Desde el ultimo login)</Text>
      <FlatList
        horizontal={true}
        data={movimientosRecientes}
        renderItem={({ item }) => <Item type={item.type} monto={item.monto} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      />

      <View style={styles.buttonsContainer}>
        {/* <View style={styles.buttonRow}> */}
          <Link href="/tabs/nuevo/gasto" asChild>
            <Pressable style={estilos.button}>
            <Ionicons name="cart-outline" size={24} color="#fff" style={estilos.buttonIcon} />
              
              <Text style={estilos.buttonText}>Agregar Gasto</Text>
            </Pressable>
          </Link>
          <Link href="/tabs/nuevo/ingreso" asChild>
            <Pressable style={estilos.button}>
             <Ionicons name="cash-outline" size={24} color="#fff" style={estilos.buttonIcon} />
              <Text style={estilos.buttonText}>Agregar Ingreso</Text>
            </Pressable>
          </Link>
       {/*  </View> */}

        <Link href="/tabs/nuevo/presupuesto" asChild>
          <Pressable style={estilos.button}>
            <Ionicons name="briefcase-outline" size={24} color="#fff" style={estilos.buttonIcon} />
            <Text style={estilos.buttonText}>Agregar Presupuesto</Text>
          </Pressable>
        </Link>
      </View>
    </View>
    </View>
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