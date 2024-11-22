import React, { useState } from 'react';
import {
  ImageBackground,
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

type User = {
  id: number;
  mail: string;
  name: string;
  password: string;
  saldo: number;
};

export default function Signup() {
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorName, setErrorName] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorConfirmPassword, setErrorConfirmPassword] = useState('');
  const { login_app } = useUserContext();

  const validateName = (name: string) => {
    if (name.length < 2) {
      setErrorName('El nombre debe tener al menos 2 caracteres');
    } else {
      setErrorName('');
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorEmail('El formato del email no es válido');
    } else {
      setErrorEmail('');
    }
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorPassword('La contraseña debe tener al menos 8 caracteres y un carácter especial');
    } else {
      setErrorPassword('');
    }
  };

  const validateConfirmPassword = (confirmPass: string) => {
    if (confirmPass !== password) {
      setErrorConfirmPassword('Las contraseñas no coinciden');
    } else {
      setErrorConfirmPassword('');
    }
  };

  const handleNameChange = (text: string) => {
    setName(text);
    validateName(text);
  };

  const handleEmailChange = (text: string) => {
    setMail(text);
    validateEmail(text);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    validatePassword(text);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    validateConfirmPassword(text);
  };

  async function signup() {
    if (errorName || errorEmail || errorPassword || errorConfirmPassword) {
      alert('Por favor, corrija los errores antes de continuar.');
      return;
    }

    const user = { name, email: mail, password };

    try {
      const rsp = await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (!rsp.ok) {
        if (rsp.status == 400) throw new Error('Error en el registro. Por favor, inténtelo de nuevo.');
        throw new Error();
      } else {
        const datos_usuario: User = await rsp.json();
        login_app(datos_usuario);
        router.replace('/tabs/');
      }
    } catch (error) {
      alert(error);
    }
  }

  return (
    <ImageBackground source={require('../assets/images/fondo.jpg')} style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
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
            {errorName ? <Text style={styles.errorText}>{errorName}</Text> : null}

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
            {errorEmail ? <Text style={styles.errorText}>{errorEmail}</Text> : null}

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                textContentType="newPassword"
                onChangeText={handlePasswordChange}
                value={password}
                placeholder="Contraseña"
                placeholderTextColor="#999"
              />
            </View>
            {errorPassword ? <Text style={styles.errorText}>{errorPassword}</Text> : null}

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                textContentType="newPassword"
                onChangeText={handleConfirmPasswordChange}
                value={confirmPassword}
                placeholder="Confirmar Contraseña"
                placeholderTextColor="#999"
              />
            </View>
            {errorConfirmPassword ? <Text style={styles.errorText}>{errorConfirmPassword}</Text> : null}

            <Pressable onPress={signup} style={styles.signupButton}>
              <Text style={styles.signupButtonText}>Registrarse</Text>
            </Pressable>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
              <Link href="/login" style={styles.loginLink}>
                <Text style={styles.loginLinkText}>Inicia sesión aquí</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
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
  },
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
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginBottom: 10,
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
  loginLinkText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

