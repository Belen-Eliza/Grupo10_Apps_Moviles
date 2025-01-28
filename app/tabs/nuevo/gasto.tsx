import { Pressable, Text, TextInput,View, Keyboard, Dimensions, KeyboardAvoidingView, Platform, ScrollView} from "react-native";
import { estilos, colores } from "@/components/global_styles";
import { useEffect, useState } from "react";
import { CategoryPicker } from "@/components/CategoryPicker";
import { useUserContext } from "@/context/UserContext";
import { router } from "expo-router";
import { error_alert, success_alert } from "@/components/my_alert";
import Toast from "react-native-toast-message";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"; 
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";

type Gasto = {
  monto: number;
  category_id: number;
  description: string,
  user_id: number;
};

function es_valido(gasto: Gasto) {
  return  gasto.category_id != 0 && gasto.monto != 0 && gasto.user_id!=0;
}
export default function Gasto() {
  const inicial: Gasto = {
    monto: 0,
    category_id: 0,
    description: "",
    user_id: 0,
  };
  const [gasto, setGasto] = useState(inicial);
  const [openPicker, setOpen] = useState(false);
  const [cat, setCat] = useState(0);
  const context = useUserContext();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(300);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      handleKeyboardShow
    );
    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyboardHide
    );

    return () => {
      showSubscription.remove();
    };
  }, []);

  const handleKeyboardShow = (event: any) => {
    setIsKeyboardVisible(true);
    setKeyboardHeight(event.endCoordinates.height);
  };

  const handleKeyboardHide = (event: any) => {
    setIsKeyboardVisible(false);
  };

  const handler_Amount = (input: string) => {
    let aux = Number(input.replace(",", "."));
    if (Number.isNaN(aux)) error_alert("El valor ingresado debe ser un número");
    else {
      setGasto((pre) => {
        pre.monto = aux;
        return pre;
      });
    }
  };

  const handler_descripcion = (input: string) => {
    setGasto(pre => ({ ...pre, description: input }));
  };

  const confirmar = async () => {
    gasto.category_id = cat;
    gasto.user_id = context.id;

    if (!es_valido(gasto))
      error_alert("Complete los campos obligatorios para continuar");
    else {
      fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/gastos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gasto),
      })
        .then((v) => {
          context.actualizar_info(context.id);
          router.back();
          setTimeout(() => success_alert("Gasto creado correctamente"), 200);
        })
        .catch((e) => {
          error_alert(String(e));
          console.log(e);
        });
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
          <Text style={estilos.modalTitle}>Nuevo Gasto</Text>

          <View style={estilos.thinGrayBottomBorder}>
            <View style={estilos.inputContainer}>
              <FontAwesome6 name="money-check-dollar" size={24} color="#666" style={estilos.inputIcon} />
              <Text style={estilos.subtitulo}>Monto</Text>
            </View>
            <TextInput
              style={estilos.text_input2}
              keyboardType="decimal-pad"
              onChangeText={handler_Amount}
              placeholder="Ingresar valor"
            />
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
            <CategoryPicker
              openPicker={openPicker}
              setOpen={setOpen}
              selected_cat_id={cat}
              set_cat_id={setCat}
            ></CategoryPicker>
          </View>

          <View style={{marginTop:30,zIndex:-1}}></View>
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
