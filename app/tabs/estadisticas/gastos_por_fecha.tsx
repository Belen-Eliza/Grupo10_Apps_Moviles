import { useUserContext } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { Text, View, Pressable, Dimensions, Modal, ScrollView } from "react-native";
import { estilos, colores } from "@/components/global_styles";
import React from "react";
import { LineChart } from "react-native-chart-kit";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

type Category = { id: number; name: string; description: string };
type Gasto = { id: number; monto: number; cant_cuotas: number; fecha: Date; category: Category };
type Ingreso = { id: number; monto: number; fecha: Date; category: Category };

export default function Gastos_por_Fecha() {
    const context = useUserContext();
    const [datosGastos, setDatosGastos] = useState<Gasto[]>([]);
    const [datosIngresos, setDatosIngresos] = useState<Ingreso[]>([]);
    const [fechaDesde, setFechaDesde] = useState(new Date(0));
    const [fechaHasta, setFechaHasta] = useState(new Date());
    const [modalVisible, setModalVisible] = useState(false);
    const [chartType, setChartType] = useState<"Gastos" | "Ingresos" | "Balance">("Gastos");

    useEffect(() => {
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
    }, [context.id, fechaDesde, fechaHasta]);

    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height * 0.5; 

    const dataGastos = {
        labels: datosGastos.map((g) => new Date(g.fecha).toDateString()),
        datasets: [
            {
                data: datosGastos.map((g) => g.monto),
                color: (opacity = 1) => `rgba(255, 69, 0, ${opacity})`, // rojo para gastos
                strokeWidth: 4,
            },
        ],
        legend: ["Gastos"],
    };

    const dataIngresos = {
        labels: datosIngresos.map((i) => new Date(i.fecha).toDateString()),
        datasets: [
            {
                data: datosIngresos.map((i) => i.monto),
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
        labels: combinedData.map(d => new Date(d.fecha).toDateString()),
        datasets: [
            {
                data: combinedData.map(d => {
                    balance += d.tipo === 'ingreso' ? d.monto : -d.monto;
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
    const closeDatePicker = () => setModalVisible(false);

    const onChangeDesde = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        setFechaDesde(selectedDate || new Date(0));
    };
    const onChangeHasta = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        setFechaHasta(selectedDate || new Date());
    };

    return (
        <>
            <ScrollView contentContainerStyle={estilos.mainView}>
                <Pressable style={[estilos.tarjeta, estilos.centrado]} onPress={openDatePicker}>
                    <Text>Filtrar por fecha</Text>
                </Pressable>
                <Pressable
                    style={[estilos.tarjeta, estilos.centrado, { marginVertical: 10 }]}
                    onPress={() => setChartType((prevType) => 
                        prevType === "Gastos" ? "Ingresos" : prevType === "Ingresos" ? "Balance" : "Gastos")}
                >
                    <Text>
                        {chartType === "Gastos" ? "Mostrar Ingresos" : chartType === "Ingresos" ? "Mostrar Balance" : "Mostrar Gastos"}
                    </Text>
                </Pressable>
                {chartType === "Balance" ? (
                    <LineChart
                        data={dataBalance}
                        width={screenWidth - 20} 
                        height={screenHeight}
                        chartConfig={chartConfig}
                        bezier={true}
                    />
                ) : chartType === "Ingresos" ? (
                    <LineChart
                        data={dataIngresos}
                        width={screenWidth - 20} 
                        height={screenHeight}
                        chartConfig={chartConfig}
                        bezier={true}
                    />
                ) : (
                    <LineChart
                        data={dataGastos}
                        width={screenWidth - 20} 
                        height={screenHeight}
                        chartConfig={chartConfig}
                        bezier={true}
                    />
                )}
            </ScrollView>
            <Modal animationType="slide" transparent={false} visible={modalVisible}>
                <View style={[estilos.mainView, estilos.centrado]}>
                    <Text style={estilos.titulo}>Desde:</Text>
                    <DateTimePicker style={estilos.margen} value={fechaDesde} onChange={onChangeDesde} mode="date" />
                    <Text style={estilos.titulo}>Hasta:</Text>
                    <DateTimePicker style={estilos.margen} onChange={onChangeHasta} value={fechaHasta} mode="date" />
                    <Pressable style={[estilos.tarjeta, estilos.centrado, colores.botones]} onPress={closeDatePicker}>
                        <Text>Confirmar</Text>
                    </Pressable>
                </View>
            </Modal>
        </>
    );
}
