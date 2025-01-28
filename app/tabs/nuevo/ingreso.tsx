import { Text, View, TextInput, Pressable, Keyboard, Dimensions,KeyboardAvoidingView,Platform,ScrollView } from "react-native";
import { estilos, colores } from "@/components/global_styles";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext"; 
import { CategoryIngresoPicker } from "@/components/CategoryPicker";
import { router } from "expo-router";
import Animated, {  useAnimatedStyle,  useSharedValue,  withSpring} from 'react-native-reanimated';
import{error_alert, success_alert} from '@/components/my_alert';
import Toast from 'react-native-toast-message';
import { Dismiss_keyboard } from "@/components/botones";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";

type Ingreso = { monto: number, descripcion: string, category_id: number, user_id: number };

function es_valido(ingreso:Ingreso){
  return ingreso.category_id!=0 && ingreso.monto!=0 && ingreso.user_id!=0
}

export default function Ahorro() {
  const context = useUserContext();
  const [ingreso, setIngreso] = useState<Ingreso>({ monto: 0, descripcion: "", category_id: 0, user_id: context.id });
  const [openPicker, setOpen] = useState(false);
  const [cat, setCat] = useState(0); 
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight,setKeyboardHeight] = useState(300);
  const [errorMonto, setErrorMonto] = useState('');

  useEffect(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
      const hideSubscription = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);
  
      return () => {
        showSubscription.remove();
      };
    }, []);
  
  const handleKeyboardShow = (event: any) => {
    setIsKeyboardVisible(true);
    setKeyboardHeight(event.endCoordinates.height)
  };

  const handleKeyboardHide = (event: any) => {
    setIsKeyboardVisible(false);
  };

  const handler_monto = (input: string) => {
    const monto = Number(input.replace(",", "."));
    if (Number.isNaN(monto))  setErrorMonto("El valor ingresado debe ser un número");
    else {
      setIngreso(pre => ({ ...pre, monto }));
      setErrorMonto("")
    }
  };

  const handler_descripcion = (input: string) => {
    setIngreso(pre => ({ ...pre, descripcion: input }));
  };

  const confirmar = async () => {
    ingreso.category_id = cat;
    if (!es_valido(ingreso)) error_alert("Complete los campos obligatorios para continuar")
    else {
      try {
        const rsp = await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/ingresos/`, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ingreso)
        });

        if (!rsp.ok) {
          throw new Error("Error en la operación");
        }
        context.actualizar_info(context.id);
        router.back();
        setTimeout(()=>success_alert("Ingreso creado correctamente"),200)
      } catch (e) {
        error_alert(String(e));
        console.log(e)
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[estilos.flex1,estilos.centrado]}>
    
    <ScrollView contentContainerStyle={estilos.modalContent} automaticallyAdjustKeyboardInsets={true}>
    {isKeyboardVisible && <Dismiss_keyboard setVisible={setIsKeyboardVisible} pos_y={Dimensions.get("screen").height-keyboardHeight-150}/>}
    <View style={estilos.modalForm}>
      <Text style={estilos.modalTitle}>Nuevo Ingreso</Text>

      <View style={estilos.thinGrayBottomBorder}>
        <View style={estilos.inputContainer}>
          <FontAwesome6 name="money-check-dollar" size={24} color="#666" style={estilos.inputIcon} />
          <Text style={estilos.subtitulo}>Monto</Text>
        </View>
        <TextInput
          style={estilos.text_input2}
          inputMode="decimal"
          keyboardType="decimal-pad"
          onChangeText={handler_monto}
          placeholder="Ingresar valor"
        />
        {errorMonto ? <Text style={estilos.errorText}>{errorMonto}</Text> : null}
      </View>
     
      <View style={estilos.thinGrayBottomBorder}>
        <View style={estilos.inputContainer}>
          <FontAwesome6 name="pencil" size={24} color="#666" style={estilos.inputIcon} />
          <Text style={estilos.subtitulo}>Descripción (opcional)</Text>
        </View>
        <TextInput
          style={estilos.text_input2}
          keyboardType="default"
          onChangeText={handler_descripcion}
          placeholder="Ingresar descripción"
        />
      </View>

      <View style={[estilos.thinGrayBottomBorder,{zIndex:999}]}>
        <View style={estilos.inputContainer}>
          <MaterialIcons name="category" size={24} color="#666" style={estilos.inputIcon} />
          <Text style={estilos.subtitulo}>Categoría</Text>
        </View>
        
        <CategoryIngresoPicker openPicker={openPicker} setOpen={setOpen} selected_cat_id={cat} set_cat_id={setCat}></CategoryIngresoPicker>
      </View>

      <View style={{marginTop:30,zIndex:-1}}>
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
          onPress={()=>router.back()}
        >
          <Animated.View style={[estilos.cancelButton, animatedStyleCancel]}>
            <Text style={estilos.cancelButtonText}>Cancelar</Text>
          </Animated.View>
        </Pressable>
      </View>
      </View>
    </ScrollView>
    
    <Toast/>
    </KeyboardAvoidingView>
    
  );
}
