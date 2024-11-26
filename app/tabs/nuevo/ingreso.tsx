import { Text, View, TextInput, Pressable } from "react-native";
import { estilos, colores } from "@/components/global_styles";
import { useState } from "react";
import { useUserContext } from "@/context/UserContext"; 
import { CategoryIngresoPicker } from "@/components/CategoryPicker";
import { router } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type Ingreso = { monto: number, descripcion: string, category_id: number, user_id: number };
function es_valido(ingreso:Ingreso){
  return ingreso.category_id!=0 && ingreso.monto!=0 && ingreso.descripcion!=""
}

export default function Ahorro() {
  const context = useUserContext();
  const [ingreso, setIngreso] = useState<Ingreso>({ monto: 0, descripcion: "", category_id: 0, user_id: context.id });
  const [openPicker, setOpen] = useState(false);
  const [cat, setCat] = useState(0); 

  const handler_monto = (input: string) => {
    const monto = Number(input.replace(",", "."));
    if (Number.isNaN(monto)) {
      alert("El valor ingresado debe ser un número");
    } else {
      setIngreso(pre => ({ ...pre, monto }));
    }
  };

  const handler_descripcion = (input: string) => {
    setIngreso(pre => ({ ...pre, descripcion: input }));
  };

  const confirmar = async () => {
    ingreso.category_id = cat;
    if (!es_valido(ingreso)){
      alert("Complete los campos vacíos para continuar");
    }
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
        alert("Operación exitosa");
        router.dismiss();
        router.replace("/tabs");
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
    <View style={[{ flex: 1 }, estilos.centrado]}>

      <Text style={estilos.subtitulo}>Monto</Text>
      <TextInput
        style={[estilos.textInput, estilos.margen]}
        inputMode="decimal"
        keyboardType="decimal-pad"
        onChangeText={handler_monto}
        placeholder="Ingresar valor"
      />

      <Text style={estilos.subtitulo}>Descripción</Text>
      <TextInput
        style={[estilos.textInput, estilos.margen]}
        keyboardType="default"
        onChangeText={handler_descripcion}
      />


      <Text style={estilos.subtitulo}>Categoría</Text>
      <CategoryIngresoPicker openPicker={openPicker} setOpen={setOpen} selected_cat_id={cat} set_cat_id={setCat}></CategoryIngresoPicker>

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
  );
}
