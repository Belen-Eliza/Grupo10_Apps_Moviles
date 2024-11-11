import { useUserContext } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { Text, View, Dimensions, Pressable, Modal } from "react-native";
import { FlashList,ListRenderItemInfo } from "@shopify/flash-list";
import { estilos,colores } from "@/components/global_styles";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React from 'react';
import { renderGasto, renderIngreso,renderPresupuesto } from "@/components/renderList";

type Category ={id :number, name: string,description: string}
type Gasto ={ id: number, monto: number, cant_cuotas:number, fecha: Date, category: Category}
type Ingreso = {id:number,monto: number,description: string,category: Category}
type Presupuesto ={id: number, descripcion: string,montoTotal: number, fecha_objetivo: Date}

export default function Historial() {
  const context = useUserContext();
  const [gastos,setGastos]= useState<Gasto[]>([]);
  const [ingresos,setIngresos]= useState<Ingreso[]>([]);
  const [presupuestos,setPresupuestos]= useState<Presupuesto[]>([]);
  const [seleccion,setSeleccion]=useState(1) //1 gastos, 2 ingresos, 3 presupuestos
  const [DateModalVisible,setDateModalVisible] = useState(false);
  const [fecha_desde,setFechaDesde]=useState(new Date(0)); 
  const [fecha_hasta,setFechaHasta]= useState(new Date())
  
  useEffect( ()=> {
    const  query= async (url:string,callback:Function) => {
      try {
        const rsp = await fetch(url,{
          method:'GET',
          headers:{"Content-Type":"application/json"}})
        if (!rsp.ok ) {
          if (rsp.status!=400)  throw new Error(rsp.status.toString()+", en Historial")
        } else{
          const info = await rsp.json();
          callback(info);
        }
      
    } catch (error) {
      console.log(error)
    }
    }
    switch (seleccion) {
      case 1:
        (async ()=>{
          const fechas = {fecha_desde:fecha_desde.toISOString(),fecha_hasta:fecha_hasta.toISOString()}
          query(`${process.env.EXPO_PUBLIC_DATABASE_URL}/gastos/historial/${context.id}/${fechas.fecha_desde}/${fechas.fecha_hasta}`,setGastos)
        }) ();
        break;

      case 2:
        (async ()=>{
          query(`${process.env.EXPO_PUBLIC_DATABASE_URL}/ingresos/${context.id}`,setIngresos)
        }) ();
        break;

      case 3:
        (async ()=>{
          query(`${process.env.EXPO_PUBLIC_DATABASE_URL}/presupuestos/todos/${context.id}`,setPresupuestos)
        }) ();        
        break;
    }    
  }, [context.id,seleccion,fecha_desde,fecha_hasta]  )

  const ver_ingreso=(ingreso:Ingreso)=>{
    console.log(ingreso);
  }
  const ver_gasto=(gasto:Gasto)=>{
    console.log(gasto);
  }
  const ver_presupuesto=(presupuesto:Presupuesto)=>{
    console.log(presupuesto);
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
    <View style={{flexDirection:"row", alignContent:"center",flex: 2}}>
      <Pressable onPress={()=>setSeleccion(1)} style={[estilos.boton1,estilos.centrado]}><Text>Gastos</Text></Pressable>
      <Pressable onPress={()=>setSeleccion(2)} style={[estilos.boton1,estilos.centrado]}><Text>Ingresos</Text></Pressable>
      <Pressable onPress={()=>setSeleccion(3)} style={[estilos.boton1,estilos.centrado]}><Text>Presupuestos</Text></Pressable>
    </View>
    
    
    <View style={{flexDirection:"row", alignContent:"center",flex: 2,display: seleccion==1? "flex":"none",}}>
    <Text style={[estilos.subtitulo,]}>Filtrar por: </Text>
      <Pressable onPress={()=>setDateModalVisible(true)} style={[estilos.boton1,estilos.centrado,colores.botones]}><Text>Fecha</Text></Pressable>
      <Pressable onPress={()=>setSeleccion(2)} style={[estilos.boton1,estilos.centrado,colores.botones]}><Text>Categoria</Text></Pressable>
    </View>
    
    <View style={{ flexGrow: 1,alignItems:"center",minWidth:"100%",minHeight:"65%",flex:8, 
      display: seleccion==1? "flex":"none"
     }}>
        <FlashList 
          data={gastos} 
          renderItem={({ item }: ListRenderItemInfo<Gasto>) => renderGasto(item,ver_gasto)}
          estimatedItemSize={200} 
          ListEmptyComponent={<Text>Todavía no has cargado ningún gasto</Text>}
        /> 
    </View>
    <View style={{ flexGrow: 1,alignItems:"center",minWidth:"100%",minHeight:"70%",flex:9, 
      display: seleccion==2? "flex":"none"
     }}>
        <FlashList 
          data={ingresos} 
          renderItem={({ item }: ListRenderItemInfo<Ingreso>) => renderIngreso(item,ver_ingreso)}
          estimatedItemSize={400} 
          ListEmptyComponent={<Text>Todavía no has cargado ningún ingreso</Text>}
        /> 
    </View>
    <View style={{ flexGrow: 1,alignItems:"center",minWidth:"100%",minHeight:"70%",flex:9, 
      display: seleccion==3? "flex":"none"
     }}>
        <FlashList 
          data={presupuestos} 
          renderItem={({ item }: ListRenderItemInfo<Presupuesto>) => renderPresupuesto(item,ver_presupuesto)}
          estimatedItemSize={400} 
          ListEmptyComponent={<Text>Todavía no has cargado ningún presupuesto</Text>}
        /> 
    </View>

    <Modal animationType="slide" transparent={false} visible={DateModalVisible}>
        <View style={[estilos.mainView,estilos.centrado]}>
          <Text style={estilos.titulo}>Desde:</Text>
          <DateTimePicker style={estilos.margen} value={fecha_desde} onChange={onChangeDesde} mode="date" />
          <Text style={estilos.titulo}>Hasta:</Text>
          <DateTimePicker style={estilos.margen} onChange={onChangeHasta} value={fecha_hasta} mode="date" />
          <Pressable style={[estilos.tarjeta,estilos.centrado,colores.botones]} onPress={()=>setDateModalVisible(false)}><Text >Confirmar</Text></Pressable>
        </View>
        
        </Modal>
    </>
  );
}

