import { ImageBackground, Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import { Modal } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import { useUserContext } from "@/context/UserContext";
import { useState } from "react";
import { Redirect } from "expo-router";

export default function Index() {
  const user = useUserContext();
  const [modalVisible,setModalVisible]= useState(false);
  const [nombre,handler_name]=useState<string>();
  const [mail,handler_mail]=useState<string>();
  const [pass,handler_password]=useState<string>()

  const editar_perfil= ()=>{
    setModalVisible(true)
  }
  const confirmar = ()=>{
    if (nombre!=undefined) user.cambiarNombre(nombre);
    if (mail!=undefined) user.cambiar_mail(mail);
    if (pass!=undefined) user.cambiar_password(pass);
    setTimeout( ()=> user.actualizar_info(user.id),200)
   ;
    setModalVisible(false);
    
  }
  
  return (
    
    <View style={[{
      flex: 1,
      flexWrap: "wrap",
      width: "100%"
    },estilos.centrado,colores.fondo]}>
      {!user.isLoggedIn ? <Redirect href='/'></Redirect>:
      <View>
      <View style={[{flex:1, borderBottomWidth: 3,borderBottomColor:"black"},estilos.centrado]} >
        <Text style={estilos.titulo}>Bienvenido, {user.nombre}</Text>
      </View>
        
      <View style={{flex: 3, alignItems:"center",justifyContent:"space-evenly"}}>
        <Text style={estilos.subtitulo} >Su balance actual es: </Text>
        <Text style={estilos.titulo}>${user.saldo}</Text>
        <Pressable style={[estilos.tarjeta,colores.botones,estilos.centrado]} onPress={editar_perfil}><Text style={estilos.subtitulo}>Editar perfil</Text></Pressable>
        <Pressable style={[estilos.tarjeta,colores.botones,estilos.centrado]} onPress={user.logout}><Text style={estilos.subtitulo}>Cerrar sesión</Text></Pressable>
      </View>
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
    <ImageBackground source={require('@/assets/images/fondo.jpg')} style={estilos.background}>
        <View style={estilos.formContainer}>
            <Text style={estilos.subtitulo}>Nuevo nombre</Text>
            <TextInput
                style={[estilos.textInput, estilos.margen]}
                value={nombre}
                keyboardType="default"
                onChangeText={handler_name}
                defaultValue={user.nombre}
            />

            <Text style={estilos.subtitulo}>Nuevo mail</Text>
            <TextInput
                style={[estilos.textInput, estilos.margen]}
                value={mail}
                keyboardType="email-address"
                onChangeText={handler_mail}
                defaultValue={user.mail}
            />

            <Text style={estilos.subtitulo}>Nueva contraseña</Text>
            <TextInput
                style={[estilos.textInput, estilos.margen]}
                value={pass}
                keyboardType="default"
                onChangeText={handler_password}
                secureTextEntry={true}
                textContentType="password"
            />

            <Pressable style={[estilos.tarjeta, colores.botones, estilos.centrado, { maxHeight: 50 }]}
                onPress={confirmar}
            >
                <Text style={estilos.subtitulo}>Confirmar</Text>
            </Pressable>
        </View>
    </ImageBackground>
</Modal>
      </View>}
    </View>
  );
}
