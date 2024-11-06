import {Pressable, Text, TextInput, View } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import { useState, useEffect, useContext } from "react";
import { Link } from "expo-router";
import { router } from "expo-router";


type User = {id: number,mail:String,name:String,password:String,saldo:Number}
export default function Login(){
    const [mail,setMail]=useState('');
    const [password,setPassword] = useState('')

    async function login(){
        const user={email:mail,password_attempt:password}
        try {
            const rsp = await  fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/users/login`,{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify(user)})
            if (!rsp.ok){
                throw new Error(rsp.statusText)
            } else {
                const datos_usuario = await rsp.json()
                console.log(datos_usuario);
                router.navigate("/home")
            }
        }
        catch(error){
            alert(error)
        }
        
        
        
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