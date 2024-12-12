import { useEffect, useState } from "react";
import { Text, View, Pressable, Modal } from "react-native";
import { estilos,colores } from "@/components/global_styles";
import { Link,router,useLocalSearchParams } from "expo-router";
import { Gasto } from "@/components/tipos";
import React from "react";

export default function DetalleGasto(){
    const { gasto_id = 0} = useLocalSearchParams();
    if (gasto_id==0) {
        router.dismiss();
        router.replace({pathname:"/tabs",params:{msg:"Valor inválido",error:"yes"}});
    }

    const [gasto,setGasto]=useState<Gasto>();
    
    useEffect(()=>{
        (async ()=>{
            try {
                const rsp = await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/gastos/unico/${gasto_id}`,{
                    method:'GET',
                    headers:{"Content-Type":"application/json"}});
                if (!rsp.ok) throw new Error
                else {
                    const data= await rsp.json();
                    setGasto(data);
                }
            } catch (error) {
                console.log(error)
            }
        })()
    }, [gasto_id])

    return (
        <View style={[estilos.mainView,estilos.centrado]}>
            {gasto==undefined? <Text style={{alignSelf:"center"}}>Cargando</Text>:
                <>
                <Text style={estilos.subtitulo}>Monto: {gasto.monto}</Text>
                <Text style={estilos.subtitulo}>Categoria: {gasto.category.name+" - "+gasto.category.description}</Text>
                <Text style={estilos.subtitulo}>Cuotas: {gasto.cant_cuotas} </Text>
                <Text style={estilos.subtitulo}>Fecha: {(new Date(gasto.fecha)).toDateString()}</Text>
                </>
            }
        </View>
    )
}
