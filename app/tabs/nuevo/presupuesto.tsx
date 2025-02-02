import {  Text, TextInput,  ScrollView,  View,  StyleSheet, Keyboard, Platform,  Pressable} from "react-native";
import { estilos, colores } from "@/components/global_styles";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { router } from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
  DateTimePickerAndroid,
  AndroidNativeProps,
} from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import { success_alert, error_alert } from "@/components/my_alert";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { FontAwesome6 } from "@expo/vector-icons";

type Presupuesto = {
  descripcion: string;
  montoTotal: number;
  fecha_objetivo: string;
  total_acumulado: number;
  user_id: number;
};
function es_valido(presupuesto: Presupuesto) {
  return (
    presupuesto.descripcion.length != 0 && presupuesto.montoTotal != 0 
  );
}

export default function Presupuesto() {
  const context = useUserContext();
  const [presupuesto, setPresupuesto] = useState<Presupuesto>({
    descripcion: "",
    montoTotal: 0,
    fecha_objetivo: "",
    total_acumulado: 0,
    user_id: context.id,
  });
  const [fecha, setFecha] = useState(new Date());
  const [errorDesc, setErrorDesc] = useState('');
  const [errorMonto, setErrorMonto] = useState('');
  const [errorFecha,setErrorFecha] = useState('');

  const handler_descripcion = (input: string) => {
    if (input=="") setErrorDesc("La descripción no puede estar vacía");
    else {
      setPresupuesto((pre) => {
        pre.descripcion = input;
        return pre;
      });
      setErrorDesc("")
    }
  };
  const handler_monto = (input: string) => {
    let aux = Number(input.replace(",", "."));
    if (Number.isNaN(aux)) {
      setErrorMonto("El valor ingresado debe ser un número");
    } else {
      setPresupuesto((pre) => {
        pre.montoTotal = aux;
        return pre;
      });
      setErrorMonto("")
    }
  };
  
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

  const scale = useSharedValue(1);
  const scaleCancel = useSharedValue(1);


  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  const animatedStyleCancel = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleCancel.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(1.1, { damping: 5 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 5 });
  };
  const handlePressInCancel = () => {
    scaleCancel.value = withSpring(1.1, { damping: 5 }); 
  };
  const handlePressOutCancel = () => {
    scaleCancel.value = withSpring(1, { damping: 5 }); 
  };


  const confirmar = async () => {
    presupuesto.fecha_objetivo = fecha.toISOString();
    presupuesto.user_id = context.id;
    presupuesto.total_acumulado = 0;

    if (!es_valido(presupuesto) || fecha <= new Date()) {
      error_alert(
        "Corrija los errores marcados en pantalla"
      );
      return;
    }

    try {
      // Crear presupuesto
      const rsp = await fetch(
        `${process.env.EXPO_PUBLIC_DATABASE_URL}/presupuestos/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(presupuesto),
        }
      );

      if (!rsp.ok) {
        throw new Error("Error al crear el presupuesto");
      }

      // Si todo está bien, redirigir y mostrar éxito
      router.back();
      setTimeout(
        () => success_alert("Presupuesto creado correctamente"),
        200
      );
    } catch (e) {
      error_alert(String(e));
      console.log(e);
    }
  };

  return (
    <View style={[estilos.centrado]}>
      <ScrollView contentContainerStyle={estilos.modalContent} automaticallyAdjustKeyboardInsets={true}>
          <View style={estilos.modalForm}>
          <Text style={estilos.modalTitle}>Nuevo Presupuesto</Text>
            <View style={estilos.thinGrayBottomBorder}>
              <View style={styles.inputContainer}>
                <FontAwesome6 name="pencil" size={24} color="#666" style={styles.inputIcon} />
                <Text style={estilos.subtitulo}>Descripción:</Text>
              </View>
              <TextInput
                  style={estilos.text_input2}
                  keyboardType="default"
                  onChangeText={handler_descripcion}
                  placeholder="Ingresar descripción"
                  placeholderTextColor="#999"
                />
              {errorDesc ? <Text style={estilos.errorText}>{errorDesc}</Text> : null}
            </View>

            <View style={estilos.thinGrayBottomBorder}>
              <View style={styles.inputContainer}>
                <FontAwesome6 name="money-check-dollar" size={24} color="#666" style={styles.inputIcon} />
                <Text style={estilos.subtitulo}>Monto total:</Text>
              </View>
              <TextInput
                  style={estilos.text_input2}
                  onChangeText={handler_monto}
                  keyboardType="decimal-pad"
                  placeholder="Ingresar monto"
                  placeholderTextColor="#999"
                />
              {errorMonto ? <Text style={estilos.errorText}>{errorMonto}</Text> : null}
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

            {errorFecha ? <Text style={estilos.errorText}>{errorFecha}</Text> : null}
            </View>

            <View style={{marginTop:30}}>
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={confirmar}
            >
              <Animated.View  style={[estilos.confirmButton,  { maxHeight: 50 },  animatedStyle ]}   >
                <Text style={estilos.confirmButtonText}>Confirmar</Text>
              </Animated.View>
            </Pressable>

            <Pressable
              onPressIn={handlePressInCancel}
              onPressOut={handlePressOutCancel}
              onPress={() => router.back()}
            >
              <Animated.View style={[estilos.cancelButton, animatedStyleCancel]}>
                <Text style={estilos.cancelButtonText}>Cancelar</Text>
              </Animated.View>
            </Pressable>
            </View>
          </View>
      </ScrollView>
      <Toast />
    </View>)
   
}

const styles = StyleSheet.create({
  androidDateTime: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15
  },
  inputIcon: {
    marginRight: 10,
  },
  
});
