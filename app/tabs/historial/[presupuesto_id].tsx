import { useEffect, useState } from "react";
import { Text, View, Pressable, Modal } from "react-native";
import { estilos,colores } from "@/components/global_styles";
import { Link,router,useFocusEffect,useLocalSearchParams } from "expo-router";
import { LoadingCircle } from "@/components/loading";
import { error_alert } from "@/components/my_alert";
import React from "react";
import Toast from "react-native-toast-message";
import { MaterialIcons } from "@expo/vector-icons";

type Presupuesto ={id: number, descripcion: string,montoTotal: number, fecha_objetivo: Date,total_acumulado:number}

export default function DetallePresupuesto(){
    const { presupuesto_id = 0} = useLocalSearchParams();
    if (presupuesto_id==0) {
        router.dismiss();
        router.replace({pathname:"/tabs",params:{msg:"Valor inválido",error:"yes"}});
    }
    const [presupuesto,setPresupuesto]=useState<Presupuesto>();
   
   /*  useFocusEffect(
         React.useCallback(() => {
            console.log(router.canDismiss())
         },[])
    ) */
    useEffect(()=>{
        (async ()=>{
            try {
                const rsp = await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/presupuestos/unico/${presupuesto_id}`,{
                    method:'GET',
                    headers:{"Content-Type":"application/json"}});
                if (!rsp.ok)  throw new Error(rsp.status+" en ver presupuesto")
                else {
                    const data= await rsp.json();
                    setPresupuesto(data);
                }
            } catch (error) {
                console.log(error);
                error_alert("Presupuesto no encontrado");
                setTimeout(()=>{router.back()},3000);                
            }
        })()
    }, [presupuesto_id])

    return (
        <View style={[estilos.mainView,estilos.centrado]}>
            {!router.canDismiss() && 
                <Pressable style={{position: "absolute", left: 10,top:-10,zIndex:999,elevation:5}} onPress={()=>{router.replace("/tabs/historial/")}}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="white" /> 
                </Pressable>}
            
            {presupuesto==undefined? <LoadingCircle/>:
                <>
                <Text style={estilos.subtitulo}>Presupuesto de: {presupuesto.descripcion}</Text>
                <Text style={estilos.subtitulo}>Acumulados: {presupuesto.total_acumulado+"/"+presupuesto.montoTotal}</Text>
                <Text style={estilos.subtitulo}>Fecha objetivo: {(new Date(presupuesto.fecha_objetivo)).toDateString()}</Text>
                </>
            }
            <Toast/>
        </View>
    )
}
