import { Text, TextInput, View } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import { useState } from "react";


export default function Gasto() {
  const [amount,changeAmount]=useState(0);
  const handler=(input:string)=>{
    let aux=Number(input);
    if( aux=NaN){
      alert("El valor ingresado debe ser un número");
    } else {changeAmount(aux)}
  }
  
  return (
    <View style={[{flex: 1},estilos.centrado]} >
      <Text style={estilos.titulo}>Agregar gasto</Text>
      <TextInput style={estilos.textInput} onChangeText={handler}  placeholder='Ingresar valor'></TextInput>
      <Text style={estilos.subtitulo}>Cuotas</Text>
      <Text style={estilos.subtitulo}>Categoría</Text>
    </View>
  );
}
