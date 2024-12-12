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
} from 'react-native';
import { Link, router } from 'expo-router';
import { useUserContext } from '@/context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { User } from "@/components/tipos";
import { validateEmail,validatePassword } from "@/components/validations";
import { estilos, colores } from "@/components/global_styles";
import{error_alert} from '@/components/my_alert';
import { RootSiblingParent } from 'react-native-root-siblings';

export default function Signup() {
    const context = useUserContext();
    const [mail, setMail] = useState('');
    const [name, setName] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorName, setErrorName] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorPasswordConfirm, setErrorPasswordConfirm] = useState('');

    const validatePasswordConfirm = (password1: string, password2: string) => {
        if (password1 !== password2) {
            setErrorPasswordConfirm('Las contraseñas deben coincidir');
            return false;
        } else {
            setErrorPasswordConfirm('');
            return true;
        }
    };

    const handleEmailChange = (text: string) => {
        setMail(text);
        setErrorEmail(validateEmail(text).msj);
    };

    const handleNameChange = (text: string) => {
        setName(text);
        setErrorName(text ? '' : 'El nombre de usuario no puede estar vacío');
    };

    const handlePasswordChange = (text: string) => {
        setPassword1(text);
        setErrorPassword(validatePassword(text).msj);
        validatePasswordConfirm(text, password2);
    };

    const handlePasswordConfirmChange = (text: string) => {
        setPassword2(text);
        validatePasswordConfirm(password1, text);
    };

    async function signup() {
        const isEmailValid = validateEmail(mail).status;
        const isNameValid = name !== '';
        const isPasswordValid = validatePassword(password1).status;
        const isPasswordConfirmValid = validatePasswordConfirm(password1, password2);

        if (isEmailValid && isNameValid && isPasswordValid && isPasswordConfirmValid) {
            const user = { mail: mail, name: name, password: password1 };
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/users/signup`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(user),
                });
                if (!response.ok) {
                  if (response.status==409) throw new Error('El usuario ya existe');
                  throw new Error('Error al registrarse');
                } else {
                    const datos_usuario: User = await response.json();
                    context.login_app(datos_usuario);
                    router.replace('/tabs/');
                }
            } catch (error) {
              error_alert(String(error));
            }
        } else {
            error_alert('Corrija los errores resaltados en pantalla para la correcta creación del usuario');
        }

    }
  

  return (
    <RootSiblingParent>
    <View style={[estilos.background2,colores.fondo_azul]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={estilos.flex1}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Crear Cuenta</Text>
            
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                onChangeText={handleNameChange}
                value={name}
                placeholder="Nombre"
                placeholderTextColor="#999"
              />
            </View>
            {errorName ? <Text style={estilos.errorText}>{errorName}</Text> : null}

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
                secureTextEntry={true}
                textContentType="newPassword"
                onChangeText={handlePasswordChange}
                value={password1}
                placeholder="Contraseña"
                placeholderTextColor="#999"
              />
            </View>
            {errorPassword ? <Text style={estilos.errorText}>{errorPassword}</Text> : null}

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                textContentType="newPassword"
                onChangeText={handlePasswordConfirmChange}
                value={password2}
                placeholder="Confirmar Contraseña"
                placeholderTextColor="#999"
              />
            </View>
            {errorPasswordConfirm ? <Text style={estilos.errorText}>{errorPasswordConfirm}</Text> : null}

            <Pressable onPress={signup} style={styles.signupButton}>
              <Text style={styles.signupButtonText}>Registrarse</Text>
            </Pressable>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
              <Link href="/" style={styles.loginLink}>
                <Text style={estilos.linkText}>Inicia sesión aquí</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
    </RootSiblingParent>
  );

}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
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
 
  signupButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    marginLeft: 5,
  },
 
});

