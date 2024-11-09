import { useUserContext } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { Text, View, StatusBar, Dimensions, Pressable } from "react-native";
import { FlashList,ListRenderItemInfo } from "@shopify/flash-list";
import { estilos,colores } from "@/components/global_styles";
import React from 'react';
import { router } from "expo-router";

type Category ={id :number, name: string,description: string}
type Gasto ={ id: number, monto: number, cant_cuotas:number, fecha: Date, category: Category}

export default function Index() {
  const context = useUserContext();
  const [gastos,setGastos]= useState<Gasto[]>();
  const [seleccion,setSeleccion]=useState(1) //1 gastos, 2 ingresos, 3 presupuestos
  
  useEffect( ()=> {
    (async ()=>{
      fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/gastos/${context.id}`,{
          method:'GET',
          headers:{"Content-Type":"application/json"}})
      .then(rsp =>rsp.json())
      .then(info =>setGastos(info))
    }) ();
  }, [context]  )
  
  
    const renderItem= ({ item }: ListRenderItemInfo<Gasto>) => {
    return (
      <View style={[estilos.tarjeta,estilos.margen]}>
        <Text style={estilos.subtitulo}>{item.category.name}</Text>
        <Text>{item.fecha.toString()}</Text>
        <Text>{item.monto}</Text>
        <Text>Algo </Text>
      </View>)
  }; 
  
  return (<>
    <View style={{flexDirection:"row", alignContent:"center"}}>
      <Pressable onPress={()=>setSeleccion(1)} style={[estilos.boton1,estilos.centrado]}><Text>Gastos</Text></Pressable>
      <Pressable onPress={()=>setSeleccion(2)} style={[estilos.boton1,estilos.centrado]}><Text>Ingresos</Text></Pressable>
      <Pressable onPress={()=>setSeleccion(3)} style={[estilos.boton1,estilos.centrado]}><Text>Presupuestos</Text></Pressable>
    </View>
    <View
      style={{
        flexGrow: 1,alignItems:"center",minWidth:"100%",minHeight:"100%"
      }}
    >
        <FlashList 
          data={gastos} 
          renderItem={renderItem}
          estimatedItemSize={400} //reparar (39.0,400.0) 312.0*100.0
          
          ListEmptyComponent={<Text>Cargando</Text>}
          
        /> 
    </View>
    </>
  );
}

