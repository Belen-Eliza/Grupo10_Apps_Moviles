import { useUserContext } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { Text, View, Pressable, Dimensions,Modal } from "react-native";
import { estilos,colores } from "@/components/global_styles";
import React from 'react';
import { LineChart } from "react-native-chart-kit";
import { Gasto } from "@/components/tipos";
import { DateRangeModal } from "@/components/DateRangeModal";

export default function Gastos_por_Fecha (){
    const context = useUserContext();
    const [datos,setData] =useState<Gasto[]>([{id:0,monto:0,cant_cuotas:0,fecha: new Date(),category:{id:0,name:"",description:""}}]);
    const [fecha_desde,setFechaDesde]=useState(new Date(0)); //desde 1970 hasta hoy
    const [fecha_hasta,setFechaHasta]= useState(new Date())
    const [modalVisible,setModalVisible] = useState(false);

    useEffect(()=>{
      (async ()=>{
        const fechas = {fecha_desde:fecha_desde.toISOString(),fecha_hasta:fecha_hasta.toISOString()}
        
          try{
            const rsp=await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/gastos/por_fecha/${context.id}/${fechas.fecha_desde}/${fechas.fecha_hasta}`,{
              method:'GET',
              headers:{"Content-Type":"application/json"}})
            if (!rsp.ok){
              throw new Error()
            }else {
              const info = await rsp.json();
              setData(info)
            }

          }
          catch(e){
            console.log(e)
            alert("No hay gastos en ese rango")
          }
          
      })();
    },[context.id,fecha_desde,fecha_hasta])

    const data = {
      labels: datos.map(g=>new Date(g.fecha).toDateString()),
      datasets: [
        {
          data: datos.map(g=>g.monto),
          color: (opacity = 1) => `rgba(163, 230, 219, ${opacity})`, // optional
          strokeWidth: 6 // optional
        }
      ],
      legend: ["Gastos"] 
    };
    
   
    return (<>
        <View style={estilos.mainView}>
          <Pressable style={[estilos.tarjeta,estilos.centrado]} onPress={()=>setModalVisible(true)}><Text >Filtrar por fecha</Text></Pressable>
          <LineChart
            data={data}
            width={Dimensions.get("window").width}
            height={Dimensions.get("window").height*0.7}
            chartConfig={chartConfig}
            bezier={true}
          />
        </View>
        
        <DateRangeModal visible={modalVisible} setVisible={setModalVisible} fecha_desde={fecha_desde} fecha_hasta={fecha_hasta}
                        setDesde={setFechaDesde} setHasta={setFechaHasta}></DateRangeModal>
        </>
    )
}

const chartConfig = {
    backgroundGradientFrom: "#004040",
    backgroundGradientFromOpacity: 4,
    backgroundGradientTo: "#005b5b",
    backgroundGradientToOpacity: 5,
    color: (opacity = 1) => `rgba(26, 255, 120, ${opacity})`,
    strokeWidth: 6, // optional, default 3
    barPercentage: 0.8,
    useShadowColorFromDataset: false // optional
  };