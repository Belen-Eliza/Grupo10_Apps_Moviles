import {Pressable, Text, TextInput, View } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import { useState } from "react";
import { useUserContext } from "@/context/UserContext"; 
import { router } from "expo-router";
import { CategoryPicker } from "@/components/CategoryPicker";

type Gasto ={
  monto: Number,  category_id: number, cant_cuotas: number,user_id:number
}

export default function Gasto() {
  const inicial: Gasto = {monto: 0,category_id:0,cant_cuotas:1,user_id:0};
  const [gasto,setGasto]=useState(inicial);
  const [openPicker,setOpen] = useState(false);
  const [cat,setCat] =useState(0);
  const context = useUserContext();
  
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
    context.actualizar_info(context.id)
    alert("Operación exitosa");
    router.dismiss();
    router.replace("/tabs");}
    catch (e){
      alert(e)
    }
  } 
    
  return (
    <View style={[{flex: 1},estilos.centrado]} >
      <Text style={estilos.titulo}>Agregar gasto</Text>
      <TextInput style={[estilos.textInput,estilos.margen]} keyboardType="decimal-pad" onChangeText={handler_Amount}  placeholder='Ingresar valor'></TextInput>
        
      <Text style={estilos.subtitulo}>Cuotas</Text>
      <TextInput style={[estilos.textInput,estilos.margen]}  keyboardType="numbers-and-punctuation" onChangeText={handler_Cuotas}  placeholder='Ingresar cuotas'></TextInput>
      
      <Text style={estilos.subtitulo}>Categoría</Text> 
      <CategoryPicker openPicker={openPicker} setOpen={setOpen} selected_cat_id={cat} set_cat_id={setCat}></CategoryPicker>

      <Pressable onPress={confirmar} style={[estilos.tarjeta, estilos.centrado,colores.botones, {maxHeight:50}]}><Text style={estilos.subtitulo}>Confirmar</Text></Pressable>
    </View>
  );
 
}