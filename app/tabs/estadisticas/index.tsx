import { Pressable, Text, View, StyleSheet } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import { Link } from "expo-router";

export default function Index() {

  return (
    <View style={[{flex: 1},estilos.centrado]} >
      <Link href="/tabs/estadisticas/gastos_por_fecha" asChild style={[estilos.tarjeta,colores.botones,estilos.centrado]}>
        <Pressable><Text style={estilos.subtitulo}>Por fecha</Text></Pressable>
      </Link>
      <Link href="/tabs/estadisticas/gastos_por_categoria" asChild style={[estilos.tarjeta,colores.botones,estilos.centrado]}>
        <Pressable ><Text style={estilos.subtitulo}>Por categoría</Text></Pressable>
      </Link>
      
    </View>
  );
}