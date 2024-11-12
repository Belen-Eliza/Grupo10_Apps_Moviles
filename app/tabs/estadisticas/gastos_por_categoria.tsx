import { Pressable, Text, View, StyleSheet, Dimensions } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import { PieChart } from "react-native-chart-kit";
import { useUserContext } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { Category } from "@/components/tipos";

type Suma= {_sum:{monto:number},category_id:number}
type Datos = {cant: number,name: string,color:string,legendFontColor: string,legendFontSize:number}

export default function Gastos_por_Categoria() {
    const context = useUserContext();
    const [datos,setDatos] = useState<Datos[]>([]);
    const colors = ["rgba(131, 167, 234, 1)","#ff0080","red","#c722fd","#00d2d2","#159572"]
    
    useEffect(()=>{
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
              const info = await rsp.json();
              const info_categorias= await cat.json();
              const lista:Datos[] = info.map((each:Suma,index:number)=>{
                const nombre_cat=info_categorias.find((cat:Category) => cat.id==each.category_id)?.name;
                return {cant:each._sum.monto,name:nombre_cat,color:colors[index],legendFontColor:"#7F7F7F", legendFontSize: 15}
              })
              setDatos(lista);
            }
 
          }
          catch(e){
            console.log(e)
            alert("No has cargado ningún gasto")
          }
        })();

    },[context.id])

  return (
    <View style={[{flex: 1},estilos.centrado]} >
      {datos==undefined ? <Text>No hay gastos</Text>:
      <PieChart
        data={datos}
        width={Dimensions.get("window").width}
        height={230}
        chartConfig={chartConfig}
        accessor={"cant"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        center={[6, 20]}
      />}
      
    </View>
  );
}


const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2,
  useShadowColorFromDataset: false,
};