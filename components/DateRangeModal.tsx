import { estilos,colores } from "@/components/global_styles";
import DateTimePicker, { DateTimePickerEvent, DateTimePickerAndroid, AndroidNativeProps } from '@react-native-community/datetimepicker';
import { Text, View, Pressable, Modal, Platform, StyleSheet } from "react-native";
import { useState } from "react";

function DateRangeModal(props:{  visible:boolean,setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  fecha_desde: Date,setDesde:React.Dispatch<React.SetStateAction<Date>>,fecha_hasta: Date,
  setHasta:React.Dispatch<React.SetStateAction<Date>>}) {
    const [nuevo_desde,setNuevoDesde] = useState(props.fecha_desde);
    const [nuevo_hasta,setNuevoHasta] = useState(props.fecha_hasta);

    const onChangeDesde=(event:DateTimePickerEvent, selectedDate:Date|undefined) => {
        let currentDate = new Date(0);
        if (selectedDate!=undefined) currentDate=selectedDate
        setNuevoDesde(currentDate);
      };
      const onChangeHasta=(event:DateTimePickerEvent, selectedDate:Date|undefined) => {
        let currentDate = new Date();
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
                <Pressable onPress={cancelar} style={{alignSelf:"flex-end",padding:10,borderColor:"black",borderWidth:5}}></Pressable>{/* reemplazar por iconButton cuando esté terminado */}
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
                
                <Pressable style={[estilos.tarjeta,estilos.centrado,colores.botones]} onPress={confirmar}><Text >Confirmar</Text></Pressable>
            </View>
        </Modal>
    )}
    else {
        return (
        <Modal animationType="slide" transparent={false} visible={props.visible}>
            <View style={[estilos.mainView,estilos.centrado]}>
            <Pressable onPress={cancelar} style={{alignSelf:"flex-end",padding:10,borderColor:"black",borderWidth:5}}></Pressable>{/* reemplazar por iconButton cuando esté terminado */}
                <Text style={estilos.titulo}>Desde:</Text>
                <DateTimePicker style={estilos.margen} value={props.fecha_desde} onChange={onChangeDesde} mode="date" />
                <Text style={estilos.titulo}>Hasta:</Text>
                <DateTimePicker style={estilos.margen} onChange={onChangeHasta} value={props.fecha_hasta} mode="date" />
                <Pressable style={[estilos.tarjeta,estilos.centrado,colores.botones]} onPress={confirmar}><Text >Confirmar</Text></Pressable>
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

export {DateRangeModal}
