import React, { useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { estilos, colores } from "@/components/global_styles";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons"; // Iconos de flecha

export default function Index() {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  return (
    
    <View style={[{ flex: 1 }, estilos.centrado]}>
      {/* Botón principal con flecha */}
      <Pressable onPress={toggleMenu} style={estilos.mainButton}>
        <Text style={estilos.subtitulo}>Menú de Opciones</Text>
        <MaterialIcons 
          name={menuVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
          size={24} 
          color="white" 
        />
      </Pressable>

      {/* Opciones del menú */}
      {menuVisible && (
        <View style={estilos.menu}>
          <Link href="/tabs/nuevo/gasto" asChild>
            <Pressable style={estilos.option}>
              <Text style={estilos.subtitulo}>Agregar Gasto</Text>
            </Pressable>
          </Link>

          <Link href="/tabs/nuevo/ahorro" asChild>
            <Pressable style={estilos.option}>
              <Text style={estilos.subtitulo}>Agregar Ahorro</Text>
            </Pressable>
          </Link>

          <Link href="/tabs/nuevo/presupuesto" asChild>
            <Pressable style={estilos.option}>
              <Text style={estilos.subtitulo}>Agregar Presupuesto</Text>
            </Pressable>
          </Link>
        </View>
      )}
    </View>
  );
}

