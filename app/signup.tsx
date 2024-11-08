import {Pressable, Text, TextInput, View } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import { useState } from "react";
import { Link } from "expo-router";
import { router } from "expo-router";
import { useUserContext } from "@/context/UserContext";

type User = {id: number,mail:string,name:string,password:string,saldo:number}

export default function Signup(){
    const context = useUserContext();
    const [mail,setMail] =useState('');
    const [name,SetName]= useState('');
    const [password1,setPassword]= useState('')
    const [password2,setPassword2]= useState('')

    async function signup (){
        
        if (password1==password2){
            const user = {mail:mail,name:name,password:password1}
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/users/signup`,{
                    method:'POST',
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify(user)});
                if (!response.ok) {
                    throw new Error
                } else {
                    //pantalla de loading
                    const datos_usuario: User = await response.json()
                    context.login_app(datos_usuario)
                    router.navigate('/home');}
            } catch (error) {
                alert("Error:"+error)
            }
        }
        else {
            alert("Las contraseñas deben ser iguales")
        }
    }
    return(
        <View style={[estilos.mainView,{alignItems:"center"}]}>
        <Text style={[estilos.subtitulo,{marginTop:5}]}>Mail</Text>
        <TextInput style={[estilos.textInput,{marginTop:5}]} textContentType="emailAddress" keyboardType="email-address" onChangeText={setMail} value={mail}  placeholder='mail@example.com'></TextInput>

        <Text style={estilos.subtitulo}>Nombre de usuario</Text>
        <TextInput style={[estilos.textInput,{marginTop:5}]}  onChangeText={SetName} value={name}  ></TextInput>

        <Text style={estilos.subtitulo}>Contraseña</Text>
        <TextInput style={[estilos.textInput,{marginTop:5}]} secureTextEntry={true}  textContentType="password" onChangeText={setPassword}  value={password1}></TextInput>

        <Text style={estilos.subtitulo}>Confirmar contraseña</Text>
        <TextInput style={[estilos.textInput,{marginTop:5}]} secureTextEntry={true}  textContentType="password" onChangeText={setPassword2}  value={password2}></TextInput>

        <Pressable onPress={signup} style={[estilos.tarjeta, estilos.centrado,colores.botones, {maxHeight:50}]}><Text style={estilos.subtitulo}>Ingresar</Text></Pressable>
        
        <Link href='/' style={estilos.margen}><Text>¿Ya tienes un usuario? Click aquí para ingresar</Text></Link>
        
    </View>
    )
}