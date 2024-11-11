import { useUserContext } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { Text, View, Pressable, Dimensions,Modal } from "react-native";
import { estilos,colores } from "@/components/global_styles";
import React from 'react';
import { LineChart } from "react-native-chart-kit";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type Category ={id :number, name: string,description: string}
type Gasto ={ id: number, monto: number, cant_cuotas:number, fecha: Date, category: Category}

export default function Gastos_por_Fecha (){
    const context = useUserContext();
    const [datos,setData] =useState<Gasto[]>([{id:0,monto:0,cant_cuotas:0,fecha: new Date(),category:{id:0,name:"",description:""}}]);
    const [fecha_desde,setFechaDesde]=useState(new Date(0)); //desde 1970 hasta hoy
    const [fecha_hasta,setFechaHasta]= useState(new Date())
    const [modalVisible,setModalVisible] = useState(false);

    useEffect(()=>{
      (async ()=>{
        const fechas = {fecha_desde:fecha_desde.toISOString(),fecha_hasta:fecha_hasta.toISOString()}
        //1972-02-01T00:00.0000Z -> formato ISO
        console.log(fechas)
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
    const openDatePicker = ()=>{
      setModalVisible(true);
    }
    const closeDatePicker= ()=>{
      setModalVisible(false)
    }
    const onChangeDesde=(event:DateTimePickerEvent, selectedDate:Date|undefined) => {
      let currentDate = new Date(0);
      if (selectedDate!=undefined) currentDate=selectedDate
      setFechaDesde(currentDate);
    };
    const onChangeHasta=(event:DateTimePickerEvent, selectedDate:Date|undefined) => {
      let currentDate = new Date();
      if (selectedDate!=undefined) currentDate=selectedDate
      setFechaHasta(currentDate);
    };
    return (<>
        <View style={estilos.mainView}>
          <Pressable style={[estilos.tarjeta,estilos.centrado]} onPress={openDatePicker}><Text >Filtrar por fecha</Text></Pressable>
          <LineChart
            data={data}
            width={Dimensions.get("window").width}
            height={Dimensions.get("window").height*0.7}
            chartConfig={chartConfig}
            bezier={true}
          />
        </View>
        <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View style={[estilos.mainView,estilos.centrado]}>
          <Text style={estilos.titulo}>Desde:</Text>
          <DateTimePicker style={estilos.margen} value={fecha_desde} onChange={onChangeDesde} mode="date" />
          <Text style={estilos.titulo}>Hasta:</Text>
          <DateTimePicker style={estilos.margen} onChange={onChangeHasta} value={fecha_hasta} mode="date" />
          <Pressable style={[estilos.tarjeta,estilos.centrado,colores.botones]} onPress={closeDatePicker}><Text >Confirmar</Text></Pressable>
        </View>
        
        </Modal>
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