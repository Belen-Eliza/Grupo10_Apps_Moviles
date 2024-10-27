import { Pressable, Text, TextInput, View } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import { useState } from "react";
import {Picker} from '@react-native-picker/picker';

type Categoria= {
  cod: number, descripcion: string
}

export default function Gasto() {
  const [amount,changeAmount]=useState(0);
  const [cuotas,cambiarCuotas]=useState(1);
  const [categoria, setCategoria] = useState(0);
  const todasCategorias: Categoria[] = [{cod: 1,descripcion:"Comida"},{cod: 2,descripcion:"Entretenimiento"}] /*Conectar despues con DB */
  const handler_Amount=(input:string)=>{
    let aux=Number(input);
    if( aux=NaN){
      alert("El valor ingresado debe ser un número");
    } else {changeAmount(aux)}
  }
  const handler_Cuotas=(input:string)=>{
    let aux=Number(input);
    if( aux=NaN){
      alert("El valor ingresado debe ser un número");
    } else {cambiarCuotas(aux)}
  }
  const handler_Categoria = (codigo:number) => setCategoria(codigo) ;
  
  return (
    <View style={[{flex: 1},estilos.centrado]} >
      <Text style={estilos.titulo}>Agregar gasto</Text>
      <TextInput style={estilos.textInput} onChangeText={handler_Amount}  placeholder='Ingresar valor'></TextInput>
      <Text style={estilos.subtitulo}>Cuotas</Text>
      <TextInput style={estilos.textInput} onChangeText={handler_Cuotas}  placeholder='Ingresar cuotas'></TextInput>
      <Text style={estilos.subtitulo}>Categoría</Text>
      <Picker style={{ height: 100, width: 150 }} itemStyle={{color: "black"}} selectedValue={categoria} onValueChange={handler_Categoria}> 
        {todasCategorias.map(cat =>{  /*corregir*/
          return (<Picker.Item label={cat.descripcion} value={cat.cod} />)
        })}
      </Picker>
      <Pressable style={[estilos.tarjeta, estilos.centrado, estilos.margen,colores.botones, {maxHeight:50}]}><Text style={estilos.subtitulo}>Confirmar</Text></Pressable>
    </View>
  );
}
 