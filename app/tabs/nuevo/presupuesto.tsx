import {Pressable, Text, TextInput, ScrollView, View } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import { useState } from "react";
import { useUserContext } from "@/context/UserContext"; 
import { router } from "expo-router";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type Presupuesto = { descripcion: string, montoTotal : number,cant_cuotas : number, 
                    fecha_objetivo: string, total_acumulado: number,user_id: number}

export default function Presupuesto() {
    const context =useUserContext();
    const [presupuesto,setPresupuesto] =useState<Presupuesto>({descripcion:"",montoTotal:0,cant_cuotas:0,fecha_objetivo: (new Date()).toISOString(),total_acumulado:0,user_id:context.id});
    const [fecha,setFecha]= useState(new Date())
    const handler_descripcion = (input:string)=>{
        setPresupuesto(pre=>{
            pre.descripcion=input;
            return pre
        })
    }
    const handler_monto = (input:string)=>{
        let aux=Number(input.replace(",","."));
        if( Number.isNaN(aux)){
        alert("El valor ingresado debe ser un número");
        } else {
            setPresupuesto(pre=>{
                pre.montoTotal=aux;
                return pre
            })}
    }
    const handler_cuotas = (input:string)=>{
        let aux=Number(input.replace(",","."));
        if( Number.isNaN(aux)){
        alert("El valor ingresado debe ser un número");
        } else {
            setPresupuesto(pre=>{
                pre.cant_cuotas=aux;
                return pre
            })}
    }
    const onChangeDate=(event:DateTimePickerEvent, selectedDate:Date|undefined) => {
        let currentDate = new Date(0);
        if (selectedDate!=undefined) currentDate=selectedDate
        setFecha(currentDate);
      };

    const confirmar = async ()=>{
        presupuesto.fecha_objetivo=fecha.toISOString()
        presupuesto.user_id=context.id;
        presupuesto.total_acumulado=0;
        try {
            const rsp = await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/presupuestos/`,{
                method:'POST',
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(presupuesto)})
        
            if (!rsp.ok){
                throw new Error
            }
            alert("Operación exitosa");
            router.dismiss();
            router.replace("/tabs");}
        catch (e){
            alert(e)
        }  
    }


    return (
        <View style={[estilos.mainView,{alignItems:"center"}]}>
        <ScrollView contentContainerStyle={[estilos.mainView,{alignItems:"center"}]} automaticallyAdjustKeyboardInsets={true} >
            <Text style={estilos.titulo}>Agregar presupuesto</Text>
            <TextInput style={[estilos.textInput,estilos.poco_margen]} keyboardType="decimal-pad" onChangeText={handler_monto}  placeholder='Ingresar valor'></TextInput>
                
            <Text style={estilos.subtitulo}>Cuotas</Text>
            <TextInput style={[estilos.textInput,estilos.poco_margen]}  keyboardType="number-pad" onChangeText={handler_cuotas}  placeholder='Ingresar cuotas'></TextInput>

            <Text style={estilos.subtitulo}>Descripción</Text>
            <TextInput style={[estilos.textInput,estilos.poco_margen]} keyboardType="default" onChangeText={handler_descripcion}></TextInput>

            <Text style={estilos.subtitulo}>Fecha objetivo:</Text>
            <DateTimePicker style={estilos.margen} value={fecha} onChange={onChangeDate} mode="date" />

            <Pressable onPress={confirmar} style={[estilos.tarjeta, estilos.centrado,colores.botones, {maxHeight:50}]}><Text style={estilos.subtitulo}>Confirmar</Text></Pressable>
        </ScrollView>
        </View>
    );
}
