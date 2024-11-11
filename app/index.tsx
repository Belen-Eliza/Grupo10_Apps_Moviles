import {Pressable, ScrollView, Text, TextInput, View } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import { useState, useEffect, useContext } from "react";
import { Link } from "expo-router";
import { router } from "expo-router";
import { useUserContext } from "@/context/UserContext";

type User = {id: number,mail:string,name:string,password:string,saldo:number}

export default function Login(){
    const [mail,setMail]=useState('');
    const [password,setPassword] = useState('')
    const {login_app} =useUserContext()

    async function login(){
        const user={email:mail,password_attempt:password}
        try {
            const rsp = await  fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/users/login`,{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify(user)})
            if (!rsp.ok){
                
                if (rsp.status==400) throw new Error("Usuario o contraseña incorrectos")
                
                throw new Error()
            } else {
                const datos_usuario: User = await rsp.json()
                login_app(datos_usuario);
                //pantalla de loading
                router.replace("/tabs/");
                
            }
        }
        catch(error){
            alert(error)
        }
        
    }

    return(
        <View style={[estilos.mainView,estilos.centrado]}>
            <ScrollView contentContainerStyle={[estilos.mainView,{alignItems:"center"}]} automaticallyAdjustKeyboardInsets={true}>
                <Text style={estilos.titulo}>Mail</Text>
                <TextInput style={[estilos.textInput]} textContentType="emailAddress" keyboardType="email-address" onChangeText={setMail} value={mail}  placeholder='mail@example.com'></TextInput>

                <Text style={estilos.titulo}>Contraseña</Text>
                <TextInput style={[estilos.textInput]} secureTextEntry={true}  textContentType="password" onChangeText={setPassword}  value={password}></TextInput>

                <Pressable onPress={login} style={[estilos.tarjeta, estilos.centrado,colores.botones, {maxHeight:50}]}><Text style={estilos.subtitulo}>Ingresar</Text></Pressable>
                
                <Link href='/signup' style={estilos.margen}><Text>¿No tienes un usuario? Click aquí para registrarte</Text></Link>
            </ScrollView>
        </View>
    )
}