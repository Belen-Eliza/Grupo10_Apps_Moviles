import { useUserContext } from "@/context/UserContext";
import { useState, } from "react";
import { Text, View, Dimensions, Modal, ScrollView } from "react-native";
import { estilos, colores } from "@/components/global_styles";
import React from "react";
import { LineChart } from "react-native-chart-kit";
import { DateRangeModal, SelectorFechaSimple } from '@/components/DateRangeModal';
import { useFocusEffect } from '@react-navigation/native';
import { Alternar ,Filtro_aplicado} from "@/components/botones";
import { useNavigation } from '@react-navigation/native';
import { today,semana_pasada,principio_este_mes,mes_pasado,year_start, meses } from "@/components/dias";
import {LoadingCircle} from "@/components/loading"

type Datos = { fecha: Date; _sum: {monto: number} }; 

export default function Gastos_por_Fecha() {
    const context = useUserContext();

    const [datosGastos, setDatosGastos] = useState<Datos[]>([]);
    const [datosIngresos, setDatosIngresos] = useState<Datos[]>([]);
    const [fechaDesde, setFechaDesde] = useState(semana_pasada());
    const [fechaHasta, setFechaHasta] = useState(today());
    const [modalVisible, setModalVisible] = useState(false);
    const [simplePickerVisible,setVisible] = useState(false);
    const [rango_simple,setRangoSimple] = useState(0);
    const [usa_filtro_avanzado,setUsaFiltroAvanzado] = useState({desde:false,hasta:false})
    const [chartType, setChartType] = useState(0); //0 gastos, 1 ingresos, 2 balance
    const [isFetching,setFetching] = useState(true);

    const navigation = useNavigation();
    const fechas_rango_simple = [semana_pasada(),principio_este_mes(),mes_pasado,year_start(),new Date(0),fechaDesde];
    
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
                        setDatosGastos(agrupar_por_fecha(gastosData));
                    } else {
                        if (rspGastos.status==400) {
                            setDatosGastos([]);
                            setFetching(false);
                        }else console.error("Error al obtener datos de gastos");
                    }
    
                    const rspIngresos = await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/ingresos/por_fecha/${context.id}/${fechas.fecha_desde}/${fechas.fecha_hasta}`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    });
                    if (rspIngresos.ok) {
                        const ingresosData = await rspIngresos.json();
                        setDatosIngresos(agrupar_por_fecha(ingresosData));
                    } else {
                        if (rspIngresos.status==400){
                            setDatosIngresos([]);
                        }
                        else  console.error("Error al obtener datos de ingresos");
                    }
                } catch (e) {
                    console.log(e);
                }
            };
            setFetching(true);
            fetchData().then(()=>{setFetching(false)});
            const limpiar = navigation.addListener('blur', () => {
                setFechaDesde(new Date(0));
                setFechaHasta(today());
                setRangoSimple(3);
            });
        
              return limpiar
        }, [context.id, fechaDesde, fechaHasta,rango_simple,navigation])
      );

    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height *(usa_filtro_avanzado.desde && usa_filtro_avanzado.hasta ?  0.4 : usa_filtro_avanzado.desde || usa_filtro_avanzado.hasta ?  0.45 : 0.5); 
    
    const dataGastos = {
        
        labels: datosGastos.map((g) => {
            let fecha =new Date(g.fecha);
            return fecha.getDate() + " " + meses [fecha.getMonth()] + " " + fecha.getFullYear()
        }),
        datasets: [
            {
                data: datosGastos.map((g) => g._sum.monto),
                color: (opacity = 1) => "#c213fd", //`rgba(255, 69, 0, ${opacity})`, // rojo para gastos
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
                color: (opacity = 1) => "#00c400", //`rgba(34, 139, 34, ${opacity})`, // verde para ingresos
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
                color: (opacity = 1) => "#63c5fa", //`rgba(70, 130, 180, ${opacity})`, // azul para balance
                strokeWidth: 4,
            },
        ],
        legend: ["Balance Acumulado"],
    };

    const chartConfig = {
      backgroundGradientFrom: "#004993",
      backgroundGradientFromOpacity: 4,
      backgroundGradientTo: "#005b5b",
      backgroundGradientToOpacity: 5,
      color: (opacity = 1) => `rgba(26, 255, 120, ${opacity})`,
      strokeWidth: 6,
      barPercentage: 0.8,
      useShadowColorFromDataset: false,
      // Configuración para evitar el solapamiento de las etiquetas en X
    
      propsForLabels: {
        fontSize: 10, // Reduce font size
      },
      propsForVerticalLabels: {
        rotation: -45,
        fontSize: 10, // Reduce font size
        dx: -20, // Shift labels left
        dy: 10, // Shift labels down
      },
    };

    const onChangeRango=(selection:{label:string,value:number})=>{
        if (selection.value==5) {
            setModalVisible(true);
            setUsaFiltroAvanzado(prev=>{
                prev.desde=true;
                prev.hasta=true;
                return prev
            })
        } else {
            setFechaDesde(fechas_rango_simple[selection.value]);
            setFechaHasta(today());
            setUsaFiltroAvanzado(prev=>{
                prev.desde=false;
                prev.hasta=false;
                return prev
            })
        }
    }
    const reset_fecha_desde = ()=>{
        setFechaDesde(new Date(0));
        setUsaFiltroAvanzado(prev=>{
            prev.desde=false;
            return prev
        });
        if (!usa_filtro_avanzado.hasta)  setRangoSimple(3)
    }
    const reset_fecha_hasta = ()=>{
        setFechaHasta(new Date());
        setUsaFiltroAvanzado(prev=>{
            prev.hasta=false;
            return prev
        });
        if (!usa_filtro_avanzado.desde ) setRangoSimple(3)
    }

    return (
        <>
    <View style={[estilos.mainView]}>
        {/* Botones para alternar entre Gastos, Ingresos, y Balance */}
        <Alternar activo={chartType} callback= {setChartType} datos={[
            {texto:"Gastos",params_callback:0,icon:{materialIconName:"attach-money"}},
            {texto:"Ingresos",params_callback:1,icon:{materialIconName:"savings"}},
            {texto:"Balance",params_callback:2,icon:{materialIconName:"balance"}}]}></Alternar>
    
        <View style={[estilos.filterContainer,estilos.curvedTopBorders, {elevation:5,marginTop:50,paddingBottom:8}]}>
            <Text style={[estilos.filterTitle,{margin:0}]}>Filtrar por fecha:</Text>
            <View style={estilos.filterButtonsContainer}>
                <SelectorFechaSimple open={simplePickerVisible} setOpen={setVisible} selected_id={rango_simple} set_selection_id={setRangoSimple} onChange={onChangeRango}/>
            </View>
            <View style={[estilos.filterButtonsContainer,{flexWrap:"wrap",zIndex:-1}]}>
                <Filtro_aplicado texto={"Desde: "+fechaDesde.toDateString()} callback={reset_fecha_desde} isVisible={usa_filtro_avanzado.desde}/>
                <Filtro_aplicado texto={"Hasta: "+fechaHasta.toDateString()} callback={reset_fecha_hasta} isVisible={usa_filtro_avanzado.hasta}/>
            </View>
        </View>
    <View style={{zIndex:-1,flexGrow:2}}>
   
    
    {isFetching && ( <LoadingCircle/> )}

    {/* Mostrar el gráfico correspondiente */}
    {chartType === 0 && datosGastos.length === 0 ? (
        <View style={{minHeight:"70%"}}><Text style={estilos.emptyListText}>No hay gastos en el rango de fechas seleccionado.</Text></View>
        
    ) : chartType === 1 && datosIngresos.length === 0 ? (
        <View style={{minHeight:"70%"}}><Text style={estilos.emptyListText}>No hay ingresos en el rango de fechas seleccionado.</Text></View>
    ) : chartType === 2 && combinedData.length === 0 ? (
        <View style={{minHeight:"70%"}}><Text style={estilos.emptyListText}>No hay datos de ingresos o gastos en el rango de fechas seleccionado para calcular el balance.</Text></View>
    ) : (
        <View style={[{flexGrow:2},colores.fondo_azul]}>
        <LineChart
            data={chartType === 2 ? dataBalance : chartType === 1 ? dataIngresos : dataGastos}
            width={screenWidth } 
            height={screenHeight}
            chartConfig={chartConfig}
            bezier={true}
            yAxisLabel="$"
            fromZero={true}
        />
        </View>
    )}
    </View>
</View>

            <DateRangeModal visible={modalVisible} setVisible={setModalVisible} fecha_desde={fechaDesde} fecha_hasta={fechaHasta}
            setDesde={setFechaDesde} setHasta={setFechaHasta}            
            ></DateRangeModal>
            
        </>
    );
    
}


function agrupar_por_fecha(data : Datos[]){
    let agrupado : Datos[]=[];
    let index_actual =0;
    agrupado.push({fecha:data[0].fecha,_sum:{monto:0}})
    data.forEach((value)=>{
        const fecha_aux = new Date(agrupado[index_actual].fecha);
        const fecha_actual = new Date( value.fecha);
        if (fecha_actual.getDate()==fecha_aux.getDate() && fecha_actual.getMonth()==fecha_aux.getMonth() && fecha_actual.getFullYear()==fecha_aux.getFullYear()){
            agrupado[index_actual]._sum.monto += value._sum.monto
        } else {
            agrupado.push(value);
            index_actual +=1;
        }
    })

    return agrupado
}