import React, { useState } from 'react';
import {
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
  
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Link, Redirect, router, useLocalSearchParams } from 'expo-router';
import { useUserContext } from '@/context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import{estilos,colores} from "@/components/global_styles"
import { RootSiblingParent } from 'react-native-root-siblings';
import {success_alert,error_alert} from '@/components/my_alert';
import { useNavigation } from '@react-navigation/native';

export default function Index() {
  const user = useUserContext();
  const navigation = useNavigation();
  const {msg=false,error=false} = useLocalSearchParams();
  if (msg){
    console.log(msg)
    
    if (!error)   success_alert(msg.toString());
    else  error_alert(msg.toString())
  }


  if (!user.isLoggedIn) {
    return <Redirect href="/" />;
  }
 
  
  return (
    <RootSiblingParent>
    <View style={[estilos.mainView,colores.fondo_azul,estilos.background2]}>
      <View style={[styles.container,{marginTop:"20%"}]}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Bienvenido,</Text>
          <Text style={styles.nameText}>{user.nombre}</Text>
        </View>
        

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Su balance actual es:</Text>
          <Text style={styles.balanceAmount}>${user.saldo}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Link href="/tabs/home/editar_perfil" asChild>
          <Pressable style={styles.button} >
            <Ionicons name="person-outline" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Editar perfil</Text>
          </Pressable>
          </Link>
          <Pressable style={styles.button} onPress={user.logout}>
            <Ionicons name="log-out-outline" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Cerrar sesión</Text>
          </Pressable>
        </View>

      </View>
    </View>
    </RootSiblingParent>
  );
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
    minWidth: Dimensions.get("window").width*0.7
  },
  modalForm: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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

