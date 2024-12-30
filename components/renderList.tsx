import { View, Pressable, Text, StyleSheet } from "react-native";
import { estilos,colores } from "@/components/global_styles";
import { Gasto,Ingreso,Presupuesto } from "./tipos";

function renderGasto ( item : Gasto,callback:Function)  {
  const fecha = new Date(item.fecha);
    return (
      <Pressable onPress={()=>callback(item)} style={[estilos.list_element,estilos.thinGrayBottomBorder,estilos.fila_espaciada]}>
        <View style={styles.view_fecha}>
          <Text style={styles.texto_fecha}> {fecha.getDate()}/{fecha.getMonth()}/{fecha.getFullYear()}</Text>
        </View>
        
        <View style={{flex: 3}}>
          <Text style={{fontSize:18}}> {item.category.name}</Text>
          <Text style={styles.texto_centro}> {item.description}</Text>
        </View>
        <View style={styles.view_monto}>
          <Text style={styles.texto_monto}> ${item.monto}</Text>
        </View>
        
      </Pressable>)
  }; 

  function renderIngreso ( item : Ingreso,callback:Function)  {
    const fecha = new Date(item.fecha);
    return (
      <Pressable onPress={()=>callback(item)} style={[estilos.list_element,estilos.thinGrayBottomBorder,estilos.fila_espaciada]}>
        <View style={styles.view_fecha}>
          <Text style={styles.texto_fecha}> {fecha.getDate()}/{fecha.getMonth()}/{fecha.getFullYear()}</Text>
        </View>
        <View style={{flex: 3}}>
          <Text style={{fontSize:18}}> {item.category.name}</Text>
          <Text style={styles.texto_centro}> {item.description}</Text>
        </View>
        <View style={styles.view_monto}>
          <Text style={styles.texto_monto}> ${item.monto}</Text>
        </View>
      </Pressable>)
}; 
function renderPresupuesto (item : Presupuesto,callback:Function)  {
  const fecha = new Date(item.fecha_objetivo);
    return (
      <Pressable onPress={()=>callback(item)}  style={[estilos.list_element,estilos.thinGrayBottomBorder,estilos.fila_espaciada]}>
        <View style={styles.view_fecha}>
          <Text> Para: {fecha.getDate()}/{fecha.getMonth()}/{fecha.getFullYear()}</Text>
        </View>
        <View style={{flex: 3}}>
          <Text style={{fontSize:18}}>{item.descripcion}</Text>
        </View>
        <Text>Total: ${item.montoTotal}</Text>
      </Pressable>)};



const styles = StyleSheet.create({
  texto_fecha:{
    color:"#919191",
    fontSize:16
  },
  texto_centro:{
    fontSize:18,
    color:"#909090"
  },
  texto_monto: {
    alignSelf:"flex-end",
    marginRight:5,
    fontSize:16
  },
  view_fecha:{
    alignSelf:"center",
    minWidth:25,
    marginRight:30,
    flex: 1
  },
  view_monto:{
    flex: 1,
    alignSelf: "stretch",
    justifyContent:"center"
  }
})
export {renderGasto,renderIngreso,renderPresupuesto}