import {Pressable, Text, TextInput, View } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import { useState,useEffect } from "react";
import { useUserContext } from "@/context/UserContext"; 
import DropDownPicker from 'react-native-dropdown-picker';
import { router } from "expo-router";

type Categoria= {
  id: number, descripcion: string,name:string
}
type Gasto ={
  monto: Number,  category_id: number, cant_cuotas: number,user_id:number
}


export default function Gasto() {
  const inicial: Gasto = {monto: 0,category_id:0,cant_cuotas:1,user_id:0};
  const [gasto,setGasto]=useState(inicial);
  const [openPicker,setOpen] = useState(false);
  const [cat,setCat] =useState(0);
  const context = useUserContext();
  
  const [categorias,setCategorias]=useState<Categoria[]>([{id: 1,name:"Comida",descripcion:""}])
  useEffect(()=>{
    async ()=>{
      fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/categorias/de_gastos`,{
        method:'GET',
        headers:{"Content-Type":"application/json"}})
      .then(rsp =>rsp.json())
      .then(info =>setCategorias(info))
    }

  },[context])
  
  const handler_Amount=(input:string)=>{
    let aux=Number(input.replace(",","."));
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
    
    setGasto(pre=>{
      pre.cant_cuotas=aux;
      return pre
    })
    
  }

  const confirmar= async ()=>{
    gasto.category_id=cat;
    gasto.user_id= context.id;
    /*subir info a DB*/
    try {
    const rsp = await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/gastos/`,{
      method:'POST',
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(gasto)})

    if (!rsp.ok){
      throw new Error
    }
    router.navigate({pathname:"/tabs",params:{}})}
    catch (e){
      alert(e)
    }
  } 
    
  return (
    <View style={[{flex: 1},estilos.centrado]} >
      <Text style={estilos.titulo}>Agregar gasto</Text>
      <TextInput style={[estilos.textInput,estilos.margen]} keyboardType="numbers-and-punctuation" onChangeText={handler_Amount}  placeholder='Ingresar valor'></TextInput>
        
      
      <Text style={estilos.subtitulo}>Cuotas</Text>
      <TextInput style={[estilos.textInput,estilos.margen]}  keyboardType="numbers-and-punctuation" onChangeText={handler_Cuotas}  placeholder='Ingresar cuotas'></TextInput>
      
      <Text style={estilos.subtitulo}>Categoría</Text> 
      <DropDownPicker style={[{maxWidth:"60%"},estilos.textInput,estilos.margen]} open={openPicker} value={cat} items={categorias.map(e=>{return {cod:e.id,label:e.name}})} setOpen={setOpen} setValue={setCat} />

      <Pressable onPress={confirmar} style={[estilos.tarjeta, estilos.centrado,colores.botones, {maxHeight:50}]}><Text style={estilos.subtitulo}>Confirmar</Text></Pressable>
    </View>
  );
 
}