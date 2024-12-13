import React, { useState } from 'react';
import {
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Link, Redirect, router, useLocalSearchParams } from 'expo-router';
import { useUserContext } from '@/context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import{estilos,colores} from "@/components/global_styles"
import { validatePassword,validateEmail } from "@/components/validations";
import { RootSiblingParent } from 'react-native-root-siblings';
import {success_alert,error_alert} from '@/components/my_alert';

export default function Editar(){
    const user = useUserContext();
    const [modalVisible,setModalVisible]= useState(false);
    const [nombre,handler_name]=useState<string>();
    const [mail,handler_mail]=useState<string>();
    const [pass,handler_password]=useState<string>()
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorName,setErrorName] = useState('');

    const cancelar = ()=>{
        handler_name(undefined);
        handler_mail(undefined);
        handler_password(undefined);
        setErrorEmail("");
        setErrorPassword("");
        setErrorName("");
        setModalVisible(false);
    }

    const confirmar = ()=>{
      let exito = false;

      if (nombre!=undefined ) {
        if (nombre !== '')  {
          user.cambiarNombre(nombre); 
          exito=true;
        }
        else  error_alert("El nombre no puede estar vacío");
      }
      if (mail!=undefined) {
        if (validateEmail(mail).status) {
          user.cambiar_mail(mail);
          exito=true;
        } else  error_alert("Formato inválido de mail");
      }
      if (pass!=undefined) {
        if (validatePassword(pass).status) {
          user.cambiar_password(pass);
          exito=true;
        }
        else error_alert("Contraseña inválida");
      }
      setTimeout( ()=> user.actualizar_info(user.id),200);
      setModalVisible(false);
      if (exito) {
        router.navigate({pathname:"/tabs/home/",params:{msg:"Operación exitosa"}}); 
      }
    }
    
    const handleEmailChange = (text: string) => {
      setErrorEmail(validateEmail(text).msj);
      handler_mail(text);
    };

    const handlePasswordChange = (text: string) => {
      setErrorPassword(validatePassword(text).msj);
      handler_password(text);
    };

    const handleNameChange=(text:string)=>{
      if (text == '')  {
        setErrorName("El nombre no puede estar vacío");
      }
      handler_name(text)
    }
    
    return(
        <View style={estilos.centrado}>
          <ScrollView contentContainerStyle={[styles.modalContent]} automaticallyAdjustKeyboardInsets={true}>
              <View style={styles.modalForm}>
                <Text style={styles.modalTitle}>Editar Perfil</Text>

                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={24} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={nombre}
                    onChangeText={handleNameChange}
                    placeholder="Nuevo nombre"
                    placeholderTextColor="#999"
                  />
                </View>
                {errorName ? <Text style={styles.errorText}>{errorName}</Text> : null}

                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={24} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={mail}
                    onChangeText={handleEmailChange}
                    placeholder="Nuevo email"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                  />
                </View>
                {errorEmail ? <Text style={styles.errorText}>{errorEmail}</Text> : null}

                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={pass}
                    onChangeText={ handlePasswordChange}
                    placeholder="Nueva contraseña"
                    placeholderTextColor="#999"
                    secureTextEntry={true}
                  />
                </View>
                {errorPassword ? <Text style={styles.errorText}>{errorPassword}</Text> : null}

                <Pressable style={estilos.confirmButton} onPress={confirmar}>
                  <Text style={estilos.confirmButtonText}>Confirmar</Text>
                </Pressable>

                <Link href="/tabs/home" asChild>
                  <Pressable style={styles.cancelButton} onPress={cancelar}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </Pressable>
                </Link>
                
              </View>
            </ScrollView>
          {/* <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <ScrollView contentContainerStyle={styles.modalContent} automaticallyAdjustKeyboardInsets={true}>
              <View style={styles.modalForm}>
                <Text style={styles.modalTitle}>Editar Perfil</Text>

                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={24} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={nombre}
                    onChangeText={handleNameChange}
                    placeholder="Nuevo nombre"
                    placeholderTextColor="#999"
                  />
                </View>
                {errorName ? <Text style={styles.errorText}>{errorName}</Text> : null}

                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={24} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={mail}
                    onChangeText={handleEmailChange}
                    placeholder="Nuevo email"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                  />
                </View>
                {errorEmail ? <Text style={styles.errorText}>{errorEmail}</Text> : null}

                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={pass}
                    onChangeText={ handlePasswordChange}
                    placeholder="Nueva contraseña"
                    placeholderTextColor="#999"
                    secureTextEntry={true}
                  />
                </View>
                {errorPassword ? <Text style={styles.errorText}>{errorPassword}</Text> : null}

                <Pressable style={estilos.confirmButton} onPress={confirmar}>
                  <Text style={estilos.confirmButtonText}>Confirmar</Text>
                </Pressable>

                <Pressable style={styles.cancelButton} onPress={cancelar}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </Pressable>
              </View>
            </ScrollView>
          </KeyboardAvoidingView> */}
        </View>
    )
}


const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: '100%',
      height: '100%',
      
    },
    container: {
      flex: 1,
      padding: 20,
    },
    header: {
      marginTop: 40,
      marginBottom: 20,
      alignItems: 'center',
    },
    welcomeText: {
      fontSize: 24,
      color: 'white',
    },
    nameText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#409fff',
    },
    balanceContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      marginBottom: 30,
    },
    balanceLabel: {
      fontSize: 18,
      color: '#666',
      marginBottom: 10,
    },
    balanceAmount: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#007AFF',
    },
    buttonContainer: {
      marginTop: 20,
    },
    button: {
      backgroundColor: '#007AFF',
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 15,
      marginBottom: 15,
    },
    buttonIcon: {
      marginRight: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      flexGrow: 1,
      justifyContent: 'center',
      minWidth: Dimensions.get("window").width*0.7,
      opacity:1,
    },
    modalForm: {
      backgroundColor: 'rgb(255, 255, 255)',
      borderRadius: 20,
      padding: 20,
      width: Dimensions.get("window").width*0.9,
      alignSelf: 'center',
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
      textAlign: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      marginBottom: 15,
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      height: 50,
      fontSize: 16,
      color: '#333',
    },
    errorText: {
      color: '#ff3b30',
      fontSize: 12,
      marginBottom: 10,
    },
    
    cancelButton: {
      backgroundColor: '#fff',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#007AFF',
      padding: 15,
      alignItems: 'center',
      marginTop: 10,
    },
    cancelButtonText: {
      color: '#007AFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  
  