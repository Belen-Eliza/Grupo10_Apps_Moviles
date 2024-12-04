import React, { useState } from "react";
import { Text, View, Pressable, Modal, StyleSheet, SafeAreaView } from "react-native";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { useUserContext } from "@/context/UserContext";
import { renderGasto, renderIngreso, renderPresupuesto } from "@/components/renderList";
import { CategoryPicker } from "@/components/CategoryPicker";
import { DateRangeModal } from "@/components/DateRangeModal";
import { router, useFocusEffect } from "expo-router";
import { Alternar } from "@/components/botones";
import { MaterialIcons } from "@expo/vector-icons";
import { estilos } from "@/components/global_styles";
import { useNavigation } from '@react-navigation/native';

type Category = { id: number; name: string; description: string }
type Gasto = { id: number; monto: number; cant_cuotas: number; fecha: Date; category: Category }
type Ingreso = { id: number; monto: number; description: string; category: Category; fecha: Date }
type Presupuesto = { id: number; descripcion: string; montoTotal: number; fecha_objetivo: Date }

const today = () => {
  let fecha = new Date();
  fecha.setHours(23, 59);
  return fecha;
};

export default function Historial() {
  const context = useUserContext();
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [seleccion, setSeleccion] = useState(0); //0 gastos, 1 ingresos, 2 presupuestos, 4 filtrar gastos por categoria
  const [DateModalVisible, setDateModalVisible] = useState(false);
  const [CateModalVisible, setCatModalVisible] = useState(false);
  const [fecha_desde, setFechaDesde] = useState(new Date(0));
  const [fecha_hasta, setFechaHasta] = useState(today());
  const [cate_id, setCateId] = useState(0);
  const [openPicker, setOpen] = useState(false);
  
  const navigation = useNavigation();

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
          } else {
            const info = await rsp.json();
            callback(info);
          }
        } catch (error) {
          console.log(error);
        }
      };

      const fechas = { fecha_desde: fecha_desde.toISOString(), fecha_hasta: fecha_hasta.toISOString() };
      switch (seleccion) {
        case 0:
          query(`${process.env.EXPO_PUBLIC_DATABASE_URL}/gastos/historial/${context.id}/${fechas.fecha_desde}/${fechas.fecha_hasta}`, setGastos);
          break;
        case 1:
          query(`${process.env.EXPO_PUBLIC_DATABASE_URL}/ingresos/${context.id}`, setIngresos);
          break;
        case 2:
          query(`${process.env.EXPO_PUBLIC_DATABASE_URL}/presupuestos/todos/${context.id}`, setPresupuestos);
          break;
        case 4:
          query(`${process.env.EXPO_PUBLIC_DATABASE_URL}/gastos/filtrar/${context.id}/${cate_id}/${fechas.fecha_desde}/${fechas.fecha_hasta}`, setGastos);
          break;
      }
      
      const limpiar = navigation.addListener('blur', () => {
        limpiar_filtros();
      });

      return limpiar
    }, [context.id, seleccion, fecha_desde, fecha_hasta, cate_id,navigation])
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
    setSeleccion(4);
  };

  const cancelar = () => {
    setCateId(0);
    setCatModalVisible(false);
  };

  const limpiar_filtros = () => {
    setFechaDesde(new Date(0));
    setFechaHasta(new Date());
    setCateId(0);
    setSeleccion(0);

  };

  return (
    <SafeAreaView style={styles.container}>
      <Alternar
        activo={seleccion==4 ? 0: seleccion}
        callback={setSeleccion}
        datos={[
          { texto: "Gastos", params_callback: 0 },
          { texto: "Ingresos", params_callback: 1 },
          { texto: "Presupuestos", params_callback: 2 }
        ]}
      />

      {(seleccion === 0 || seleccion === 4) && (
        <View style={styles.content}>
          <View style={styles.filterContainer}>
            <Text style={styles.filterTitle}>Filtrar por:</Text>
            <View style={styles.filterButtonsContainer}>
              <Pressable onPress={() => setDateModalVisible(true)} style={styles.filterButton}>
                <MaterialIcons name="event" size={24} color="#FFFFFF" />
                <Text style={styles.filterButtonText}>Fecha</Text>
              </Pressable>
              <Pressable onPress={() => setCatModalVisible(true)} style={styles.filterButton}>
                <MaterialIcons name="category" size={24} color="#FFFFFF" />
                <Text style={styles.filterButtonText}>Categoría</Text>
              </Pressable>
              <Pressable onPress={limpiar_filtros} style={styles.filterButton}>
                <MaterialIcons name="clear-all" size={24} color="#FFFFFF" />
                <Text style={styles.filterButtonText}>Limpiar</Text>
              </Pressable>
            </View>
          </View>
          <FlashList
            data={gastos}
            renderItem={({ item }: ListRenderItemInfo<Gasto>) => renderGasto(item, ver_gasto)}
            estimatedItemSize={100}
            ListEmptyComponent={<Text style={styles.emptyListText}>No hay gastos registrados</Text>}
          />
        </View>
      )}

      {seleccion === 1 && (
        <View style={styles.content}>
          <FlashList
            data={ingresos}
            renderItem={({ item }: ListRenderItemInfo<Ingreso>) => renderIngreso(item, ver_ingreso)}
            estimatedItemSize={100}
            ListEmptyComponent={<Text style={styles.emptyListText}>No hay ingresos registrados</Text>}
          />
        </View>
      )}

      {seleccion === 2 && (
        <View style={styles.content}>
          <FlashList
            data={presupuestos}
            renderItem={({ item }: ListRenderItemInfo<Presupuesto>) => renderPresupuesto(item, ver_presupuesto)}
            estimatedItemSize={100}
            ListEmptyComponent={<Text style={styles.emptyListText}>No hay presupuestos registrados</Text>}
          />
        </View>
      )}

      <DateRangeModal
        visible={DateModalVisible}
        setVisible={setDateModalVisible}
        fecha_desde={fecha_desde}
        fecha_hasta={fecha_hasta}
        setDesde={setFechaDesde}
        setHasta={setFechaHasta}
      />

      <Modal animationType="slide" transparent={true} visible={CateModalVisible} onRequestClose={cancelar}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Categoría</Text>
            <CategoryPicker
              openPicker={openPicker}
              setOpen={setOpen}
              selected_cat_id={cate_id}
              set_cat_id={setCateId}
            />
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
    backgroundColor: "#F5F7FA",
  },
  content: {
    flex: 1,
  },
  filterContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333333",
  },
  filterButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3F51B5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  filterButtonText: {
    color: "#FFFFFF",
    marginLeft: 8,
    fontSize: 14,
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333333",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: "#F44336",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

//Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.