import { useUserContext } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { Text, View, Pressable, Dimensions } from "react-native";
import { estilos,colores } from "@/components/global_styles";
import React from 'react';
import { router } from "expo-router";
import { LineChart, PieChart } from "react-native-chart-kit";

type Category ={id :number, name: string,description: string}
type Gasto ={ id: number, monto: number, cant_cuotas:number, fecha: Date, category: Category}

export default function Estadisticas (){
    const context = useUserContext();
    const [gastos,setData] =useState<Gasto[]>([]);

    useEffect(()=>{
        (async ()=>{
            fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/gastos/${context.id}`,{
              method:'GET',
              headers:{"Content-Type":"application/json"}})
            .then(rsp =>rsp.json())
            .then(info =>setData(info))
        })
    },[context.id])

    const data = {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
          {
            data: gastos?.map(g=>g.monto),
            color: (opacity = 1) => `rgba(163, 230, 219, ${opacity})`, // optional
            strokeWidth: 6 // optional
          }
        ],
        legend: ["Gastos"] 
      };
    return (
        <View style={estilos.mainView}>

<LineChart
  data={data}
  width={Dimensions.get("window").width}
  height={Dimensions.get("window").height*0.8}
  chartConfig={chartConfig}
/>
        </View>
    )
}

const chartConfig = {
    backgroundGradientFrom: "#004040",
    backgroundGradientFromOpacity: 4,
    backgroundGradientTo: "#005b5b",
    backgroundGradientToOpacity: 5,
    color: (opacity = 1) => `rgba(26, 255, 120, ${opacity})`,
    strokeWidth: 6, // optional, default 3
    barPercentage: 0.8,
    useShadowColorFromDataset: false // optional
  };