import { Pressable, Text, TextInput,View, KeyboardAvoidingView, Platform, ScrollView, StyleSheet} from "react-native";
import { estilos, colores } from "@/components/global_styles";
import {  useState } from "react";
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import { error_alert, success_alert } from "@/components/my_alert";
import Toast from "react-native-toast-message";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"; 
import { FontAwesome6, Fontisto, MaterialIcons } from "@expo/vector-icons";
import { Presupuesto } from "@/components/tipos";
import React from "react";
import { today } from "@/components/dias";
import { useUserContext } from "@/context/UserContext";

export default function Ahorro_presupuesto() {

  const { presupuesto_id = 0} = useLocalSearchParams();
    if (presupuesto_id==0) {
        router.dismiss();
        router.replace({pathname:"/tabs",params:{msg:"Valor inválido",error:"yes"}});
    }
    const [presupuesto,setPresupuesto]=useState<Presupuesto>();
    const [monto, setMonto] =useState<number>(0)
    const navigation = useNavigation();
    const [errorMonto, setErrorMonto] = useState('');
    const context = useUserContext();
   
    useFocusEffect(
        React.useCallback(() => {
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
          
          const limpiar = navigation.addListener('blur', () => {
            //?
          });
          return limpiar
        }, [presupuesto_id])
      );
    
    const faltante = presupuesto? presupuesto.montoTotal-presupuesto.total_acumulado: 0;
  const handler_Amount = (input: string) => {
    let aux = Number(input.replace(",", "."));
    if (Number.isNaN(aux)) setErrorMonto("El valor ingresado debe ser un número");
    else if (aux>faltante)  setErrorMonto("El valor ingresado debe ser menor o igual al monto faltante");
    else   {
        setMonto(aux);
        setErrorMonto("");
    }
  };

  
  const confirmar = async () => {

    if (errorMonto || monto==0)
      error_alert("Proporcione un monto válido para continuar");
    else {
        try {
            const fecha=today().toISOString();
            const rsp = await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/ahorro_presupuesto/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({monto:monto,fecha:fecha,user_id:context.id,presupuesto_id:presupuesto_id}),
            })
            if (!rsp.ok) {
                if (rsp.status==400) error_alert("Usuario o presupuesto inválido" )
                else throw new Error(rsp.status + ": " +rsp.statusText)
            } else {
                router.back();
                setTimeout(() => success_alert("Reserva creada correctamente"), 200);
            }
        } catch (error) {
            error_alert(String(error));
          console.log(error," en crear ahorro_presupuesto");
        }
    }
  };

  const scale = useSharedValue(1);
  const scaleCancel = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  const handlePressIn = () => {
    scale.value = withSpring(1.1, { damping: 5 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 5 });
  };
  
  const animatedStyleCancel = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleCancel.value }],
    };
  });
  const handlePressInCancel = () => {
    scaleCancel.value = withSpring(1.1, { damping: 5 }); 
  };
  const handlePressOutCancel = () => {
    scaleCancel.value = withSpring(1, { damping: 5 }); 
  };

  return (

    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[estilos.flex1,estilos.centrado]}
    >
       <ScrollView contentContainerStyle={estilos.modalContent} automaticallyAdjustKeyboardInsets={true}>
        <View style={estilos.modalForm}>
          <Text style={estilos.modalTitle}>Reservar</Text>

            <View style={[styles.header]}>
                        
                <Text style={styles.messageText}>Faltan</Text>
                    <View style={{flexDirection:"row"}}>
                    <MaterialIcons name="attach-money" size={40} color="white" style={estilos.inputIcon} />
                    <Text style={styles.amount}>{faltante}</Text>
                    </View>
                    
                <Text style={styles.messageText}>para alcanzar tu objetivo</Text>
                        
                
            </View>

          <View style={estilos.thinGrayBottomBorder}>
            <View style={estilos.inputContainer}>
              <FontAwesome6 name="money-check-dollar" size={24} color="#666" style={estilos.inputIcon} />
              <Text style={estilos.subtitulo}>Monto a reservar</Text>
            </View>
            <TextInput
              style={estilos.text_input2}
              keyboardType="decimal-pad"
              onChangeText={handler_Amount}
              placeholder="Ingresar valor"
            />
            {errorMonto ? <Text style={estilos.errorText}>{errorMonto}</Text> : null}
          </View>

          <View style={{marginTop:30}}></View>
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={confirmar}
          >
            <Animated.View style={[estilos.confirmButton, animatedStyle]}>
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
      
      <Toast />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles=StyleSheet.create({
     
    amount: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
      },
      messageText: {
        fontSize: 20,
        color: 'white',
        marginVertical: 10,
      },
      header: {
        marginTop: 40,
        marginBottom: 30,
        backgroundColor: "#007AFF",
        padding: 20,
        borderRadius: 5
      },
})