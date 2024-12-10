import { Pressable, Text, TextInput, View ,Keyboard, TouchableWithoutFeedback} from "react-native";
import { estilos, colores } from "@/components/global_styles";
import { useEffect, useState } from "react";
import { CategoryPicker } from "@/components/CategoryPicker";
import { useUserContext } from "@/context/UserContext"; 
import { router } from "expo-router";
import my_alert from '@/components/my_alert';
import { RootSiblingParent } from 'react-native-root-siblings';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type Gasto = {
  monto: number;
  category_id: number;
  cant_cuotas: number;
  user_id: number;
};

function es_valido(gasto:Gasto){
  return gasto.cant_cuotas!=0 && gasto.category_id!=0 && gasto.monto!=0
}
export default function Gasto() {
  const inicial: Gasto = { monto: 0, category_id: 0, cant_cuotas: 0, user_id: 0 };
  const [gasto, setGasto] = useState(inicial);
  const [openPicker, setOpen] = useState(false);
  const [cat, setCat] = useState(0);
  const context = useUserContext();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      showSubscription.remove();
    };
  }, []);

  const handleKeyboardShow = (event: any) => {
    setIsKeyboardVisible(true);
  };

  const handleKeyboardHide = (event: any) => {
    setIsKeyboardVisible(false);
  };
  
  const handler_Amount = (input: string) => {
    let aux = Number(input.replace(",", "."));
    if (Number.isNaN(aux)) my_alert("El valor ingresado debe ser un número");
    else {
      setGasto(pre => {
        pre.monto = aux;
        return pre;
      });
    }
  };

  const handler_Cuotas = (input: string) => {
    let aux = Number(input);
    setGasto(pre => {
      pre.cant_cuotas = aux;
      return pre;
    });
  };

  const confirmar = async () => {
    gasto.category_id = cat;
    gasto.user_id = context.id;

    if (!es_valido(gasto)) my_alert("Complete todos los campos para continuar");
    else {
      try {
        const rsp = await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/gastos/`, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(gasto)
        });

        if (!rsp.ok) {
          throw new Error("Error en la operación");
        }

        context.actualizar_info(context.id);
        router.dismiss();
        router.replace({pathname:"/tabs",params:{msg:"Operación exitosa"}});
      } catch (e) {
        alert(e);
      }
    }
  };

  const scale = useSharedValue(1);

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

  return (
    <RootSiblingParent>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    
    <View style={[{ flex: 1 }, estilos.centrado]}>
    
      <Text style={estilos.subtitulo}>Monto</Text>
      <TextInput
        style={[estilos.textInput, estilos.margen]}
        keyboardType="decimal-pad"
        onChangeText={handler_Amount}
        placeholder='Ingresar valor'
      />
      
      <Text style={estilos.subtitulo}>Cuotas</Text>
      <TextInput
        style={[estilos.textInput, estilos.margen]}
        keyboardType="number-pad"
        onChangeText={handler_Cuotas}
        placeholder='Ingresar cuotas'
      />
{isKeyboardVisible && <Pressable style={[colores.button,{padding:10,borderRadius:10,alignSelf:"flex-end"}]} onPress={()=>{Keyboard.dismiss();setIsKeyboardVisible(false)}} ><Text style={estilos.confirmButtonText}>Listo</Text></Pressable>}
      <Text style={estilos.subtitulo}>Categoría</Text> 
      <CategoryPicker openPicker={openPicker} setOpen={setOpen} selected_cat_id={cat} set_cat_id={setCat}></CategoryPicker>
      

      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={confirmar}
      >
        <Animated.View style={[estilos.tarjeta, estilos.centrado, colores.botones, { maxHeight: 50 }, animatedStyle]}>
          <Text style={estilos.subtitulo}>Confirmar</Text>
        </Animated.View>
      </Pressable>
    </View>
    
    </TouchableWithoutFeedback>
    </RootSiblingParent>
  );
}
