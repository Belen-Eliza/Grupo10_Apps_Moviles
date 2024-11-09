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

export default function Historial() {
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
        
        break;
      case 2:
        (async ()=>{
          fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/ingresos/${context.id}`,{
              method:'GET',
              headers:{"Content-Type":"application/json"}})
          .then(rsp =>rsp.json())
          .then(info =>setIngresos(info))
        }) ();
        
        break;
      case 3:
        (async ()=>{
          fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/presupuestos/todos/${context.id}`,{
              method:'GET',
              headers:{"Content-Type":"application/json"}})
          .then(rsp =>rsp.json())
          .then(info =>setPresupuestos(info))
        }) ();        
        break;
      default:
        break;
    }    
  }, [context.id,seleccion]  )
  
  
  const renderGasto= ({ item }: ListRenderItemInfo<Gasto>) => {
    return (
      <View style={[estilos.list_element,estilos.margen,estilos.centrado]}>
        <Text style={{alignSelf:"flex-start",fontSize:10,color:"#909090"}}> {item.fecha.toString()}</Text>
        <Text style={estilos.subtitulo}> {item.category.name}</Text>
        <Text style={{fontSize:20,color:"#909090"}}> {item.category.description}</Text>
        <Text>Monto: ${item.monto}</Text>
      </View>)
  }; 
  const renderIngreso= ({ item }: ListRenderItemInfo<Ingreso>) => {
    return (
      <View style={[estilos.list_element,estilos.margen,estilos.centrado]}>
        <Text style={[estilos.subtitulo,{alignSelf:"flex-start"}]}>{item.category.name}</Text>
        <Text style={{fontSize:20,color:"#909090"}}>{item.description}</Text>
        <Text >Monto: ${item.monto}</Text>
      </View>)
  }; 
  const renderPresupuesto= ({ item }: ListRenderItemInfo<Presupuesto>) => {
    return (
      <View style={[estilos.list_element,estilos.margen,estilos.centrado]}>
        <Text style={estilos.subtitulo}>{item.descripcion}</Text>
        <Text> Para: {item.fecha_objetivo.toString()}</Text>
        <Text>Total: ${item.montoTotal}</Text>
      </View>)};
  
  return (<>
    <View style={{flexDirection:"row", alignContent:"center",flex: 2}}>
      <Pressable onPress={()=>setSeleccion(1)} style={[estilos.boton1,estilos.centrado]}><Text>Gastos</Text></Pressable>
      <Pressable onPress={()=>setSeleccion(2)} style={[estilos.boton1,estilos.centrado]}><Text>Ingresos</Text></Pressable>
      <Pressable onPress={()=>setSeleccion(3)} style={[estilos.boton1,estilos.centrado]}><Text>Presupuestos</Text></Pressable>
    </View>
    
    <View style={{ flexGrow: 1,alignItems:"center",minWidth:"100%",minHeight:"70%",flex:8, 
      display: seleccion==1? "flex":"none"
     }}>
        <FlashList 
          data={gastos} 
          renderItem={renderGasto}
          estimatedItemSize={200} 
          ListEmptyComponent={<Text>Todavía no has cargado ningún gasto</Text>}
        /> 
    </View>
    <View style={{ flexGrow: 1,alignItems:"center",minWidth:"100%",minHeight:"70%",flex:9, 
      display: seleccion==2? "flex":"none"
     }}>
        <FlashList 
          data={ingresos} 
          renderItem={renderIngreso}
          estimatedItemSize={400} 
          ListEmptyComponent={<Text>Todavía no has cargado ningún ingreso</Text>}
        /> 
    </View>
    <View style={{ flexGrow: 1,alignItems:"center",minWidth:"100%",minHeight:"70%",flex:9, 
      display: seleccion==3? "flex":"none"
     }}>
        <FlashList 
          data={presupuestos} 
          renderItem={renderPresupuesto}
          estimatedItemSize={400} 
          ListEmptyComponent={<Text>Todavía no has cargado ningún presupuesto</Text>}
        /> 
    </View>
    </>
  );
}

