import { estilos,colores } from "@/components/global_styles";
import DateTimePicker, { DateTimePickerEvent, DateTimePickerAndroid, AndroidNativeProps } from '@react-native-community/datetimepicker';
import { Text, View, Pressable, Modal, Platform, StyleSheet } from "react-native";

function DateRangeModal(props:{visible:boolean,setVisible: React.Dispatch<React.SetStateAction<boolean>>,fecha_desde: Date,setDesde:React.Dispatch<React.SetStateAction<Date>>,fecha_hasta: Date,setHasta:React.Dispatch<React.SetStateAction<Date>>}) {
    const onChangeDesde=(event:DateTimePickerEvent, selectedDate:Date|undefined) => {
        let currentDate = new Date(0);
        if (selectedDate!=undefined) currentDate=selectedDate
        props.setDesde(currentDate);
      };
      const onChangeHasta=(event:DateTimePickerEvent, selectedDate:Date|undefined) => {
        let currentDate = new Date();
        if (selectedDate!=undefined) currentDate=selectedDate
        props.setHasta(currentDate);
      };
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
        <Modal animationType="slide" transparent={false} visible={props.visible}>
            <View style={[estilos.mainView,estilos.centrado]}>

                <Text style={estilos.titulo}>Desde:</Text>
                <View style={styles.androidDateTime}>
                    <Pressable onPress={showDatepickerDesde}>
                    <Text style={estilos.show_date}>
                        {props.fecha_desde.toLocaleDateString([], {
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
                            {props.fecha_hasta.toLocaleDateString([], {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            })}
                        </Text>
                    </Pressable>
                </View> 
                
                <Pressable style={[estilos.tarjeta,estilos.centrado,colores.botones]} onPress={()=>props.setVisible(false)}><Text >Confirmar</Text></Pressable>
            </View>
        </Modal>
    )}
    else {
        return (<Modal animationType="slide" transparent={false} visible={props.visible}>
            <View style={[estilos.mainView,estilos.centrado]}>
                <Text style={estilos.titulo}>Desde:</Text>
                <DateTimePicker style={estilos.margen} value={props.fecha_desde} onChange={onChangeDesde} mode="date" />
                <Text style={estilos.titulo}>Hasta:</Text>
                <DateTimePicker style={estilos.margen} onChange={onChangeHasta} value={props.fecha_hasta} mode="date" />
                <Pressable style={[estilos.tarjeta,estilos.centrado,colores.botones]} onPress={()=>props.setVisible(false)}><Text >Confirmar</Text></Pressable>
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
