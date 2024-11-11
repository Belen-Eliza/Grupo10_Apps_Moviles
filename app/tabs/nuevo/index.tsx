import { Pressable, Text, View, StyleSheet } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import { Link } from "expo-router";

export default function Index() {

  return (
    <View style={[{flex: 1},estilos.centrado]} >

      <Link href="/tabs/nuevo/gasto" asChild>
        <Pressable style={stylish.tarjeta}><Text style={estilos.subtitulo}>Agregar Gasto</Text></Pressable>
      </Link>

      <Link href="/tabs/nuevo/ahorro" asChild>
        <Pressable style={stylish.tarjeta}><Text style={estilos.subtitulo}>Agregar Ahorro</Text></Pressable>
      </Link>

      <Link href="/tabs/nuevo/presupuesto" asChild>
        <Pressable style={stylish.tarjeta}><Text style={estilos.subtitulo}>Agregar Presupuesto</Text></Pressable>
      </Link>
      
    </View>
  );
}
const stylish = StyleSheet.create({
  tarjeta: {
    flex: 1,
    minWidth: "80%",
    maxHeight: 100,
    borderRadius: 5,
    borderWidth: 2,
    margin: 10,
    
    backgroundColor: "lightblue",
    borderColor: "#0082bf",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center"
   },
})