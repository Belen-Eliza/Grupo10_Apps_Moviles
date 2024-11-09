import { useUserContext } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { Text, View, Dimensions, Pressable } from "react-native";
import { FlashList,ListRenderItemInfo } from "@shopify/flash-list";
import { estilos,colores } from "@/components/global_styles";
import React from 'react';
import { router } from "expo-router";

type Category ={id :number, name: string,description: string}
type Gasto ={ id: number, monto: number, cant_cuotas:number, fecha: Date, category: Category}
type Ingreso = {id:number,monto: number,description: string,category: Category}
type Presupuesto ={id: number, descripcion: string,montoTotal: number, fecha_objetivo: Date}

export default function Index() {
  const context = useUserContext();
  const [gastos,setGastos]= useState<Gasto[]>();
  const [ingresos,setIngresos]= useState<Ingreso[]>();
  const [presupuestos,setPresupuestos]= useState<Presupuesto[]>();
  const [seleccion,setSeleccion]=useState(1) //1 gastos, 2 ingresos, 3 presupuestos
  
  useEffect( ()=> {
    switch (seleccion) {
      case 1:
        (async ()=>{
          fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/gastos/${context.id}`,{
              method:'GET',
              headers:{"Content-Type":"application/json"}})
          .then(rsp =>rsp.json())
          .then(info =>setGastos(info))
        }) ();
        console.log(gastos);
        break;
      case 2:
        (async ()=>{
          fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/ingresos/${context.id}`,{
              method:'GET',
              headers:{"Content-Type":"application/json"}})
          .then(rsp =>rsp.json())
          .then(info =>setIngresos(info))
        }) ();
        console.log(ingresos);
        break;
      case 3:
        (async ()=>{
          fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/presupuestos/todos/${context.id}`,{
              method:'GET',
              headers:{"Content-Type":"application/json"}})
          .then(rsp =>rsp.json())
          .then(info =>setPresupuestos(info))
        }) ();
        console.log(presupuestos);
        break;
      default:
        break;
    }    
  }, [context.id,seleccion]  )
  
  
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
    
    <View style={{ flexGrow: 1,alignItems:"center",minWidth:"100%",minHeight:"100%" }}>
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

