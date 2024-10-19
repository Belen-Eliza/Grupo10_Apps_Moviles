import { Pressable, Text, View } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import Boton from "@/components/Boton";
import { Link } from "expo-router";

export default function Index() {

  return (
    <View style={[{flex: 1},estilos.centrado]} >
      <Link href="/nuevo/gasto" asChild>
        <Pressable style={[estilos.tarjeta,colores.botones]}><Text>Agregar Gasto</Text></Pressable>
      </Link>
      <Link href="/nuevo/ahorro" asChild>
        <Pressable style={[estilos.tarjeta,colores.botones]}><Text>Agregar Ahorro</Text></Pressable>
      </Link>
      
    </View>
  );
}
