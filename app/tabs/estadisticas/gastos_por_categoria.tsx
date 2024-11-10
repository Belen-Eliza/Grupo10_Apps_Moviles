import { Pressable, Text, View, StyleSheet } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import { Link } from "expo-router";
import { PieChart } from "react-native-chart-kit";
import { useUserContext } from "@/context/UserContext";
import { useState, useEffect } from "react";

export default function Gastos_por_Categoria() {
    const context = useUserContext();
    useEffect(()=>{
        (async ()=>{

        })();
    })

  return (
    <View style={[{flex: 1},estilos.centrado]} >
      <Text>Hola</Text>
      
    </View>
  );
}