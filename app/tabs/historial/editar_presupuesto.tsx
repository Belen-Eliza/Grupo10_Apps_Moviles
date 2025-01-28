import { useEffect, useState } from "react";
import { Text, View, Pressable, StyleSheet,ScrollView, TextInput, Platform } from "react-native";
import { estilos,colores } from "@/components/global_styles";
import { router,useLocalSearchParams } from "expo-router";
import Checkbox from 'expo-checkbox';
import { error_alert, success_alert } from "@/components/my_alert";
import Toast from "react-native-toast-message";
import { Ionicons, MaterialIcons, Fontisto, FontAwesome6  } from "@expo/vector-icons";
import { Presupuesto } from "@/components/tipos";
import DateTimePicker, {
    DateTimePickerEvent,
    DateTimePickerAndroid,
    AndroidNativeProps,
  } from "@react-native-community/datetimepicker";
import { comparar_fechas } from "@/components/DateRangeModal";
import { today } from "@/components/dias";
 
export default function EditarPresupuesto(){
const { presupuesto_id = 0} = useLocalSearchParams();
    if (presupuesto_id==0) {
        router.dismiss();
        router.back();
    }
    const [presupuesto,setPresupuesto]=useState<Presupuesto>();
    const [descripcion,setDescripcion]=useState<string>();
    const [monto,setMonto]=useState<number>();
    const [fecha, setFecha] = useState<Date>(new Date());
    const [activo,setActivo] = useState<number>()
    const [errorDesc, setErrorDesc] = useState('');
    const [errorMonto, setErrorMonto] = useState('');
    const [errorFecha,setErrorFecha] = useState('');
    const [isChecked, setChecked] = useState(false);
   
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
                setFecha(new Date(data.fecha_objetivo));
                setMonto(data.montoTotal);
                setDescripcion(data.descripcion);
                setChecked(data.activo==1);
              }
          } catch (error) {
              console.log(error);
              error_alert("Presupuesto no encontrado");
              setTimeout(()=>{router.back()},3000);                
          }
      })()
    }, [presupuesto_id]);

    const confirmar= async ()=>{
      try {
        const rsp = await fetch( `${process.env.EXPO_PUBLIC_DATABASE_URL}/presupuestos/${presupuesto_id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({new_desc:descripcion,new_amount:monto, new_act:activo, new_date: fecha.toISOString()}),
          })
          if (!rsp.ok) {
            throw new Error("Error al modificar el presupuesto");
          }
    
          router.back();
          setTimeout(
            () => success_alert("Presupuesto modificado correctamente"),
            200 );
      } catch (e) {
        error_alert(String(e));
        console.log(e," en editar presupuesto");
      }
      
    }
    const cancelar= ()=>{
        router.back();
    }

    const handlerMonto=(text: string) =>{
        let aux = Number(text.replace(",", "."));
        if (Number.isNaN(aux)) setErrorMonto("El valor ingresado debe ser un número");
        else setMonto(aux);
    }
    const handlerDescripcion = (text:string)=>{
      setDescripcion(text)
    }
    const handlerActivo=(input: boolean) =>{
      setChecked(input);
      if (input) setActivo(1);
      else setActivo(0);
    }
    const onChangeDate = ( event: DateTimePickerEvent, selectedDate: Date | undefined) => {
      if (selectedDate != undefined ) {
        if (!comparar_fechas(selectedDate,today())) {
          setFecha(selectedDate);
          setErrorFecha("")
        }
        else setErrorFecha("La fecha objetivo no puede ser menor o igual al día de hoy")
      }
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
              
              <View style={estilos.thinGrayBottomBorder}>
                <View style={styles.inputContainer}>
                  <FontAwesome6 name="pencil" size={24} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={estilos.text_input2}
                    value={descripcion}
                    onChangeText={handlerDescripcion}
                  />
                </View>
                {errorDesc ? <Text style={styles.errorText}>{errorDesc}</Text> : null}
              </View>
              

              <View style={estilos.thinGrayBottomBorder}>
                <View style={styles.inputContainer}>
                  
                  <FontAwesome6 name="money-check-dollar" size={24} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={estilos.text_input2}
                    value={monto?.toString()}
                    onChangeText={handlerMonto}
                    keyboardType="decimal-pad"
                  />
                </View>
                {errorMonto ? <Text style={styles.errorText}>{errorMonto}</Text> : null}
              </View>
              <View style={estilos.thinGrayBottomBorder}>
                <View style={styles.inputContainer}>
                  <FontAwesome6 name="calendar-days" size={24} color="#666" style={styles.inputIcon} />
                  <Text style={estilos.subtitulo}>Fecha objetivo:</Text>
                </View>
                
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
                style={[estilos.centrado,estilos.poco_margen]}
                value={fecha}
                onChange={onChangeDate}
                mode="date"
                minimumDate={new Date()}
              />
            )}

            {errorFecha ? <Text style={styles.errorText}>{errorFecha}</Text> : null}
            </View>
            <View style={[styles.inputContainer,estilos.thinGrayBottomBorder,{justifyContent:"space-between"}]}>
              <View style={{flexDirection:"row"}}>
                <FontAwesome6 name="check-circle" size={24} color="#666" style={styles.inputIcon} />
                <Text style={estilos.subtitulo}>Activo </Text>
              </View>
              
              <Checkbox
                style={styles.checkbox}
                value={isChecked}
                onValueChange={handlerActivo}
                color={isChecked ? '#007AFF' : undefined}
              />
            </View>

            <View style={{marginTop:30}}>
              <Pressable style={estilos.confirmButton} onPress={confirmar}>
                <Text style={estilos.confirmButtonText}>Confirmar</Text>
              </Pressable>

              
            <Pressable style={estilos.cancelButton} onPress={cancelar}>
                <Text style={estilos.cancelButtonText}>Cancelar</Text>
            </Pressable>
            </View>
              
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
  
    buttonIcon: {
      marginRight: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 15
    },
    inputIcon: {
      marginRight: 10,
    },
    errorText: {
      color: '#ff3b30',
      fontSize: 12,
      marginBottom: 10,
    },
    
    androidDateTime: {
        flexDirection: "row",
        justifyContent: "space-around",
      },
      checkbox: {
        margin: 10,
        
      },
  });
  
  