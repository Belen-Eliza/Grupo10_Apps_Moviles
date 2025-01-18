import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { estilos } from "@/components/global_styles";
import { Gasto,Ingreso,Presupuesto } from "./tipos";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

function renderGasto ( item : Gasto)  {
  const fecha = new Date(item.fecha);
  /* Los meses se guardan de 0 a 11*/
    return (
      <View  style={[estilos.list_element,estilos.thinGrayBottomBorder,estilos.fila_espaciada]}>
        <View style={styles.view_fecha}>
          <Text style={styles.texto_fecha}> {fecha.getDate()}/{fecha.getMonth()+1}/{fecha.getFullYear()}</Text> 
        </View>
        
        <View style={{flex: 3}}>
          <Text style={{fontSize:18, marginTop:20}}> {item.category.name}</Text>
          <Text style={styles.texto_centro}> {item.description}</Text>
        </View>
        <View style={styles.view_monto}>
          <Text style={styles.texto_monto}> ${item.monto}</Text>
        </View>
        
      </View>)
  }; 

  function renderIngreso ( item : Ingreso)  {
    const fecha = new Date(item.fecha);
    return (
      <View style={[estilos.list_element,estilos.thinGrayBottomBorder,estilos.fila_espaciada]}>
        <View style={styles.view_fecha}>
          <Text style={styles.texto_fecha}> {fecha.getDate()}/{fecha.getMonth()+1}/{fecha.getFullYear()}</Text>
        </View>
        <View style={{flex: 3}}>
          <Text style={{fontSize:18, marginTop:20}}> {item.category.name}</Text>
          <Text style={styles.texto_centro}> {item.description}</Text>
        </View>
        <View style={styles.view_monto}>
          <Text style={styles.texto_monto}> ${item.monto}</Text>
        </View>
      </View>)
}; 
function renderPresupuesto (item : Presupuesto,callback:Function)  {
  const fecha = new Date(item.fecha_objetivo);
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={()=>callback(item)}  style={[estilos.list_element,estilos.thinGrayBottomBorder,estilos.fila_espaciada]}>
        <View style={styles.view_fecha}>
          <Text> Para: {fecha.getDate()}/{fecha.getMonth()+1}/{fecha.getFullYear()}</Text>
        </View>
        <View style={{flex: 3}}>
          <Text style={{fontSize:18}}>{item.descripcion}</Text>
        </View>
        <Text>Total: ${item.montoTotal}</Text>
        <MaterialIcons name="arrow-forward-ios" style={{marginLeft:5}} size={20} color="#007AFF" />
      </TouchableOpacity>)};



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