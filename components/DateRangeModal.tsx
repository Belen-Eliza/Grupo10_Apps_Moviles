import { estilos,colores } from "@/components/global_styles";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Text, View, Pressable, Modal } from "react-native";

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
    return (
        <Modal animationType="slide" transparent={false} visible={props.visible}>
            <View style={[estilos.mainView,estilos.centrado]}>
                <Text style={estilos.titulo}>Desde:</Text>
                <DateTimePicker style={estilos.margen} value={props.fecha_desde} onChange={onChangeDesde} mode="date" />
                <Text style={estilos.titulo}>Hasta:</Text>
                <DateTimePicker style={estilos.margen} onChange={onChangeHasta} value={props.fecha_hasta} mode="date" />
                <Pressable style={[estilos.tarjeta,estilos.centrado,colores.botones]} onPress={()=>props.setVisible(false)}><Text >Confirmar</Text></Pressable>
            </View>
        </Modal>
    )
}


export {DateRangeModal}