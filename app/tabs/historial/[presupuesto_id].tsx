import { useEffect, useState } from "react";
import { Text, View, Pressable, Modal,Dimensions, StyleSheet,ScrollView } from "react-native";
import { estilos,colores } from "@/components/global_styles";
import { router,useFocusEffect,useLocalSearchParams } from "expo-router";
import { LoadingCircle } from "@/components/loading";
import { error_alert } from "@/components/my_alert";
import React from "react";
import Toast from "react-native-toast-message";
import { MaterialIcons } from "@expo/vector-icons";
import { ProgressChart } from "react-native-chart-kit";
import { ActionButton } from "@/components/tipos";
import { DateRangeModal } from "@/components/DateRangeModal";
import Fontisto from '@expo/vector-icons/Fontisto';

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
        <ScrollView contentContainerStyle={estilos.centrado}>
            
            {presupuesto==undefined? <LoadingCircle/>:
            <View style={estilos.mainView}>
                
                <View style={[estilos.modalForm,estilos.margen]}>
                    <View style={estilos.thinGrayBottomBorder}>
                    <View style={[{flexDirection:"row",alignItems:"center"}]}>
                        <MaterialIcons name="attach-money" size={40} color="#007AFF" />
                        <Text style={styles.title}>{presupuesto.descripcion}</Text>
                    </View>
                    <View style={[styles.header]}>
                        <View style={{margin:10}}>
                            <Text style={styles.messageText}>Dinero acumulado</Text>
                            <Text style={styles.amount}>$ {presupuesto.total_acumulado}</Text>
                        </View>
                        
                        <Fontisto name="wallet" size={90} color="white" />
                    </View>
                    
                    <ActionButton
                        icon="savings"
                        label="Reservar"
                        href="/tabs/nuevo/gasto"
                    />
                   
                
                    </View>
                    <View style={{flexDirection:"row",marginTop:20}}>
                        <Text style={[styles.messageText,{color:"black",fontWeight:"bold"}]}>Meta: </Text>
                        <Text style={[styles.messageText,{color:"black"}]}>$ {presupuesto.montoTotal}</Text>
                    </View>
                    <View style={{flexDirection:"row",marginTop:20}}>
                        <Text style={[styles.messageText,{color:"black",fontWeight:"bold"}]}>Plazo: </Text>
                        <Text style={[styles.messageText,{color:"black"}]}>{fecha_objetivo.getDate()}/{fecha_objetivo.getMonth()+1}/ {fecha_objetivo.getFullYear()}</Text>
                    </View>
                    
                </View>
                
                <View>
                    <ProgressChart
                        data={data}
                        width={width}
                        height={220}
                        strokeWidth={16}
                        radius={85}
                        chartConfig={chartConfig}
                        hideLegend={true}
                    />
                    <Text style={[colores.texto_azul,estilos.subtitulo,{position:"absolute",left:width/2-20,top:90}]}>{(porcentaje.toFixed(2))} %</Text>
                </View>
                
            </View>
            }
            
            <Toast/>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection:"row",
        marginTop: 40,
        marginBottom: 30,
        backgroundColor: "#007AFF",
        padding: 20,
        borderRadius: 5
      },
      title:{
        color: "black",
        fontWeight: "semibold",
        fontSize: 25,
        marginLeft:10
      },
      messageText: {
        fontSize: 20,
        color: 'white',
        marginBottom: 10,
      },
     
      amount: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
      },
})