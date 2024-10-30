import { Text, View } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import Boton from "@/components/Boton";
import { Link } from "expo-router";


export default function Gasto() {

  return (
    <View style={[{flex: 1},estilos.centrado]} >
      <Text>Sumar ahorro</Text>
    </View>
  );
}
