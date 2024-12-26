import React, { useState } from "react";
import { Text, View, Pressable, Modal, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { useUserContext } from "@/context/UserContext";
import { renderGasto, renderIngreso, renderPresupuesto } from "@/components/renderList";
import { CategoryPicker, CategoryIngresoPicker, traer_categorias, traer_categorias_ingresos } from "@/components/CategoryPicker";
import { DateRangeModal, comparar_fechas, SelectorFechaSimpleModal } from "@/components/DateRangeModal";
import { router, useFocusEffect } from "expo-router";
import { Alternar,Filtro_aplicado } from "@/components/botones";
import { MaterialIcons } from "@expo/vector-icons";
import { estilos } from "@/components/global_styles";
import { useNavigation } from '@react-navigation/native';
import { Category, Gasto, Presupuesto, Ingreso } from "@/components/tipos";
import {LoadingCircle} from "@/components/loading"
import { today, semana_pasada, mes_pasado, year_start } from "@/components/dias";

export default function Historial() {
  const context = useUserContext();
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [seleccion, setSeleccion] = useState(0); //0 gastos, 1 ingresos, 2 presupuestos
  const [selectorSimpleVisible,setSelectorSimpleVisible]= useState(false);
  const [CateModalVisible, setCatModalVisible] = useState(false);
  const [fecha_desde, setFechaDesde] = useState(semana_pasada());
  const [fecha_hasta, setFechaHasta] = useState(today());
  const [cate_gasto_id, setCateId] = useState(0);
  const [cate_ingreso_id, setCateIngresoId] = useState(0);
  const [openPicker, setOpen] = useState(false);
  const [filtros_usados,setFiltrosUsados] = useState({fecha_desde:false,fecha_hasta:false,categoria_gasto:false,categoria_ingreso:false});
  const [todas_categorias,setCategorias] =useState<Category[]>([{id:0,name:"",description:""}])
  const [categorias_ingresos,setCategoriasIngresos] =useState<Category[]>([{id:0,name:"",description:""}])
  const [isFetching,setFetching] = useState(true);
  const navigation = useNavigation();
  
  traer_categorias(setCategorias);
  traer_categorias_ingresos(setCategoriasIngresos);
  const fechas_rango_simple = [semana_pasada(),mes_pasado(),year_start(),new Date(0),fecha_desde];
  useFocusEffect(
    React.useCallback(() => {
      const query = async (url: string, callback: Function) => {
        try {
          const rsp = await fetch(url, {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
          });
          if (!rsp.ok) {
            if (rsp.status != 400) throw new Error(rsp.status.toString() + ", en Historial");
            else {
              callback([])
              setFetching(false);
            }
          } else {
            const info = await rsp.json();
            callback(info);
            setFetching(false);
          }
        } catch (error) {
          console.log(error);
        }
      };
      
      const fechas = { fecha_desde: fecha_desde.toISOString(), fecha_hasta: fecha_hasta.toISOString() };
      setFetching(true);
      if (!comparar_fechas(fecha_desde,new Date(0))){
        setFiltrosUsados(prev=>{
          prev.fecha_desde=true;
          return prev
        })
      }
      if (!comparar_fechas(fecha_hasta,new Date())){
        setFiltrosUsados(prev=>{
          prev.fecha_hasta=true;
          return prev
        })
      }
      switch (seleccion) {
        case 0:
          
          if (cate_gasto_id==0) query(`${process.env.EXPO_PUBLIC_DATABASE_URL}/gastos/historial/${context.id}/${fechas.fecha_desde}/${fechas.fecha_hasta}`, setGastos);
          else query(`${process.env.EXPO_PUBLIC_DATABASE_URL}/gastos/filtrar/${context.id}/${cate_gasto_id}/${fechas.fecha_desde}/${fechas.fecha_hasta}`, setGastos);
          break;
        case 1:
          if (cate_ingreso_id==0) query(`${process.env.EXPO_PUBLIC_DATABASE_URL}/ingresos/historial/${context.id}/${fechas.fecha_desde}/${fechas.fecha_hasta}`, setIngresos);
          else query(`${process.env.EXPO_PUBLIC_DATABASE_URL}/ingresos/por_cate/${context.id}/${cate_ingreso_id}/${fechas.fecha_desde}/${fechas.fecha_hasta}`, setIngresos);
          break;
        case 2:
          query(`${process.env.EXPO_PUBLIC_DATABASE_URL}/presupuestos/user/${context.id}`, setPresupuestos);
          break;
      }
      
      const limpiar = navigation.addListener('blur', () => {
        limpiar_filtros();
      });

      return limpiar
    }, [context.id, seleccion, fecha_desde, fecha_hasta, cate_gasto_id,cate_ingreso_id,navigation])
  );

  const ver_ingreso = (ingreso: Ingreso) => {
    router.navigate({ pathname: "/tabs/historial/ver_ingreso", params: { ingreso_id: ingreso.id } });
  };

  const ver_gasto = (gasto: Gasto) => {
    router.navigate({ pathname: "/tabs/historial/ver_gasto", params: { gasto_id: gasto.id } });
  };

  const ver_presupuesto = (presupuesto: Presupuesto) => {
    router.navigate({ pathname: "/tabs/historial/ver_presupuesto", params: { presupuesto_id: presupuesto.id } });
  };
  

  const filtrar_por_cate = () => {
    setCatModalVisible(false);
    if (seleccion==0) {
      setFiltrosUsados(prev=>{
      prev.categoria_gasto=true;
      return prev
    })}
    else {
      setFiltrosUsados(prev=>{
        prev.categoria_ingreso=true;
        return prev
      })
    }
  };

  const cancelar = () => {
    setCateId(0);
    setCatModalVisible(false);
  };

  const limpiar_filtros = () => {
    setFechaDesde(new Date(0));
    setFechaHasta(today());
    setCateId(0);
    setCateIngresoId(0);
    setFiltrosUsados({fecha_desde:false,fecha_hasta:false,categoria_gasto:false,categoria_ingreso:false})
  };
  const hay_filtros=()=>{
    const usa_fechas =filtros_usados.fecha_desde || filtros_usados.fecha_hasta;
    if (seleccion==0){
      return usa_fechas || filtros_usados.categoria_gasto
    }
    return usa_fechas || filtros_usados.categoria_ingreso
  }

  const reset_fecha_desde = ()=>{
    setFechaDesde(new Date(0));
    setFiltrosUsados(prev=>{
      prev.fecha_desde=false;
      return prev
    })
  }

  const reset_fecha_hasta = ()=>{
    setFechaHasta(today());
    setFiltrosUsados(prev=>{
      prev.fecha_hasta=false;
      return prev
    })
  }
  const reset_cate_gasto = ()=>{
    setCateId(0);
    setFiltrosUsados(prev=>{
      prev.categoria_gasto=false;
      return prev
    })
  }

  const reset_cate_ingreso = ()=>{
    setCateIngresoId(0);
    setFiltrosUsados(prev=>{
      prev.categoria_ingreso=false;
      return prev
    })
  }
  return (
    <SafeAreaView style={styles.container}>
      <Alternar
        activo={seleccion==4 ? 0: seleccion}
        callback={setSeleccion}
        datos={[
          { texto: "Gastos", params_callback: 0, icon:{materialIconName:"attach-money"} },
          { texto: "Ingresos", params_callback: 1,icon:{materialIconName:"savings"} },
          { texto: "Presupuestos", params_callback: 2,icon:{materialIconName:"account-balance"} }
        ]}
      />
      <View style={styles.content}>
      
      {(seleccion!=2) && (
        <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Filtrar por:</Text>
        <View style={styles.filterButtonsContainer}>
          <Pressable onPress={() => setSelectorSimpleVisible(true)} style={styles.filterButton}>
            <MaterialIcons name="event" size={24} color="#FFFFFF" />
            <Text style={styles.filterButtonText}>Fecha</Text>
          </Pressable>
          <Pressable onPress={() => setCatModalVisible(true)} style={styles.filterButton}>
            <MaterialIcons name="category" size={24} color="#FFFFFF" />
            <Text style={styles.filterButtonText}>Categoría</Text>
          </Pressable>
          <Pressable onPress={hay_filtros() ? limpiar_filtros: ()=>{}} style={[styles.filterButton,{backgroundColor: hay_filtros() ? "#3F51B5":"lightgray"}]}>
            <MaterialIcons name="clear-all" size={24} color="#FFFFFF" />
            <Text style={styles.filterButtonText}>Limpiar</Text>
          </Pressable>
        </View>
        <View style={[styles.filterButtonsContainer,{flexWrap:"wrap"}]}>
          <Filtro_aplicado texto={"Desde: "+fecha_desde.toDateString()} callback={reset_fecha_desde} isVisible={filtros_usados.fecha_desde}/>
          <Filtro_aplicado texto={"Hasta: "+fecha_hasta.toDateString()} callback={reset_fecha_hasta} isVisible={filtros_usados.fecha_hasta}/>
          <Filtro_aplicado texto={"Categoría: "+ todas_categorias.find(value=>value.id==cate_gasto_id)?.name} callback={reset_cate_gasto} isVisible={filtros_usados.categoria_gasto && seleccion==0}/>
          <Filtro_aplicado texto={"Categoría: "+ categorias_ingresos.find(value=>value.id==cate_ingreso_id)?.name} callback={reset_cate_ingreso} isVisible={filtros_usados.categoria_ingreso && seleccion==1}/>
        </View>
      </View>
      )}
      {isFetching && (
        <LoadingCircle/>
        )}
      {(seleccion===0 || seleccion===4 ) && (
          <FlashList
            data={gastos}
            renderItem={({ item }: ListRenderItemInfo<Gasto>) => renderGasto(item, ver_gasto)}
            estimatedItemSize={100}
            ListEmptyComponent={<Text style={estilos.emptyListText}>No hay gastos registrados</Text>}
          />
      )}

      {seleccion === 1 && (
          <FlashList
            data={ingresos}
            renderItem={({ item }: ListRenderItemInfo<Ingreso>) => renderIngreso(item, ver_ingreso)}
            estimatedItemSize={100}
            ListEmptyComponent={<Text style={estilos.emptyListText}>No hay ingresos registrados</Text>}
          />
      )}

      {seleccion === 2 && (
          <FlashList
            data={presupuestos}
            renderItem={({ item }: ListRenderItemInfo<Presupuesto>) => renderPresupuesto(item, ver_presupuesto)}
            estimatedItemSize={100}
            ListEmptyComponent={<Text style={estilos.emptyListText}>No hay presupuestos registrados</Text>}
          />
      )}
      </View>

      <SelectorFechaSimpleModal visible={selectorSimpleVisible} setVisible={setSelectorSimpleVisible} fecha_desde={fecha_desde}
        fecha_hasta={fecha_hasta} setDesde={setFechaDesde} setHasta={setFechaHasta}
      />
     
      <Modal animationType="slide" transparent={true} visible={CateModalVisible} onRequestClose={cancelar}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={estilos.modalTitle}>Seleccionar Categoría</Text>
            {seleccion===0 && (
              <CategoryPicker
              openPicker={openPicker}
              setOpen={setOpen}
              selected_cat_id={cate_gasto_id}
              set_cat_id={setCateId}
              />
            )}
            {seleccion===1 && (
              <CategoryIngresoPicker
              openPicker={openPicker}
              setOpen={setOpen}
              selected_cat_id={cate_ingreso_id}
              set_cat_id={setCateIngresoId}
              />
            )}
           
            <Pressable style={estilos.confirmButton} onPress={filtrar_por_cate}>
              <Text style={estilos.confirmButtonText}>Confirmar</Text>
            </Pressable>
            <Pressable style={estilos.cancelButton} onPress={cancelar}>
              <Text style={estilos.cancelButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
 );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  filterContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 122, 255, 0.1)",
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#007AFF",
  },
  filterButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  filterButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  filterButtonText: {
    color: "#FFFFFF",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },
 
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#007AFF",
  },
  confirmButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
