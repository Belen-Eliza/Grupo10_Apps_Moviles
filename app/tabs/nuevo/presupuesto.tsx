import { Text, View } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import { useState,useEffect } from "react";
import { useUserContext } from "@/context/UserContext"; 
import Boton from "@/components/Boton";
import { Link } from "expo-router";


export default function Presupuesto() {

  return (
    <View style={[{flex: 1},estilos.centrado]} >
      <Text>Sumar presupuesto</Text>
    </View>
  );
}
