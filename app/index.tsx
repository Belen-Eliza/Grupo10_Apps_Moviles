import {Pressable, Text, TextInput, View } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import { useState, useEffect, useContext } from "react";
import { Link } from "expo-router";
import { router } from "expo-router";

export default function Login(){
    const [mail,setMail]=useState('');
    const [password,setPassword] = useState('')

    const login= ()=>{
        useEffect(()=>{
            fetch('')
                .then(response=>response.json())
                .then()
        },[mail,password])
    }

    return(
        <View style={[estilos.mainView,estilos.centrado]}>
            <Text style={estilos.titulo}>Mail</Text>
            <TextInput style={[estilos.textInput]} textContentType="emailAddress" keyboardType="email-address" onChangeText={setMail} value={mail}  placeholder='mail@example.com'></TextInput>

            <Text style={estilos.titulo}>Contraseña</Text>
            <TextInput style={[estilos.textInput]} secureTextEntry={true}  textContentType="password" onChangeText={setPassword}  value={password}></TextInput>

            <Pressable onPress={login} style={[estilos.tarjeta, estilos.centrado,colores.botones, {maxHeight:50}]}><Text style={estilos.subtitulo}>Ingresar</Text></Pressable>
            
            <Link href='/signup' style={estilos.margen}><Text>¿No tienes un usuario? Click aquí para registrarte</Text></Link>
            
        </View>
    )
}