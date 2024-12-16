import {
  Pressable,
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { estilos, colores } from "@/components/global_styles";
import { useEffect, useState } from "react";
import { CategoryPicker } from "@/components/CategoryPicker";
import { useUserContext } from "@/context/UserContext";
import { router } from "expo-router";
import { error_alert, success_alert } from "@/components/my_alert";
import Toast from "react-native-toast-message";
import { Dismiss_keyboard } from "@/components/botones";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { LoadingCircle } from "@/components/loading";

type Gasto = {
  monto: number;
  category_id: number;
  cant_cuotas: number;
  user_id: number;
};

function es_valido(gasto: Gasto) {
  return gasto.cant_cuotas != 0 && gasto.category_id != 0 && gasto.monto != 0;
}
export default function Gasto() {
  const inicial: Gasto = {
    monto: 0,
    category_id: 0,
    cant_cuotas: 0,
    user_id: 0,
  };
  const [gasto, setGasto] = useState(inicial);
  const [openPicker, setOpen] = useState(false);
  const [cat, setCat] = useState(0);
  const context = useUserContext();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(300);
  const [isFetching, setFetching] = useState(false);

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

  const handler_Cuotas = (input: string) => {
    let aux = Number(input);
    setGasto((pre) => {
      pre.cant_cuotas = aux;
      return pre;
    });
  };

  const confirmar = async () => {
    gasto.category_id = cat;
    gasto.user_id = context.id;

    if (!es_valido(gasto))
      error_alert("Complete todos los campos para continuar");
    else {
      fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/gastos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gasto),
      })
        .then((v) => {
          setFetching(false);
          context.actualizar_info(context.id);
          router.back();
          setTimeout(() => success_alert("Gasto creado correctamente"), 200);
        })
        .catch((e) => {
          setFetching(false);
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
      style={estilos.flex1}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[{ flex: 1 }, estilos.centrado]}>
          {isKeyboardVisible && (
            <Dismiss_keyboard
              setVisible={setIsKeyboardVisible}
              pos_y={Dimensions.get("screen").height - keyboardHeight - 150}
            />
          )}

          <Text style={estilos.subtitulo}>Monto</Text>
          <TextInput
            style={[estilos.textInput, estilos.margen]}
            keyboardType="decimal-pad"
            onChangeText={handler_Amount}
            placeholder="Ingresar valor"
          />

          <Text style={estilos.subtitulo}>Cuotas</Text>
          <TextInput
            style={[estilos.textInput, estilos.margen]}
            keyboardType="number-pad"
            onChangeText={handler_Cuotas}
            placeholder="Ingresar cuotas"
          />

          <Text style={estilos.subtitulo}>Categoría</Text>
          <CategoryPicker
            openPicker={openPicker}
            setOpen={setOpen}
            selected_cat_id={cat}
            set_cat_id={setCat}
          ></CategoryPicker>

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
      </TouchableWithoutFeedback>
      <Toast />
    </KeyboardAvoidingView>
  );
}
