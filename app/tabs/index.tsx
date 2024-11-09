import { Text, View } from "react-native";
import{estilos,colores} from "@/components/global_styles"

import { useUserContext } from "@/context/UserContext";

export default function Index() {
  const user = useUserContext();
  
  return (
    <View style={[{
      flex: 1,
      flexWrap: "wrap",
      width: "100%"
    },estilos.centrado,colores.fondo]}>
      <View style={[{flex:1, borderBottomWidth: 3,borderBottomColor:"black"},estilos.centrado]} >
        <Text style={estilos.titulo}>Bienvenido, {user.nombre}</Text>
      </View>
        
      <View style={{flex: 3, alignItems:"center",justifyContent:"space-evenly"}}>
        <Text style={estilos.subtitulo} >Su balance actual es: </Text>
        <Text style={estilos.titulo}>${user.saldo}</Text>
      </View>
    </View>
  );
}
