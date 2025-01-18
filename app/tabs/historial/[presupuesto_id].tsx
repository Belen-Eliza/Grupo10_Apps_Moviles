import { useEffect, useState } from "react";
import { Text, View, Pressable, Modal,Dimensions, StyleSheet } from "react-native";
import { estilos,colores } from "@/components/global_styles";
import { router,useFocusEffect,useLocalSearchParams } from "expo-router";
import { LoadingCircle } from "@/components/loading";
import { error_alert } from "@/components/my_alert";
import React from "react";
import Toast from "react-native-toast-message";
import { MaterialIcons } from "@expo/vector-icons";
import { ProgressChart } from "react-native-chart-kit";
import { ActionButton } from "@/components/tipos";

type Presupuesto ={id: number, descripcion: string,montoTotal: number, fecha_objetivo: Date,total_acumulado:number}

export default function DetallePresupuesto(){
    const { presupuesto_id = 0} = useLocalSearchParams();
    if (presupuesto_id==0) {
        router.dismiss();
        router.replace({pathname:"/tabs",params:{msg:"Valor inválido",error:"yes"}});
    }
    const [presupuesto,setPresupuesto]=useState<Presupuesto>();
   
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
    const width = Dimensions.get("window").width;
    const chartConfig = {
        backgroundGradientFrom: `#ffffff`,
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#ffffff",
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(16, 55, 236, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };
    const porcentaje = presupuesto? presupuesto.total_acumulado/presupuesto.montoTotal*100 : 0;
    const fecha_objetivo = presupuesto? (new Date(presupuesto.fecha_objetivo)) : new Date();
    const data = {
        labels: [""], // optional
        data: [porcentaje/10]
      };
    return (
        <View style={[estilos.mainView,estilos.centrado]}>
            {!router.canDismiss() && 
                <Pressable style={{position: "absolute", left: 10,top:-10,zIndex:999,elevation:5}} onPress={()=>{router.replace("/tabs/historial/")}}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="white" /> 
                </Pressable>}
            
            {presupuesto==undefined? <LoadingCircle/>:
                <View style={estilos.mainView}>
                <View style={[estilos.header]}>
                    <Text style={estilos.headerTitle}>{presupuesto.descripcion}</Text>
                </View>
                <View style={styles.header}>
                          <Text style={styles.messageText}>Tienes acumulados</Text>
                          <Text style={styles.amount}>$ {presupuesto.total_acumulado}</Text>
                          <Text style={styles.messageText}>de</Text>
                          <Text style={styles.amount}>$ {presupuesto.montoTotal}</Text>
                </View>
                
                <Text style={estilos.subtitulo}>Vence el: {fecha_objetivo.getDate()}/{fecha_objetivo.getMonth()+1}/ {fecha_objetivo.getFullYear()}  </Text>
                <View>
                    <ProgressChart
                        data={data}
                        width={width}
                        height={220}
                        strokeWidth={16}
                        radius={90}
                        chartConfig={chartConfig}
                        hideLegend={true}
                    />
                    <Text style={[colores.texto_azul,estilos.subtitulo,{position:"absolute",left:width/2-15,top:90}]}>{(porcentaje.toFixed(2))} %</Text>
                </View>
                <View style={[{width:"80%",alignSelf:"center"},estilos.margen]}>
                    <ActionButton
                        icon="savings"
                        label="Agregar Ahorro"
                        href="/tabs/nuevo/gasto"
                    />
                </View>
            </View>
            }
            
            <Toast/>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        marginTop: 40,
        marginBottom: 20,
        alignItems: 'center',
      },
      messageText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 10,
      },
     
      amount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#007AFF',
      },
})