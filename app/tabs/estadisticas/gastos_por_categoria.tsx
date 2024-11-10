import { Pressable, Text, View, StyleSheet, Dimensions } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import { Link } from "expo-router";
import { PieChart } from "react-native-chart-kit";
import { useUserContext } from "@/context/UserContext";
import { useState, useEffect } from "react";

export default function Gastos_por_Categoria() {
    const context = useUserContext();
    const data = [
      {
        name: "Seoul",
        population: 21500000,
        color: "rgba(131, 167, 234, 1)",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      },
      {
        name: "Toronto",
        population: 2800000,
        color: "#F00",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      },
      {
        name: "Beijing",
        population: 527612,
        color: "red",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      },
      {
        name: "New York",
        population: 8538000,
        color: "#ffffff",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      },
      {
        name: "Moscow",
        population: 11920000,
        color: "rgb(0, 0, 255)",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      }
    ];
    useEffect(()=>{
        (async ()=>{

        })();
    })

  return (
    <View style={[{flex: 1},estilos.centrado]} >
      
      <PieChart
        data={data}
        width={Dimensions.get("window").width}
        height={200}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        center={[6, 20]}
      />
      
    </View>
  );
}


const chartConfig = {
  /* backgroundGradientFrom: "#004040",
  backgroundGradientFromOpacity: 4,
  backgroundGradientTo: "#005b5b",
  backgroundGradientToOpacity: 5, */
  color: (opacity = 1) => `rgba(26, 255, 120, ${opacity})`,
  strokeWidth: 6, // optional, default 3
  barPercentage: 0.8,
  useShadowColorFromDataset: false // optional
};