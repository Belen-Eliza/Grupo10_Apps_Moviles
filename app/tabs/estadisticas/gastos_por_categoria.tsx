import { Text, View,  Dimensions,StyleSheet, ScrollView, Pressable } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import { PieChart } from "react-native-chart-kit";
import { useUserContext } from "@/context/UserContext";
import { useState } from "react";
import { Category } from "@/components/tipos";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useNavigation } from '@react-navigation/native';
import React from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {mes_siguiente, mes_anterior,meses, today } from "@/components/dias";
import {LoadingCircle} from "@/components/loading"
import { comparar_mes_year } from "@/components/DateRangeModal";

type Suma= {_sum:{monto:number},category_id:number}
type Datos = {cant: number,name: string,color:string,legendFontColor: string,legendFontSize:number,porcentaje:number}

export default function Gastos_por_Categoria() {
    const context = useUserContext();
    const [datos,setDatos] = useState<Datos[]>([]);
    const [total_gastado,setTotal] = useState(0);
    const [mes,setMes]=useState(new Date());
    const [dateString,setDateString] = useState(meses[mes.getMonth()]+" "+mes.getFullYear())
    const [isFetching,setFetching] = useState(true);
    const navigation = useNavigation();
    
    const dimensions = [Dimensions.get("window").width,Dimensions.get("window").height]
    const colors = ["blue","purple","#c722fd","red","hotpink","pink","#00d2d2","#159572","darkgreen","rgba(131, 167, 234, 1)"]

    useFocusEffect(
      React.useCallback(() => {
        (async ()=>{
          setFetching(true);
          try{
            const cat =await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/categorias/de_gastos`,{
              method:'GET',
              headers:{"Content-Type":"application/json"}})

            const rsp=await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/gastos/agrupar_por_categoria_mensual/${context.id}/${mes.toISOString()}`,{
              method:'GET',
              headers:{"Content-Type":"application/json"}})
            if (!rsp.ok || !cat.ok){
              if (rsp.status==400) {
                setDatos([]);
                setTotal(0);
                setFetching(false)
              } else {
                throw new Error(rsp.status + ", en gastos por categoría")
              }
              
            }else {
              const info:Suma[] = await rsp.json();
              const info_categorias= await cat.json();
              const total= info.reduce((accumulator:number,currentValue)=>accumulator+currentValue._sum.monto,0);
              setTotal(total);
              const lista:Datos[] = info.map((each:Suma,index:number)=>{
                const nombre_cat=info_categorias.find((cat:Category) => cat.id==each.category_id)?.name;
                return {cant:each._sum.monto,name:nombre_cat,color:colors[index],legendFontColor:"#7F7F7F", legendFontSize: 18,porcentaje:Math.round(each._sum.monto/total*100)}
              })
              setDatos(lista);
              setFetching(false)
            }
 
          }
          catch(e){
            console.log(e);
          }
        })();
        
        const limpiar = navigation.addListener('blur', () => {
          resetear();
        });
        return limpiar
      }, [context.id,dateString])
    );
  const actualizar_fecha =()=>{
    setDateString(meses[mes.getMonth()]+" "+mes.getFullYear());
  }
  const resetear = ()=>{
    setMes(prev=>{
      prev.setTime((new Date()).getTime())
      return prev
    });
    actualizar_fecha();
  }
  const proximo_mes = ()=>{
    setMes(mes_siguiente(mes));
    actualizar_fecha();
  }
  const anterior_mes = ()=>{
    setMes(mes_anterior(mes));
    actualizar_fecha();
  }
   
  return (
    <View style={[estilos.flex1,estilos.centrado,{marginTop:19}]} >
      <View style={[colores.fondo_blanco,estilos.thinGrayBottomBorder,{padding:20,minWidth:"100%",flexDirection:"row",justifyContent:"space-between",elevation:5}]}>
        <Pressable style={{marginTop:40}} onPress={anterior_mes}>
        <MaterialIcons name="arrow-back-ios" size={24} color="#007AFF" /> 
        </Pressable>
        <Text style={[estilos.subtitulo,{marginTop:40}]}>{dateString}</Text>
        <Pressable style={{marginTop:40}} onPress={proximo_mes} >
        <MaterialIcons name="arrow-forward-ios" size={24} color={comparar_mes_year(mes,today()) ? "lightgray":"#007AFF"} />
        </Pressable>
      </View> 
      
     
      
      <View style={[{marginTop:25,marginBottom:50,minWidth:"90%",maxHeight:"88%"},estilos.curvedTopBorders,colores.fondo_blanco]}>
        <View style={[estilos.thinGrayBottomBorder,{padding:15}]}>
          <Text style={[{fontSize:18},colores.texto_azul]}>Gastos por categoría</Text>
        </View>
         {isFetching ? (  <LoadingCircle/>  ): ( <View style={[estilos.flex1]}>
          <Text style={[estilos.centrado,estilos.titulo,{marginTop:6}]}>$ {total_gastado}</Text>
          {datos.length==0  ? <Text style={estilos.centrado}>No hay gastos cargados en ese rango</Text>:
     <>
        <PieChart
          data={datos}
          width={dimensions[0]*0.8}
          height={dimensions[1]*0.37}
          chartConfig={chartConfig}
          accessor={"cant"}
          backgroundColor={"transparent"}
          paddingLeft={"1"}
          center={[78, -10]}
          style={{flex:1}}
          hasLegend={false}
        />
        <ScrollView style={[{flex:1,alignSelf:"center",marginTop:100}]}>
          {datos.map((value,index)=>{
            return (
              <View style={styles.legendItem} key={index}>
                  <FontAwesome name="circle" size={35} color={value.color} />
                  <View style={[estilos.flex1,{flexDirection:"row",marginLeft:10,justifyContent:"space-between",alignItems:"center"}]}>
                  <Text style={{fontSize:value.legendFontSize,color:value.legendFontColor}}>
                    {value.name}
                  </Text>
                  <Text style={[styles.legendItemValue,{fontSize:value.legendFontSize,color:value.legendFontColor}]}>
                    {value.porcentaje} % 
                  </Text>
                  </View>
               </View>
          
          )})}
        </ScrollView></>}
        </View>
         )
         
         }

        
      </View>
      
      
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
      marginVertical:8,
      marginLeft: 15,
      width: "85%",
      paddingBottom: 8,
      borderBottomColor: "lightgray",
      borderBottomWidth: 1,
      justifyContent: "space-between"
   },
   legendItemValue: {
      marginHorizontal: 10,
   },
});