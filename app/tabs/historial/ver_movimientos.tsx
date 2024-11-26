import { useUserContext } from "@/context/UserContext";
import { useState } from "react";
import { Text, View, Pressable, Modal } from "react-native";
import { FlashList,ListRenderItemInfo } from "@shopify/flash-list";
import { estilos,colores } from "@/components/global_styles";
import React from 'react';
import { renderGasto, renderIngreso,renderPresupuesto } from "@/components/renderList";
import { CategoryPicker } from "@/components/CategoryPicker";
import { DateRangeModal } from "@/components/DateRangeModal";
import { router, useFocusEffect } from "expo-router";
import { Alternar } from "@/components/botones";

type Category ={id :number, name: string,description: string}
type Gasto ={ id: number, monto: number, cant_cuotas:number, fecha: Date, category: Category}
type Ingreso = {id:number,monto: number,description: string,category: Category, fecha: Date}
type Presupuesto ={id: number, descripcion: string,montoTotal: number, fecha_objetivo: Date}
const today = ()=>{
  let fecha = new Date();
  fecha.setHours(23,59);
  return fecha
}

export default function Historial() {
  const context = useUserContext();
  const [gastos,setGastos]= useState<Gasto[]>([]);
  const [ingresos,setIngresos]= useState<Ingreso[]>([]);
  const [presupuestos,setPresupuestos]= useState<Presupuesto[]>([]);
  const [seleccion,setSeleccion]=useState(0) //0 gastos, 1 ingresos, 2 presupuestos, 4 filtrar gastos por categoria
  const [DateModalVisible,setDateModalVisible] = useState(false);
  const [CateModalVisible,setCatModalVisible] = useState(false);
  const [fecha_desde,setFechaDesde]=useState(new Date(0)); 
  const [fecha_hasta,setFechaHasta]= useState(today())
  const [cate_id,setCateId]=useState(0);
  const [openPicker,setOpen] = useState(false);
  

  useFocusEffect(
    React.useCallback(() => {
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
      const fechas = {fecha_desde:fecha_desde.toISOString(),fecha_hasta:fecha_hasta.toISOString()}
      switch (seleccion) {
        case 0:
          (async ()=>{
            query(`${process.env.EXPO_PUBLIC_DATABASE_URL}/gastos/historial/${context.id}/${fechas.fecha_desde}/${fechas.fecha_hasta}`,setGastos);
          }) ();
          break;
  
        case 1:
          (async ()=>{
            query(`${process.env.EXPO_PUBLIC_DATABASE_URL}/ingresos/${context.id}`,setIngresos);
          }) ();
          break;
  
        case 2:
          (async ()=>{
            query(`${process.env.EXPO_PUBLIC_DATABASE_URL}/presupuestos/todos/${context.id}`,setPresupuestos);
          }) ();        
          break;
        case 4:
          (async ()=>{
            query(`${process.env.EXPO_PUBLIC_DATABASE_URL}/gastos/filtrar/${context.id}/${cate_id}/${fechas.fecha_desde}/${fechas.fecha_hasta}`,setGastos)
          }) ();
          break;
      }    
  
      return () => {
       false;
      };
    }, [context.id,seleccion,fecha_desde,fecha_hasta])
  );

  const ver_ingreso=(ingreso:Ingreso)=>{
    router.navigate({pathname:"/tabs/historial/ver_ingreso",params:{ingreso_id:ingreso.id}})
  }
  const ver_gasto=(gasto:Gasto)=>{
    router.navigate({pathname:"/tabs/historial/ver_gasto",params:{gasto_id:gasto.id}})
  }

  const ver_presupuesto=(presupuesto:Presupuesto)=>{
    router.navigate({pathname:"/tabs/historial/ver_presupuesto",params:{presupuesto_id:presupuesto.id}})
  }

  const filtrar_por_cate = ()=>{
    setCatModalVisible(false);
    setSeleccion(4);
  }
  const cancelar = ()=>{
    setCateId(0);
    setCatModalVisible(false);
  }
  const limpiar_filtros = ()=>{
    setFechaDesde(new Date(0));
    setFechaHasta(new Date());
    setCateId(0);
    setSeleccion(0);
  }
  
  return (<>
   
    <Alternar activo={seleccion==4 ? 0: seleccion} callback={setSeleccion} datos={[{texto:"Gastos",params_callback:0},{texto:"Ingresos",params_callback:1},{texto:"Presupuestos",params_callback:2}]}></Alternar>
    
    <View style={{ flexGrow: 1,alignItems:"center",minWidth:"100%",minHeight:"70%",flex:8, 
      display: seleccion==0 || seleccion==4? "flex":"none"
     }}>
      <View style={{flexDirection:"row", alignContent:"center",minWidth:"100%",maxHeight:70}}>
        <Text style={[estilos.subtitulo,]}>Filtrar por: </Text>
        <Pressable onPress={()=>setDateModalVisible(true)} style={[estilos.boton1,estilos.centrado,colores.botones]}><Text>Fecha</Text></Pressable>
        <Pressable onPress={()=>setCatModalVisible(true)} style={[estilos.boton1,estilos.centrado,colores.botones]}><Text>Categoria</Text></Pressable>
        <Pressable onPress={limpiar_filtros} style={[estilos.boton1,estilos.centrado,colores.botones]}><Text>Limpiar filtros</Text></Pressable> 
        
      </View>
        <FlashList 
          data={gastos} 
          renderItem={({ item }: ListRenderItemInfo<Gasto>) => renderGasto(item,ver_gasto)}
          estimatedItemSize={400} 
          ListEmptyComponent={<Text>Todavía no has cargado ningún gasto</Text>}
        /> 
    </View>
    <View style={{ flexGrow: 1,alignItems:"center",minWidth:"100%",minHeight:"70%",flex:9, 
      display: seleccion==1? "flex":"none" ,}}>
        <FlashList 
          data={ingresos} 
          renderItem={({ item }: ListRenderItemInfo<Ingreso>) => renderIngreso(item,ver_ingreso)}
          estimatedItemSize={400} 
          
          ListEmptyComponent={<Text>Todavía no has cargado ningún ingreso</Text>}
        /> 
    </View>
    <View style={{ flexGrow: 1,alignItems:"center",minWidth:"100%",minHeight:"70%",flex:9, 
      display: seleccion==2? "flex":"none"
     }}>
        <FlashList 
          data={presupuestos} 
          renderItem={({ item }: ListRenderItemInfo<Presupuesto>) => renderPresupuesto(item,ver_presupuesto)}
          estimatedItemSize={400} 
          ListEmptyComponent={<Text>Todavía no has cargado ningún presupuesto</Text>}
        /> 
    </View>

    <DateRangeModal visible={DateModalVisible} setVisible={setDateModalVisible} fecha_desde={fecha_desde} fecha_hasta={fecha_hasta}
                    setDesde={setFechaDesde} setHasta={setFechaHasta}></DateRangeModal>

    <Modal animationType="slide" transparent={false} visible={CateModalVisible} onRequestClose={cancelar}>
      <View style={[estilos.mainView,estilos.centrado]}>
     
        <Text style={estilos.titulo}>Seleccionar Categoría</Text>
        <CategoryPicker openPicker={openPicker} setOpen={setOpen} selected_cat_id={cate_id} set_cat_id={setCateId}></CategoryPicker>
        
        <Pressable style={[estilos.confirmButton,{width:250}]} onPress={filtrar_por_cate}><Text style={estilos.confirmButtonText}>Confirmar</Text></Pressable>
        <Pressable style={[estilos.cancelButton,{width:250}]} onPress={cancelar}>
          <Text style={estilos.cancelButtonText}>Cancelar</Text>
        </Pressable>
      </View>
    </Modal>
    </>
  );
}

