import {
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Link, router } from 'expo-router';
import { useUserContext } from '@/context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { estilos, colores } from "@/components/global_styles";
import { useEffect, useState } from "react";
import { User } from "@/components/tipos";
import { validateEmail,validatePassword } from "@/components/validations";
import{error_alert} from '@/components/my_alert';
import Toast from 'react-native-toast-message';

export default function Login() {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login_app } = useUserContext();

  useEffect( () => {
    (async ()=>  {
      const value = await AsyncStorage.getItem("token");
      if (value !== null) { 
        try {
          const rsp = await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/users/${value}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          if (!rsp.ok) {
            throw new Error();
          }
          const user = await rsp.json();
          login_app(user);
          router.replace("/tabs/home");
        } catch (error) {
          console.log(error," al regresar a la sesión");
        }
        
      }
    } )()
  }, [])

  const handleEmailChange = (text: string) => {
    setMail(text);
    setErrorEmail(validateEmail(text).msj);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setErrorPassword(validatePassword(text).msj);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function login() {
    const user = { email: mail, password_attempt: password };
    const isEmailValid = validateEmail(mail).status;
    const isPasswordValid = validatePassword(password).status;

    if (isEmailValid && isPasswordValid) {
      try {
        const rsp = await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });

        if (!rsp.ok) {
            if (rsp.status == 400) throw new Error("Usuario o contraseña incorrectos");
            throw new Error();
        } else {
            const datos_usuario: User = await rsp.json();
            login_app(datos_usuario);
            router.replace("/tabs/home");
        }
      } catch (error) {
          error_alert(String(error));
      }
    } 
  }

  return (

    
    <View style={[estilos.background2, colores.fondo_azul]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={estilos.flex1}
      >
        <ScrollView contentContainerStyle={estilos.scrollViewContent}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Iniciar Sesión</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                textContentType="emailAddress"
                keyboardType="email-address"
                onChangeText={handleEmailChange}
                value={mail}
                placeholder="Correo electrónico"
                placeholderTextColor="#999"
              />
            </View>
            {errorEmail ? <Text style={estilos.errorText}>{errorEmail}</Text> : null}

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                secureTextEntry={!showPassword}
                textContentType="password"
                onChangeText={handlePasswordChange}
                value={password}
                placeholder="Contraseña"
                placeholderTextColor="#999"
              />
              <Pressable onPress={()=> setShowPassword(!showPassword)} >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="#666"
                />
              </Pressable>
            </View>
            {errorPassword ? <Text style={estilos.errorText}>{errorPassword}</Text> : null}

            <Pressable onPress={login} style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Ingresar</Text>
            </Pressable>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>¿No tienes un usuario? </Text>
              <Link href="/signup" style={styles.signupLink}>
                <Text style={estilos.linkText}>Regístrate aquí</Text>
              </Link>
            </View>
            {/* <View style={styles.signupContainer}>
              <Link href="/password-recovery" style={styles.signupLink}>
                <Text style={estilos.linkText}>¿Olvidaste tu contraseña?</Text>
              </Link>
            </View> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast/>
      </View>
      
  );
}


const styles = StyleSheet.create({

  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
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
 
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#666',
    fontSize: 14,
  },
  signupLink: {
    marginLeft: 5,
  },

});

