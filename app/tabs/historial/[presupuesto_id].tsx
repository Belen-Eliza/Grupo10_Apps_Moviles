import { useState } from "react";
import { Text, View, Dimensions, StyleSheet,ScrollView, TouchableOpacity } from "react-native";
import { estilos,colores } from "@/components/global_styles";
import { Link, router,useFocusEffect,useLocalSearchParams } from "expo-router";
import { LoadingCircle } from "@/components/loading";
import { error_alert } from "@/components/my_alert";
import React from "react";
import Toast from "react-native-toast-message";
import { MaterialIcons, Fontisto,Feather, FontAwesome6 } from "@expo/vector-icons";
import { ProgressChart } from "react-native-chart-kit";
import { Presupuesto } from "@/components/tipos";
import { useNavigation } from '@react-navigation/native';
import { today } from "@/components/dias";

function esta_activo(p:Presupuesto){
    return p.activo==1 && p.montoTotal!=p.total_acumulado
}

export default function DetallePresupuesto(){
    const { presupuesto_id = 0} = useLocalSearchParams();
    if (presupuesto_id==0) {
        router.dismiss();
        router.replace({pathname:"/tabs",params:{msg:"Valor inválido",error:"yes"}});
    }
    const [presupuesto,setPresupuesto]=useState<Presupuesto>({id:0,fecha_objetivo:today(),montoTotal:0,total_acumulado:0,activo:0,descripcion:""});
    const navigation = useNavigation();
   
    useFocusEffect(
        React.useCallback(() => {
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
          
          const limpiar = navigation.addListener('blur', () => {
            //?
          });
          return limpiar
        }, [presupuesto_id])
      );
    
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
    const porcentaje = presupuesto? presupuesto.total_acumulado/presupuesto.montoTotal : 0;
    const fecha_objetivo = presupuesto? (new Date(presupuesto.fecha_objetivo)) : new Date();
    const data = {
        labels: [""], // optional
        data: [porcentaje]
      };

    const reservar = ()=>{
        if (esta_activo(presupuesto)) router.push({pathname:"/tabs/historial/nuevo_ahorro_presupuesto",params:{presupuesto_id:presupuesto_id}})
    }
    return (
        
        <ScrollView contentContainerStyle={estilos.scrollViewContent}>
            
            {presupuesto==undefined? <LoadingCircle/>:
            <View style={estilos.mainView}>
                
                <View style={[estilos.modalForm,estilos.margen]}>
                    <View style={estilos.thinGrayBottomBorder}>
                    <View style={[{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}]}>
                        <View style={{flexDirection:"row"}}>
                            <MaterialIcons name="attach-money" size={40} color="#007AFF" />
                            <Text style={[styles.title,{flexWrap:"wrap",maxWidth:200}]}>{presupuesto.descripcion}</Text>
                        </View>
                        
                        <Link href={{pathname:"/tabs/historial/editar_presupuesto", params:{presupuesto_id:presupuesto.id}}}  asChild>
                        <TouchableOpacity  >
                            <Feather name="edit" size={24} color="#007AFF" />
                        </TouchableOpacity>
                        </Link>
                        
                    </View>
                    <View style={[styles.header]}>
                        <View style={{margin:10}}>
                            <Text style={styles.messageText}>Dinero acumulado</Text>
                            <Text style={styles.amount}>$ {presupuesto.total_acumulado}</Text>
                        </View>
                        
                        <Fontisto name="wallet" size={90} color="white" />
                    </View>
                    
                    <TouchableOpacity style={[estilos.actionButton,{backgroundColor: esta_activo(presupuesto)? "#007AFF": "lightgray"}]} onPress={reservar} activeOpacity={esta_activo(presupuesto)? 0.2 : 1}>
                        <MaterialIcons name="savings" size={24} color="#FFFFFF" />
                        <Text style={estilos.actionButtonText}>Reservar</Text>
                    </TouchableOpacity>

                   
                    </View>
                    <View style={{flexDirection:"row",marginTop:20}}>
                        <Text style={[styles.messageText,{color:"black",fontWeight:"bold"}]}>Meta: </Text>
                        <Text style={[styles.messageText,{color:"black"}]}>$ {presupuesto.montoTotal}</Text>
                    </View>
                    <View style={{flexDirection:"row",marginTop:20}}>
                        <Text style={[styles.messageText,{color:"black",fontWeight:"bold"}]}>Plazo: </Text>
                        <Text style={[styles.messageText,{color:"black"}]}>{fecha_objetivo.getDate()}/{fecha_objetivo.getMonth()+1}/{fecha_objetivo.getFullYear()}</Text>
                    </View>
                    {porcentaje==1? 
                    <View style={[{flexDirection:"row",alignItems:"center",marginTop:10}]}>
                        <FontAwesome6 name="check-circle" size={24} color="#1fe024" style={estilos.inputIcon} />
                        <Text style={[{color:"black",fontSize:18}]}>Completado</Text>
                    </View>   : (fecha_objetivo<today()?
                    <View style={[{flexDirection:"row",alignItems:"center",marginTop:10}]}>
                        <MaterialIcons name="assignment-late" size={24} color="red" style={estilos.inputIcon} />
                        <Text style={[{color:"black",fontSize:18}]}>Atrasado</Text>
                    </View>   : null)
                    }
                </View>
                
                <View style={[estilos.modalForm,estilos.poco_margen,estilos.centrado]}>
                    {presupuesto.activo==1? <><Text style={[styles.title,{alignSelf:"flex-start"}]}>Progreso:</Text>
                    <View >
                        <ProgressChart
                            data={data}
                            width={width}
                            height={220}
                            strokeWidth={16}
                            radius={85}
                            chartConfig={chartConfig}
                            hideLegend={true}
                        />
                        <Text style={[colores.texto_azul,estilos.subtitulo,{position:"absolute",left:width/2-20,top:90}]}>{((porcentaje*100).toFixed(2))} %</Text>
                    </View>
                    
                    </>: <Text>Presupuesto inactivo</Text>}
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
        alignSelf:"center"
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