import { Pressable, Text } from "react-native";
import { estilos,colores } from "@/components/global_styles";
import { Category } from "./tipos";

type Gasto ={ id: number, monto: number, cant_cuotas:number, fecha: Date, category: Category}
type Ingreso = {id:number,monto: number,description: string,category: Category,fecha: Date}
type Presupuesto ={id: number, descripcion: string,montoTotal: number, fecha_objetivo: Date}

function renderGasto ( item : Gasto,callback:Function)  {
    return (
      <Pressable onPress={()=>callback(item)} style={[estilos.list_element,estilos.margen,estilos.centrado]}>
        <Text style={{alignSelf:"flex-start",fontSize:10,color:"#909090"}}> {new Date(item.fecha).toDateString()}</Text>
        <Text style={estilos.subtitulo}> {item.category.name}</Text>
        <Text style={{fontSize:20,color:"#909090"}}> {item.category.description}</Text>
        <Text>Monto: ${item.monto}</Text>
      </Pressable>)
  }; 

function renderIngreso ( item : Ingreso,callback:Function)  {
    return (
      <Pressable onPress={()=>callback(item)} style={[estilos.list_element,estilos.margen,estilos.centrado]}>
        <Text style={{alignSelf:"flex-start",fontSize:10,color:"#909090"}}> {new Date(item.fecha).toDateString()}</Text>
        <Text style={[estilos.subtitulo]}>{item.category.name}</Text>
        <Text style={{fontSize:20,color:"#909090"}}>{item.description}</Text>
        <Text >Monto: ${item.monto}</Text>
      </Pressable>)
}; 
function renderPresupuesto (item : Presupuesto,callback:Function)  {
    return (
      <Pressable onPress={()=>callback(item)}  style={[estilos.list_element,estilos.margen,estilos.centrado]}>
        <Text style={estilos.subtitulo}>{item.descripcion}</Text>
        <Text> Para: {new Date(item.fecha_objetivo).toDateString()}</Text>
        <Text>Total: ${item.montoTotal}</Text>
      </Pressable>)};



export {renderGasto,renderIngreso,renderPresupuesto}