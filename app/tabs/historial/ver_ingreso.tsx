import { useEffect, useState } from "react";
import { Text, View, Pressable, Modal } from "react-native";
import { estilos,colores } from "@/components/global_styles";
import { Link,router,useLocalSearchParams } from "expo-router";
import { Ingreso } from "@/components/tipos";
import React from "react";

export default function DetalleIngreso(){
    const {ingreso_id = 0} = useLocalSearchParams();
    if (ingreso_id==0) {
        alert("Valor inválido");
        router.dismiss();
        router.replace("/tabs");
    }

    const [ingreso,setIngreso]=useState<Ingreso>();
    
    useEffect(()=>{
        (async ()=>{
            try {
                const rsp = await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/ingresos/unico/${ingreso_id}`,{
                    method:'GET',
                    headers:{"Content-Type":"application/json"}});
                if (!rsp.ok) throw new Error
                else {
                    const data= await rsp.json();
                    setIngreso(data);
                }
            } catch (error) {
                console.log(error)
            }
        })()
    }, [ingreso_id])

    return (
        <View style={[estilos.mainView,estilos.centrado]}>
            {ingreso==undefined? <Text style={{alignSelf:"center"}}>Cargando</Text>:
                <>
                <Text style={estilos.subtitulo}>Monto: {ingreso.monto}</Text>
                <Text style={estilos.subtitulo}>Categoria: {ingreso.category.name+" - "+ingreso.category.description}</Text>
                <Text style={estilos.subtitulo}>Descripcion: {ingreso.description} </Text>
                </>
            }
        </View>
    )
}
