import { Text, View,  Dimensions,StyleSheet } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import { PieChart } from "react-native-chart-kit";
import { useUserContext } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { Category } from "@/components/tipos";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React from "react";


type Suma= {_sum:{monto:number},category_id:number}
type Datos = {cant: number,name: string,color:string,legendFontColor: string,legendFontSize:number,porcentaje:number}

export default function Gastos_por_Categoria() {
    const context = useUserContext();
    const [datos,setDatos] = useState<Datos[]>();
    const colors = ["rgba(131, 167, 234, 1)","red","#c722fd","#00d2d2","#159572"]

    useFocusEffect(
      React.useCallback(() => {
        (async ()=>{
          try{
            const cat =await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/categorias/de_gastos`,{
              method:'GET',
              headers:{"Content-Type":"application/json"}})

            const rsp=await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/gastos/agrupar_por_categoria/${context.id}`,{
              method:'GET',
              headers:{"Content-Type":"application/json"}})
            if (!rsp.ok || !cat.ok){
              throw new Error()
            }else {
              const info:Suma[] = await rsp.json();
              const info_categorias= await cat.json();
              const total= info.reduce((accumulator:number,currentValue)=>accumulator+currentValue._sum.monto,0)
              const lista:Datos[] = info.map((each:Suma,index:number)=>{
                const nombre_cat=info_categorias.find((cat:Category) => cat.id==each.category_id)?.name;
                return {cant:each._sum.monto,name:nombre_cat,color:colors[index],legendFontColor:"#7F7F7F", legendFontSize: 15,porcentaje:Math.round(each._sum.monto/total*100)}
              })
              setDatos(lista);
            }
 
          }
          catch(e){
            console.log(e);
          }
        })();
    
        return () => {
          false;
        };
      }, [context.id])
    );
    
  return (
    <View style={[{flex: 1},estilos.centrado]} >
      {datos==undefined ? <Text>Todavía no has cargado gastos</Text>:
      <View>
        <PieChart
          data={datos}
          width={Dimensions.get("window").width}
          height={Dimensions.get("window").height/2}
          chartConfig={chartConfig}
          accessor={"cant"}
          backgroundColor={"transparent"}
          paddingLeft={"1"}
          center={[100, 0]}
          style={{flex:1}}
          hasLegend={false}
        />
        <View style={[{flex:1,alignSelf:"center",marginTop:100}]}>
          {datos.map((value,index)=>{
            return (
              <View style={styles.legendItem} key={index}>
                  <FontAwesome name="circle" size={24} color={value.color} />
                  <Text style={[styles.legendItemValue,{fontSize:value.legendFontSize,color:value.legendFontColor}]}>
                    {value.porcentaje} % 
                  </Text>
                  <Text style={{fontSize:value.legendFontSize,color:value.legendFontColor}}>
                    {value.name}
                  </Text>
               </View>
           
          )})}
        </View>
      </View>
      }
      
    </View>
  );
}





const chartConfig = {
  backgroundGradientFrom: "#004040",
  backgroundGradientFromOpacity: 4,
  backgroundGradientTo: "#005b5b",
  backgroundGradientToOpacity: 5,
  color: (opacity = 1) => `rgba(26, 255, 120, ${opacity})`,
  strokeWidth: 6,
  barPercentage: 0.8,
  useShadowColorFromDataset: false,
};
const styles = StyleSheet.create({
   legend: {
      marginHorizontal: 10,
   },
   legendItem: {
      flexDirection: "row",
      marginVertical:8
   },
   legendItemValue: {
      marginHorizontal: 10,
   },
});