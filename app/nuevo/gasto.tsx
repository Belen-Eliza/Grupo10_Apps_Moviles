import {Pressable, Text, TextInput, View } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import { useState } from "react";

import DropDownPicker from 'react-native-dropdown-picker';
import { router } from "expo-router";

type Categoria= {
  cod: number, descripcion: string
}
type Gasto ={
  monto: Number, descripcion: String, categoria_id: number, cant_cuotas: number
}
const todasCategorias = [{value: 1,label:"Comida"},{value: 2,label:"Entretenimiento"}, {value: 3,label:"Hogar"}] /*Conectar despues con DB */

export default function Gasto() {
  const inicial: Gasto = {monto: 0,descripcion:"",categoria_id:0,cant_cuotas:1};
  const [gasto,setGasto]=useState(inicial);
  const [openPicker,setOpen] = useState(false);
  const [cat,setCat] =useState(0);
  
  
  const handler_Amount=(input:string)=>{
    let aux=Number(input);
    if( Number.isNaN(aux)){
      alert("El valor ingresado debe ser un número");
    } else {
      setGasto(pre=>{
        pre.monto=aux;
        return pre
      })
    }
  }
  const handler_Cuotas=(input:string)=>{
    let aux=Number(input);
    if( !Number.isInteger(aux)){
      alert("El valor ingresado debe ser un número entero");
    } else {
      setGasto(pre=>{
        pre.cant_cuotas=aux;
        return pre
      })
    }
  }

  const handler_Comentario=(input:string)=>{
    setGasto(pre=>{
      pre.descripcion=input;
      return pre
    })
  }
  const confirmar= ()=>{
    gasto.categoria_id=cat;
    /*subir info a DB*/
    alert("Info: Monto="+gasto.monto+", cuotas="+gasto.cant_cuotas+", categoria="+gasto.categoria_id+", comentario="+gasto.descripcion); /*temporal: chequear que se cargó bien*/
    router.navigate({pathname:"/nuevo",params:{}}) /*volver a inicio para que se actualice el saldo total*/
  } 
   
function nombre_categoria() {
  let categoria=todasCategorias.find((element) => element.value == gasto.categoria_id) ;
  return categoria == undefined ? "Otros" : categoria.label
}

    
  return (
    <View style={[{flex: 1},estilos.centrado]} >
      <Text style={estilos.titulo}>Agregar gasto</Text>
      <TextInput style={estilos.textInput} onChangeText={handler_Amount}  placeholder='Ingresar valor'></TextInput>
      
      <Text style={estilos.subtitulo}>Cuotas</Text>
      <TextInput style={estilos.textInput} onChangeText={handler_Cuotas}  placeholder='Ingresar cuotas'></TextInput>
      
      <Text style={estilos.subtitulo}>Categoría</Text> 
      <DropDownPicker style={[{maxWidth:"60%"},estilos.textInput,estilos.margen]} open={openPicker} value={cat} items={todasCategorias} setOpen={setOpen} setValue={setCat}   />

      <Text style={estilos.subtitulo}>Aclaración/Comentario</Text>
      <TextInput style={estilos.textInput} onChangeText={handler_Comentario} ></TextInput>
      
      <Pressable onPress={confirmar} style={[estilos.tarjeta, estilos.centrado,colores.botones, {maxHeight:50}]}><Text style={estilos.subtitulo}>Confirmar</Text></Pressable>
    </View>
  );
 
}