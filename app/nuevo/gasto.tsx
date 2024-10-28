import {Modal, Pressable, Text, TextInput, View } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import { useState } from "react";
import {Picker} from '@react-native-picker/picker';
import { router } from "expo-router";

type Categoria= {
  cod: number, descripcion: string
}
type Gasto ={
  monto: Number, descripcion: String, categoria_id: number, cant_cuotas: number
}
const todasCategorias: Categoria[] = [{cod: 1,descripcion:"Comida"},{cod: 2,descripcion:"Entretenimiento"}] /*Conectar despues con DB */
export default function Gasto() {
  const inicial: Gasto = {monto: 0,descripcion:"",categoria_id:0,cant_cuotas:1};
  const [gasto,setGasto]=useState(inicial);
  
  var pickCat=false;
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
  const handler_Categoria = (codigo:number) =>{
    setGasto(pre=>{
      pre.categoria_id=codigo;
      return pre
    })
  }
  const handler_Comentario=(input:string)=>{
    setGasto(pre=>{
      pre.descripcion=input;
      return pre
    })
  }
  const confirmar= ()=>{
    /*subir info a DB*/

    router.navigate({pathname:"/",params:{}}) /*volver a inicio para que se actualice el saldo total*/
  } 
   
function nombre_categoria() {
  let categoria=todasCategorias.find((element) => element.cod == gasto.categoria_id) ;
  return categoria == undefined ? "Otros" : categoria.descripcion
}
const sh=()=>{pickCat=true}
    
  return (
    <View style={[{flex: 1},estilos.centrado]} >
      <Text style={estilos.titulo}>Agregar gasto</Text>
      <TextInput style={estilos.textInput} onChangeText={handler_Amount}  placeholder='Ingresar valor'></TextInput>
      <Text style={estilos.subtitulo}>Cuotas</Text>
      <TextInput style={estilos.textInput} onChangeText={handler_Cuotas}  placeholder='Ingresar cuotas'></TextInput>
      <Text style={estilos.subtitulo}>Categoría</Text>
      <Pressable onPress={sh} style={[estilos.textInput,estilos.centrado]}><Text >{nombre_categoria()}</Text></Pressable>
      <Modal animationType="slide" visible={pickCat}>
        <View style={[{flex: 1},estilos.centrado]}>
        <Text style={estilos.titulo}>Seleccionar categoria</Text>
          <Picker style={{ height: 100, width: 150 }} itemStyle={{color: "black"}}  onValueChange={handler_Comentario}> 
          {todasCategorias.map(cat =>{ 
            return (<Picker.Item key={cat.cod} label={cat.descripcion} value={cat.cod} />)
          })}
          </Picker>
        </View>
      </Modal>
      
      <Text style={estilos.subtitulo}>Aclaración/Comentario</Text>
      <TextInput style={estilos.textInput} onChangeText={handler_Cuotas} ></TextInput>
      <Pressable onPress={confirmar} style={[estilos.tarjeta, estilos.centrado,colores.botones, {maxHeight:50}]}><Text style={estilos.subtitulo}>Confirmar</Text></Pressable>
    </View>
  );
 
}
 