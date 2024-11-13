import { Text, View, TextInput, Pressable } from "react-native";
import { estilos, colores } from "@/components/global_styles";
import { useState, useEffect } from "react";
import { useUserContext } from "@/context/UserContext"; 
import DropDownPicker from 'react-native-dropdown-picker';
import { router } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type CategoryIngreso = { id: number, name: string, description: string };
type Ingreso = { monto: number, descripcion: string, category_id: number, user_id: number };

export default function Ahorro() {
  const context = useUserContext();
  const [ingreso, setIngreso] = useState<Ingreso>({ monto: 0, descripcion: "", category_id: 0, user_id: context.id });
  const [openPicker, setOpen] = useState(false);
  const [cat, setCat] = useState(0);
  const [todas_categorias, setCategorias] = useState<CategoryIngreso[]>([{ id: 0, name: "", description: "" }]);

  useEffect(() => {
    (async () => {
      fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/categorias/de_ingresos`, {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
      })
      .then(rsp => rsp.json())
      .then(info => setCategorias(info))
    })();
  }, []);  


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
      <Text style={estilos.titulo}>Agregar ingreso</Text>

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
      <DropDownPicker
        style={[{ maxWidth: "60%" }, estilos.textInput, estilos.margen, estilos.centrado]}
        open={openPicker}
        value={cat}
        items={todas_categorias.map(e => ({ value: e.id, label: `${e.name} - ${e.description}` }))}
        setItems={setCategorias}
        itemKey="value"
        setOpen={setOpen}
        setValue={setCat}
      />


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
