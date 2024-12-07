import { estilos,colores } from "@/components/global_styles";
import DateTimePicker, { DateTimePickerEvent, DateTimePickerAndroid, AndroidNativeProps } from '@react-native-community/datetimepicker';
import { Text, View, Pressable, Modal, Platform, StyleSheet } from "react-native";
import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

function DateRangeModal(props:{  visible:boolean,setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  fecha_desde: Date,setDesde:React.Dispatch<React.SetStateAction<Date>>,fecha_hasta: Date,
  setHasta:React.Dispatch<React.SetStateAction<Date>>}) {
    const [nuevo_desde,setNuevoDesde] = useState(props.fecha_desde);
    const [nuevo_hasta,setNuevoHasta] = useState(props.fecha_hasta);

    const onChangeDesde=(event:DateTimePickerEvent, selectedDate:Date|undefined) => {
        let currentDate = new Date(0);
        //console.log("desde:",selectedDate)
        if (selectedDate!=undefined) currentDate=selectedDate
        setNuevoDesde(currentDate);
      };
      const onChangeHasta=(event:DateTimePickerEvent, selectedDate:Date|undefined) => {
        let currentDate = new Date();
        //console.log("hasta:",selectedDate)
        if (selectedDate!=undefined) currentDate=selectedDate
        setNuevoHasta(currentDate);
      };
      const confirmar= ()=>{
        props.setDesde(nuevo_desde);
        props.setHasta(nuevo_hasta);
        props.setVisible(false);
      }
      const cancelar = ()=>{
        setNuevoDesde(props.fecha_desde);
        setNuevoHasta(props.fecha_hasta);
        props.setVisible(false);
      }
      if (Platform.OS === "android"){
        const showModeDesde = (currentMode: AndroidNativeProps['mode']) => {
          DateTimePickerAndroid.open({
            value: props.fecha_desde,
            onChange:onChangeDesde,
            mode: currentMode,
            is24Hour: false,
            maximumDate: new Date()
          });
        };
        const showModeHasta = (currentMode: AndroidNativeProps['mode']) => {
            DateTimePickerAndroid.open({
              value: props.fecha_hasta,
              onChange:onChangeHasta,
              mode: currentMode,
              is24Hour: false,
            });
          };
        const showDatepickerDesde = () => {
            showModeDesde("date");
        };
        const showDatepickerHasta = () => {
            showModeHasta("date");
          };
     
      
    return (
        <Modal animationType="slide" transparent={false} visible={props.visible} onRequestClose={cancelar}>
            <View style={[estilos.mainView,estilos.centrado]}>
                
                <Text style={estilos.titulo}>Desde:</Text>
                <View style={styles.androidDateTime}>
                    <Pressable onPress={showDatepickerDesde}>
                    <Text style={estilos.show_date}>
                        {nuevo_desde.toLocaleDateString([], {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        })}
                    </Text>
                    </Pressable>
                </View> 
                
                <Text style={estilos.titulo}>Hasta:</Text>
                <View style={styles.androidDateTime}>
                    <Pressable onPress={showDatepickerHasta}>
                        <Text style={estilos.show_date}>
                            {nuevo_hasta.toLocaleDateString([], {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            })}
                        </Text>
                    </Pressable>
                </View> 
                
                <Pressable style={[estilos.confirmButton,{width:250}]} onPress={confirmar}><Text style={estilos.confirmButtonText}>Confirmar</Text></Pressable>
                <Pressable style={[estilos.cancelButton,{width:250}]} onPress={cancelar}>
                  <Text style={estilos.cancelButtonText}>Cancelar</Text>
                </Pressable>
            </View>
        </Modal>
    )}
    else {
        return (
        <Modal animationType="slide" transparent={false} visible={props.visible}>
            <View style={[estilos.mainView,estilos.centrado]}>

                <Text style={estilos.titulo}>Desde:</Text>
                <DateTimePicker style={estilos.margen} value={props.fecha_desde} onChange={onChangeDesde} mode="date" />
                <Text style={estilos.titulo}>Hasta:</Text>
                <DateTimePicker style={estilos.margen} onChange={onChangeHasta} value={props.fecha_hasta} mode="date" maximumDate={new Date()}/>
                <Pressable style={[estilos.confirmButton,{width:250}]} onPress={confirmar}><Text style={estilos.confirmButtonText}>Confirmar</Text></Pressable>
                <Pressable style={[estilos.cancelButton,{width:250}]} onPress={cancelar}><Text style={estilos.cancelButtonText}>Cancelar</Text></Pressable>
            </View>
        </Modal>)
    }
}

const styles = StyleSheet.create({
    androidDateTime: {
      flexDirection: "row",
      justifyContent: "space-around",
    }
  });
function comparar_fechas(fecha1:Date, fecha2:Date){
  return fecha1.getDate()==fecha2.getDate() && fecha1.getFullYear()==fecha2.getFullYear() &&fecha1.getMonth()==fecha2.getMonth()
}

function SelectorFechaSimple(props:{open:boolean,setOpen:React.Dispatch<React.SetStateAction<boolean>>,selected_id: number,set_selection_id:React.Dispatch<React.SetStateAction<number>>,onChange:Function}) {
  const opciones = ["Últimos 7 días","Último mes","Este año","Todos","Avanzado"];
  return (
    <DropDownPicker style={[{maxWidth:"60%",elevation:2,zIndex:999,marginBottom:30},estilos.textInput,estilos.centrado]} open={props.open} 
          value={props.selected_id} items={opciones.map((each,index)=>{return {value:index,label:each}})} 
          itemKey="value" setOpen={props.setOpen} setValue={props.set_selection_id} onSelectItem={(v)=>props.onChange(v)} />
  )
}

export {DateRangeModal, comparar_fechas, SelectorFechaSimple}
