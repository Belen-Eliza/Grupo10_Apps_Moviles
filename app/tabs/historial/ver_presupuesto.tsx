import { useEffect, useState } from "react";
import { Text, View, Pressable, Modal } from "react-native";
import { estilos,colores } from "@/components/global_styles";
import { Link,router,useLocalSearchParams } from "expo-router";
import React from "react";

type Presupuesto ={id: number, descripcion: string,montoTotal: number, fecha_objetivo: Date,total_acumulado:number,cant_cuotas:number}

export default function DetallePresupuesto(){
    const { presupuesto_id = 0} = useLocalSearchParams();
    if (presupuesto_id==0) {
        alert("Valor inválido");
        router.dismiss();
        router.replace("/tabs");
    }
    const [presupuesto,setPresupuesto]=useState<Presupuesto>();
   
    useEffect(()=>{
        (async ()=>{
            try {
                const rsp = await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/presupuestos/unico/${presupuesto_id}`,{
                    method:'GET',
                    headers:{"Content-Type":"application/json"}});
                if (!rsp.ok)  throw new Error
                else {
                    const data= await rsp.json();
                    setPresupuesto(data);
                }
            } catch (error) {
                console.log(error)
            }
        })()
    }, [presupuesto_id])

    return (
        <View style={[estilos.mainView,estilos.centrado]}>
            {presupuesto==undefined? <Text style={{alignSelf:"center"}}>Cargando</Text>:
                <>
                <Text style={estilos.subtitulo}>Presupuesto de: {presupuesto.descripcion}</Text>
                <Text style={estilos.subtitulo}>Acumulados: {presupuesto.total_acumulado+"/"+presupuesto.montoTotal}</Text>
                <Text style={estilos.subtitulo}>Cuotas totales: {presupuesto.cant_cuotas}</Text>
                <Text style={estilos.subtitulo}>Fecha objetivo: {(new Date(presupuesto.fecha_objetivo)).toDateString()}</Text>
                </>
            }
        </View>
    )
}
