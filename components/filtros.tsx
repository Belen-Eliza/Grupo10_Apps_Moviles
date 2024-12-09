import { Text, View, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { estilos } from "@/components/global_styles";
import { Filtro_aplicado } from "@/components/botones";
import {traer_categorias } from "@/components/CategoryPicker";
import React, { useState } from "react";
import { Category, Gasto, Presupuesto } from "@/components/tipos";

function Filtros(props:{setDateModalVisible:Function,setCatModalVisible:Function,hay_filtros:Function,limpiar_filtros:Function,visibles:boolean[],resets:Function[],values:string[]}) {
    const [todas_categorias,setCategorias] =useState<Category[]>([{id:0,name:"",description:""}])
    traer_categorias(setCategorias);
    return(
    <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Filtrar por:</Text>
        <View style={styles.filterButtonsContainer}>
            <Pressable onPress={() => props.setDateModalVisible(true)} style={styles.filterButton}>
                <MaterialIcons name="event" size={24} color="#FFFFFF" />
                <Text style={styles.filterButtonText}>Fecha</Text>
            </Pressable>
            <Pressable onPress={() => props.setCatModalVisible(true)} style={styles.filterButton}>
                <MaterialIcons name="category" size={24} color="#FFFFFF" />
                <Text style={styles.filterButtonText}>Categoría</Text>
            </Pressable>
            <Pressable onPress={props.hay_filtros() ? props.limpiar_filtros(): ()=>{}} style={[styles.filterButton,{backgroundColor: props.hay_filtros() ? "#3F51B5":"lightgray"}]}>
                <MaterialIcons name="clear-all" size={24} color="#FFFFFF" />
                <Text style={styles.filterButtonText}>Limpiar</Text>
            </Pressable>
        </View>
        <View style={[styles.filterButtonsContainer,{flexWrap:"wrap"}]}>
            <Filtro_aplicado texto={props.values[0]} callback={props.resets[0]} isVisible={props.visibles[0]}/>
            <Filtro_aplicado texto={props.values[1]} callback={props.resets[1]} isVisible={props.visibles[1]}/>
            <Filtro_aplicado texto={props.values[2]} callback={props.resets[2]} isVisible={props.visibles[2]}/>
        </View>
    </View>
)}

const styles = StyleSheet.create({
   
    filterContainer: {
      backgroundColor: "#FFFFFF",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#E0E0E0",
    },
    filterTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 8,
      color: "#333333",
    },
    filterButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    filterButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#3F51B5",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    filterButtonText: {
      color: "#FFFFFF",
      marginLeft: 8,
      fontSize: 14,
    },
});
  
export {Filtros}  