import { useEffect, useState } from "react";
import { Text, View, Pressable, Modal,Dimensions, StyleSheet,ScrollView, TouchableOpacity, TextInput, Platform } from "react-native";
import { estilos,colores } from "@/components/global_styles";
import { Link, router,useFocusEffect,useLocalSearchParams } from "expo-router";
import { LoadingCircle } from "@/components/loading";
import { error_alert } from "@/components/my_alert";
import Toast from "react-native-toast-message";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ProgressChart } from "react-native-chart-kit";
import { ActionButton, Presupuesto } from "@/components/tipos";
import { DateRangeModal } from "@/components/DateRangeModal";
import Fontisto from '@expo/vector-icons/Fontisto';
import DateTimePicker, {
    DateTimePickerEvent,
    DateTimePickerAndroid,
    AndroidNativeProps,
  } from "@react-native-community/datetimepicker";
 
export default function EditarPresupuesto(){
const { presupuesto_id = 0} = useLocalSearchParams();
    if (presupuesto_id==0) {
        router.dismiss();
        router.replace({pathname:"/tabs",params:{msg:"Valor inválido",error:"yes"}});
    }
    const [presupuesto,setPresupuesto]=useState<Presupuesto>();
    const [descripcion,handlerDescripcion]=useState<string>();
    const [monto,setMonto]=useState<number>();
    const [pass,handler_password]=useState<string>()
    const [errorEmail, setErrorEmail] = useState('');
    const [errorMonto, setErrorMonto] = useState('');
    const [errorName,setErrorName] = useState('');
    const [fecha, setFecha] = useState(new Date());
   
    useEffect(()=>{
        (async ()=>{
            try {
                const rsp = await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/presupuestos/unico/${presupuesto_id}`,{
                    method:'GET',
                    headers:{"Content-Type":"application/json"}});
                if (!rsp.ok)  throw new Error(rsp.status+" en ver presupuesto")
                else {
                    const data= await rsp.json();
                    setPresupuesto(data);
                }
            } catch (error) {
                console.log(error);
                error_alert("Presupuesto no encontrado");
                setTimeout(()=>{router.back()},3000);                
            }
        })()
    }, [presupuesto_id]);

    const handlerMonto=(text: string) =>{
        let aux = Number(text.replace(",", "."));
        if (Number.isNaN(aux)) setErrorMonto("El valor ingresado debe ser un número");
        else setMonto(aux);
    }
    const handlerFecha=(text: string) =>{}
    const handlerActivo=(text: string) =>{}
    const confirmar= ()=>{}
    const cancelar= ()=>{
        router.back()
    }

    const onChangeDate = ( event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        let currentDate = new Date(0);
        if (selectedDate != undefined) currentDate = selectedDate;
        setFecha(currentDate);
      };
      const showMode = (currentMode: AndroidNativeProps["mode"]) => {
        DateTimePickerAndroid.open({
          value: fecha,
          onChange: onChangeDate,
          mode: currentMode,
          is24Hour: false,
          minimumDate: new Date(),
        });
      };
      const showDatepicker = () => {
        showMode("date");
      };
    return (
        
        <View style={[estilos.centrado]}>
        <ScrollView contentContainerStyle={estilos.modalContent} automaticallyAdjustKeyboardInsets={true}>
            <View style={estilos.modalForm}>
              <Text style={estilos.modalTitle}>Editar Presupuesto</Text>

              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={24} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={presupuesto?.descripcion}
                  onChangeText={handlerDescripcion}
                  placeholder="Nuevo nombre"
                  placeholderTextColor="#999"
                />
              </View>
              {errorName ? <Text style={styles.errorText}>{errorName}</Text> : null}

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={24} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={monto?.toString()}
                  onChangeText={handlerMonto}
                  placeholder={presupuesto? presupuesto.montoTotal.toString():"0"}
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                />
              </View>
              {errorMonto ? <Text style={styles.errorText}>{errorMonto}</Text> : null}

              <Text style={estilos.subtitulo}>Fecha objetivo:</Text>
            {Platform.OS === "android" ? (
              <View style={styles.androidDateTime}>
                <Pressable onPress={showDatepicker}>
                  <Text style={estilos.show_date}>
                    {fecha.toLocaleDateString([], {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <DateTimePicker
                style={estilos.margen}
                value={fecha}
                onChange={onChangeDate}
                mode="date"
                minimumDate={new Date()}
              />
            )}
              <Pressable style={estilos.confirmButton} onPress={confirmar}>
                <Text style={estilos.confirmButtonText}>Confirmar</Text>
              </Pressable>

              
            <Pressable style={estilos.cancelButton} onPress={cancelar}>
                <Text style={estilos.cancelButtonText}>Cancelar</Text>
            </Pressable>
              
            </View>
          </ScrollView>
       <Toast/>
      </View>
        
    )
}
const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: '100%',
      height: '100%',
      
    },
    container: {
      flex: 1,
      padding: 20,
    },
    header: {
      marginTop: 40,
      marginBottom: 20,
      alignItems: 'center',
    },
    welcomeText: {
      fontSize: 24,
      color: 'white',
    },
    nameText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#409fff',
    },
    balanceContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      marginBottom: 30,
    },
    balanceLabel: {
      fontSize: 18,
      color: '#666',
      marginBottom: 10,
    },
    balanceAmount: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#007AFF',
    },
    buttonContainer: {
      marginTop: 20,
    },
    button: {
      backgroundColor: '#007AFF',
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 15,
      marginBottom: 15,
    },
    buttonIcon: {
      marginRight: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      marginBottom: 15,
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      height: 50,
      fontSize: 16,
      color: '#333',
    },
    errorText: {
      color: '#ff3b30',
      fontSize: 12,
      marginBottom: 10,
    },
    
    cancelButton: {
      backgroundColor: '#fff',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#007AFF',
      padding: 15,
      alignItems: 'center',
      marginTop: 10,
    },
    cancelButtonText: {
      color: '#007AFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    androidDateTime: {
        flexDirection: "row",
        justifyContent: "space-around",
      },
  });
  
  