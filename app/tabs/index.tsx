import { ImageBackground, Pressable, Text, TextInput, View, StyleSheet, ScrollView } from "react-native";
import { Modal } from "react-native";
import{estilos,colores} from "@/components/global_styles"
import { useUserContext } from "@/context/UserContext";
import { useState } from "react";
import { Redirect } from "expo-router";
import { validatePassword,validateEmail } from "@/components/validations";

export default function Index() {
  const user = useUserContext();
  const [modalVisible,setModalVisible]= useState(false);
  const [nombre,handler_name]=useState<string>();
  const [mail,handler_mail]=useState<string>();
  const [pass,handler_password]=useState<string>()
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  const cancelar = ()=>{
    handler_name(undefined);
    handler_mail(undefined);
    handler_password(undefined);
    setErrorEmail("");
    setErrorPassword("");
    setModalVisible(false);
  }
  const confirmar = ()=>{
    if (nombre!=undefined ) {
      if (nombre !== '')  {
        user.cambiarNombre(nombre);
        
      }
      else {
        alert("El nombre no puede estar vacío");
        handler_name(user.nombre)
      }
    }

    if (mail!=undefined) {
      if (validateEmail(mail).status) user.cambiar_mail(mail);
      else {
        alert("Formato inválido");
        handler_mail(user.mail);
        setErrorEmail("")
      }
    }
    if (pass!=undefined) {
      if (validatePassword(pass).status) user.cambiar_password(pass);
      else {
        alert("Contraseña inválida");
        handler_password("");
        setErrorPassword("")
      }
    }
    setTimeout( ()=> user.actualizar_info(user.id),200);
    setModalVisible(false)
    alert("Cambios aplicados");
  }
  const handleEmailChange = (text: string) => {
    setErrorEmail(validateEmail(text).msj);
    handler_mail(text);
    
};

const handlePasswordChange = (text: string) => {
  setErrorPassword(validatePassword(text).msj);
  handler_password(text);
    
};
  
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
        <Pressable style={[estilos.tarjeta,colores.botones,estilos.centrado]} onPress={()=> setModalVisible(true)}><Text style={estilos.subtitulo}>Editar perfil</Text></Pressable>
        <Pressable style={[estilos.tarjeta,colores.botones,estilos.centrado]} onPress={user.logout}><Text style={estilos.subtitulo}>Cerrar sesión</Text></Pressable>
      </View>

      <Modal animationType="slide" transparent={false} visible={modalVisible} onRequestClose={cancelar} >
      <ImageBackground source={require('@/assets/images/fondo.jpg')} style={estilos.background}>
      
          <View style={estilos.formContainer}>
          <Pressable onPress={cancelar} style={{alignSelf:"flex-end",padding:10,borderColor:"black",borderWidth:5}}></Pressable>{/* reemplazar por iconButton cuando esté terminado */}
            <ScrollView automaticallyAdjustKeyboardInsets={true}>
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
                  onChangeText={handleEmailChange}
                  defaultValue={user.mail}
              />
              {errorEmail ? <Text style={estilos.errorText}>{errorEmail}</Text> : null}

              <Text style={estilos.subtitulo}>Nueva contraseña</Text>
              <TextInput
                  style={[estilos.textInput, estilos.margen]}
                  value={pass}
                  keyboardType="default"
                  onChangeText={handlePasswordChange}
                  secureTextEntry={true}
                  textContentType="password"
              />
              {errorPassword ? <Text style={estilos.errorText}>{errorPassword}</Text> : null}
              
              </ScrollView>
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
