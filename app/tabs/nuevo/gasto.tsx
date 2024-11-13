import { Pressable, Text, TextInput, View } from "react-native";
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

type Categoria = {
  id: number;
  descripcion: string;
  name: string;
};

type Gasto = {
  monto: number;
  category_id: number;
  cant_cuotas: number;
  user_id: number;
};

export default function Gasto() {
  const inicial: Gasto = { monto: 0, category_id: 0, cant_cuotas: 1, user_id: 0 };
  const [gasto, setGasto] = useState(inicial);
  const [openPicker, setOpen] = useState(false);
  const [cat, setCat] = useState(0);
  const context = useUserContext();
  const [categorias, setCategorias] = useState<Categoria[]>([{ id: 1, name: "Comida", descripcion: "" }]);

  useEffect(() => {
    (async () => {
      fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/categorias/de_gastos`, {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
      })
        .then(rsp => rsp.json())
        .then(info => setCategorias(info));
    })();
  }, [context]);

  const handler_Amount = (input: string) => {
    let aux = Number(input.replace(",", "."));
    if (Number.isNaN(aux)) {
      alert("El valor ingresado debe ser un número");
    } else {
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
      <Text style={estilos.titulo}>Agregar gasto</Text>
      
      <TextInput
        style={[estilos.textInput, estilos.margen]}
        keyboardType="decimal-pad"
        onChangeText={handler_Amount}
        placeholder='Ingresar valor'
      />
      
      <Text style={estilos.subtitulo}>Cuotas</Text>
      <TextInput
        style={[estilos.textInput, estilos.margen]}
        keyboardType="numbers-and-punctuation"
        onChangeText={handler_Cuotas}
        placeholder='Ingresar cuotas'
      />

      <Text style={estilos.subtitulo}>Categoría</Text> 
      <DropDownPicker
        style={[{ maxWidth: "60%" }, estilos.textInput, estilos.margen, estilos.centrado]}
        open={openPicker}
        value={cat}
        items={categorias.map(e => { return { value: e.id, label: e.name } })}
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
