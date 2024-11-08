import { useUserContext } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { Text, View, StatusBar } from "react-native";
import { FlashList,ListRenderItemInfo } from "@shopify/flash-list";
import { estilos,colores } from "@/components/global_styles";
import React from 'react';
import { router } from "expo-router";

type Category ={id :number, name: string,description: string}
type Gasto ={ id: number, monto: number, cant_cuotas:number, fecha: Date, category: Category}

export default function Index() {
  const context = useUserContext();
  const [gastos,setGastos]= useState<Gasto[]>();
  
  useEffect( ()=> {
    (async ()=>{
      fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/gastos/${context.id}`,{
          method:'GET',
          headers:{"Content-Type":"application/json"}})
      .then(rsp =>rsp.json())
      .then(info =>setGastos(info))
      /* try {
        const rsp =await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/gastos/${context.id}`,{
          method:'GET',
          headers:{"Content-Type":"application/json"}});
        if (!rsp.ok) {
          if (rsp.status==400){ //si no hay gastos aun
            console.log(rsp.statusText)
            return rsp.statusText
          }
          throw new Error
        } else {
          let aux:Gasto[]= await rsp.json();
          setGastos(aux)
        }
      } catch (e){
        console.log(e);
        router.navigate("/");
      } */
    }) ();
  }, [context]  )
  
  
  const renderItem= ({ item }: ListRenderItemInfo<Gasto>) => {
    return (
      <View style={[estilos.tarjeta,estilos.margen]}>
        <Text style={estilos.subtitulo}>{item.category.name}</Text>
        <Text>{item.fecha.toString()}</Text>
        <Text>{item.monto}</Text>
      </View>)
  };
  console.log(gastos);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {gastos?
        <FlashList 
          data={gastos} 
          renderItem={renderItem}
          estimatedItemSize={200} //reparar
        ></FlashList> : <Text>Cargando</Text>}
    </View>
  );
}

