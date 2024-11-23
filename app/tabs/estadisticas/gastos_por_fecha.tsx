import { useUserContext } from "@/context/UserContext";
import { useState, } from "react";
import { Text, View, Pressable, Dimensions, ScrollView } from "react-native";
import { estilos, colores } from "@/components/global_styles";
import React from "react";
import { LineChart } from "react-native-chart-kit";
import { DateRangeModal } from '@/components/DateRangeModal';
import { useFocusEffect } from '@react-navigation/native';
import { Alternar } from "@/components/botones";

type DatosGasto = { fecha: Date; _sum: {monto: number} };
type DatosIngreso = { fecha: Date; _sum: {monto: number} };
const today =()=>{
  let fecha = new Date();
  fecha.setHours(23,59);
  return fecha
}

export default function Gastos_por_Fecha() {
    const context = useUserContext();

    const [datosGastos, setDatosGastos] = useState<DatosGasto[]>([]);
    const [datosIngresos, setDatosIngresos] = useState<DatosIngreso[]>([]);
    const [fechaDesde, setFechaDesde] = useState(new Date(0));
    const [fechaHasta, setFechaHasta] = useState(today());
    const [modalVisible, setModalVisible] = useState(false);
    const [chartType, setChartType] = useState(0); //0 gastos, 1 ingresos, 2 balance

    const meses = ["Ene","Feb","Mar","Abr","Mayo","Jun","Jul","Ago","Sept","Oct","Nov","Dic"];
    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                const fechas = { fecha_desde: fechaDesde.toISOString(), fecha_hasta: fechaHasta.toISOString() };
                try {
                    const rspGastos = await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/gastos/por_fecha/${context.id}/${fechas.fecha_desde}/${fechas.fecha_hasta}`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    });
                    if (rspGastos.ok) {
                        const gastosData = await rspGastos.json();
                        setDatosGastos(gastosData);
                    } else {
                        console.error("Error al obtener datos de gastos");
                    }
    
                    const rspIngresos = await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/ingresos/por_fecha/${context.id}/${fechas.fecha_desde}/${fechas.fecha_hasta}`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    });
                    if (rspIngresos.ok) {
                        const ingresosData = await rspIngresos.json();
                        setDatosIngresos(ingresosData);
                    } else {
                        console.error("Error al obtener datos de ingresos");
                    }
                } catch (e) {
                    console.log(e);
                    alert("No hay datos en ese rango");
    
                }
            };
    
            fetchData();
          return () => {
            false
          };
        }, [context.id, fechaDesde, fechaHasta])
      );

    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height * 0.5; 
    
    const dataGastos = {
        
        labels: datosGastos.map((g) => {
            let fecha =new Date(g.fecha);
            return fecha.getDate() + " " + meses [fecha.getMonth()] + " " + fecha.getFullYear()
        }),
        datasets: [
            {
                data: datosGastos.map((g) => g._sum.monto),
                color: (opacity = 1) => `rgba(255, 69, 0, ${opacity})`, // rojo para gastos
                strokeWidth: 4,
            },
        ],
        legend: ["Gastos"],
    };

    const dataIngresos = {
        labels: datosIngresos.map((i) => {
            let fecha =new Date(i.fecha);
            return fecha.getDate() + " " + meses [fecha.getMonth()] + " " + fecha.getFullYear()
        }),
        datasets: [
            {
                data: datosIngresos.map((i) => i._sum.monto),
                color: (opacity = 1) => `rgba(34, 139, 34, ${opacity})`, // verde para ingresos
                strokeWidth: 4,
            },
        ],
        legend: ["Ingresos"],
    };


    // Calcula el balance acumulado ordenando los ingresos y gastos por fecha
    const combinedData = [...datosIngresos.map(i => ({ ...i, tipo: 'ingreso' })), ...datosGastos.map(g => ({ ...g, tipo: 'gasto' }))]
        .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    let balance = 0;
    const dataBalance = {
        labels: combinedData.map(d => {
            let fecha = new Date(d.fecha);
            return fecha.getDate() + " " + meses [fecha.getMonth()] + " " + fecha.getFullYear()
        }),
        datasets: [
            {
                data: combinedData.map(d => {
                    balance += d.tipo === 'ingreso' ? d._sum.monto : -d._sum.monto;
                    return balance;
                }),
                color: (opacity = 1) => `rgba(70, 130, 180, ${opacity})`, // azul para balance
                strokeWidth: 4,
            },
        ],
        legend: ["Balance Acumulado"],
    };

    const chartConfig = {
      backgroundGradientFrom: "#004040",
      backgroundGradientFromOpacity: 4,
      backgroundGradientTo: "#005b5b",
      backgroundGradientToOpacity: 5,
      color: (opacity = 1) => `rgba(26, 255, 120, ${opacity})`,
      strokeWidth: 6,
      barPercentage: 0.8,
      useShadowColorFromDataset: false,
      // Configuración para evitar el solapamiento de las etiquetas en X
      propsForVerticalLabels: {
        rotation: -45
      }
    };

    const openDatePicker = () => setModalVisible(true);

    return (
        <>
            <ScrollView contentContainerStyle={estilos.mainView}>
    <Pressable style={[estilos.tarjeta, estilos.centrado]} onPress={openDatePicker}>
        <Text>Filtrar por fecha</Text>
    </Pressable>

    {/* Botones para alternar entre Gastos, Ingresos, y Balance */}
    
    <Alternar activo={chartType} callback= {setChartType} datos={[{texto:"Gastos",params_callback:0},{texto:"Ingresos",params_callback:1},{texto:"Balance",params_callback:2}]}></Alternar>
    
    {/* Mostrar el gráfico correspondiente */}
    {chartType === 0 && datosGastos.length === 0 ? (
        <Text>No hay gastos en el rango de fechas seleccionado.</Text>
    ) : chartType === 1 && datosIngresos.length === 0 ? (
        <Text>No hay ingresos en el rango de fechas seleccionado.</Text>
    ) : chartType === 2 && combinedData.length === 0 ? (
        <Text>No hay datos de ingresos o gastos en el rango de fechas seleccionado para calcular el balance.</Text>
    ) : (
        <LineChart
            data={chartType === 2 ? dataBalance : chartType === 1 ? dataIngresos : dataGastos}
            width={screenWidth } 
            height={screenHeight}
            chartConfig={chartConfig}
            bezier={true}
            yAxisLabel="$"
            fromZero={true}
        />
    )}
</ScrollView>

            <DateRangeModal visible={modalVisible} setVisible={setModalVisible} fecha_desde={fechaDesde} fecha_hasta={fechaHasta}
            setDesde={setFechaDesde} setHasta={setFechaHasta}            
            ></DateRangeModal>

        </>
    );
    
}
