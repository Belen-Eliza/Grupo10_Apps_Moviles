import { Text, View } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import Boton from "@/components/Boton";

export default function Index() {
  return (
    <View
      style={[{flex: 1},estilos.centrado]}
    >
      <Boton texto="Agregar Gasto"></Boton>
      <Boton texto="Agregar Ahorro"></Boton>
      
    </View>
  );
}
