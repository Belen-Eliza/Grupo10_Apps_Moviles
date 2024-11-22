import React, { useState } from 'react';
import {
  ImageBackground,
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Redirect } from 'expo-router';
import { useUserContext } from '@/context/UserContext';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const user = useUserContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState(user.nombre);
  const [mail, setMail] = useState(user.mail);
  const [pass, setPass] = useState('');
  const [errorNombre, setErrorNombre] = useState('');
  const [errorMail, setErrorMail] = useState('');
  const [errorPass, setErrorPass] = useState('');

  const editarPerfil = () => {
    setModalVisible(true);
  };

  const validateNombre = (name: string) => {
    if (name.length < 2) {
      setErrorNombre('El nombre debe tener al menos 2 caracteres');
    } else {
      setErrorNombre('');
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMail('El formato del email no es válido');
    } else {
      setErrorMail('');
    }
  };

  const validatePassword = (password: string) => {
    if (password && password.length < 8) {
      setErrorPass('La contraseña debe tener al menos 8 caracteres');
    } else {
      setErrorPass('');
    }
  };

  const confirmar = () => {
    if (errorNombre || errorMail || errorPass) {
      alert('Por favor, corrija los errores antes de continuar.');
      return;
    }

    if (nombre !== user.nombre) user.cambiarNombre(nombre);
    if (mail !== user.mail) user.cambiar_mail(mail);
    if (pass) user.cambiar_password(pass);
    
    setTimeout(() => user.actualizar_info(user.id), 200);
    setModalVisible(false);
  };

  if (!user.isLoggedIn) {
    return <Redirect href="/" />;
  }

  return (
    <ImageBackground source={require('@/assets/images/fondo.jpg')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Bienvenido,</Text>
          <Text style={styles.nameText}>{user.nombre}</Text>
        </View>
        
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Su balance actual es:</Text>
          <Text style={styles.balanceAmount}>${user.saldo}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={editarPerfil}>
            <Ionicons name="person-outline" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Editar perfil</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={user.logout}>
            <Ionicons name="log-out-outline" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Cerrar sesión</Text>
          </Pressable>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={styles.modalForm}>
                <Text style={styles.modalTitle}>Editar Perfil</Text>

                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={24} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={nombre}
                    onChangeText={(text) => {
                      setNombre(text);
                      validateNombre(text);
                    }}
                    placeholder="Nuevo nombre"
                    placeholderTextColor="#999"
                  />
                </View>
                {errorNombre ? <Text style={styles.errorText}>{errorNombre}</Text> : null}

                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={24} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={mail}
                    onChangeText={(text) => {
                      setMail(text);
                      validateEmail(text);
                    }}
                    placeholder="Nuevo email"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                  />
                </View>
                {errorMail ? <Text style={styles.errorText}>{errorMail}</Text> : null}

                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={pass}
                    onChangeText={(text) => {
                      setPass(text);
                      validatePassword(text);
                    }}
                    placeholder="Nueva contraseña"
                    placeholderTextColor="#999"
                    secureTextEntry={true}
                  />
                </View>
                {errorPass ? <Text style={styles.errorText}>{errorPass}</Text> : null}

                <Pressable style={styles.confirmButton} onPress={confirmar}>
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </Pressable>

                <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </Pressable>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
      </View>
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
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    color: '#333',
  },
  nameText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
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
  },
  modalForm: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
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
  confirmButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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

