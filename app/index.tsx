import { Text, View } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import { useState, useEffect } from "react";

export default function Index() {
  const id_user= 1; /*completar con login y estados globales*/
  const [data_user,setData] = useState(null);
  const nombre= "Placeholder ";
  const total = 1234;

  useEffect(()=>{
    fetch("") /*traer datos segun id*/ 
    .then(response =>response.json())
    .then(data_user=>setData(data_user))
  },[id_user])
  
  return (
    <View style={[{
      flex: 1,
      flexWrap: "wrap",
      width: "100%"
    },estilos.centrado,colores.fondo]}>
      <View style={[{flex:1, borderBottomWidth: 3,borderBottomColor:"black"},estilos.centrado]} >
        <Text style={estilos.titulo}>Bienvenido, {nombre}</Text>
      </View>
        
      <View style={{flex: 3, alignItems:"center",justifyContent:"space-evenly"}}>
        <Text style={estilos.subtitulo} >Su balance actual es: </Text>
        <Text style={estilos.titulo}>${total}</Text>
      </View>
    </View>
  );
}
