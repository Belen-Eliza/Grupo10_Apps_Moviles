import React, { useState } from 'react';
import {
  View,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TokenInput from './TokenInput';
import { Link } from 'expo-router';
import { estilos } from '@/components/global_styles';
import { navigate } from 'expo-router/build/global-state/routing';
import Toast from 'react-native-toast-message';

const PasswordRecovery = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalTokenVisible, setModalTokenVisible] = useState(false);
  const [modalPasswordVisible, setModalPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const handleEmailSubmit = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/password/password-recovery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Error response:', errorMessage);
        throw new Error(`Error: ${response.status} - ${errorMessage}`);
      }

      const data = await response.json();
      setIsLoading(false);

      if (response.ok) {
        Alert.alert(
          'Email Sent',
          'Please check your email for the verification token.',
          [{ text: 'OK', onPress: () => setModalTokenVisible(true) }]
        );
      } else {
        Alert.alert('Error', data.message || 'Failed to send recovery email.');
      }
    } catch (error: any) {
      setIsLoading(false);
      if (error.message) {
        Alert.alert('Error in email submission: user not found');
      } else {
        Alert.alert('Error', 'Unable to connect to the server.');
      }
    }
  };

  const handleTokenSubmit = async () => {
    if (token.length !== 6) {
      Alert.alert('Error', 'Please enter a 6-digit token.');
      return;
    }
    console.log("1")
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/password/verify-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token }),
      });
      console.log(JSON.stringify(response,null,2))
      console.log(token)
      console.log("1")
      console.log(response.status)
      if (response.status === 200) {
        Alert.alert('Valid Token', 'You can now proceed to change your password.', [
          {
            text: 'OK',
            onPress: () => {
              setModalTokenVisible(false);
              setModalPasswordVisible(true);
            },
          },
        ]);
      } else {
        Alert.alert('Invalid Token.');
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          Alert.alert('Error', 'The entered token is incorrect.');
        } else if (error.response.status === 404) {
          Alert.alert('Error', 'No token found for this user.');
        } else {
          Alert.alert('Error', 'Something went wrong. Please try again.');
        }
      } else {
        Alert.alert('Error', 'Unable to connect to the server. Please check your network.');
      }
    }
  };

const handleChangePassword = async () => {
  if (newPassword.length < 8) {
    Alert.alert('Error', 'Password must be at least 8 characters long.');
    return;
  }

  const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
  if (!specialCharacterRegex.test(newPassword)) {
    Alert.alert('Error', 'Password must include at least one special character.');
    return;
  }

  if (newPassword !== confirmPassword) {
    Alert.alert('Error', 'Passwords do not match.');
    return;
  }

  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/password/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword, token }),
    });

    const data = await response.json();

    if (response.ok) {
      Alert.alert('Success!', 'Your password has been updated.', [
        { text: 'OK', onPress: () => setModalPasswordVisible(false) },
      ]);
    } else {
      Alert.alert('Error', data.message || 'Failed to change password.');
    }
  } catch (error) {
    console.error('Error changing password:', error);
    Alert.alert('Error', 'Unable to connect to the server.');
  }
};


  const renderButton = (title: string, onPress: () => void, isSecondary = false) => (
    <TouchableOpacity
      style={[styles.button, isSecondary && styles.secondaryButton]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, isSecondary && styles.secondaryButtonText]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons name="lock-closed-outline" size={64} color="#004993" />
            <Text style={styles.title}>Password Recovery</Text>
          </View>
        
          <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={24} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          textContentType="emailAddress"
                          keyboardType="email-address"
                          value={email}
                          onChangeText={setEmail}
                          placeholder="Correo electrónico"

                          placeholderTextColor="#999"
                        />
                      </View>
          {renderButton(isLoading ? 'Sending...' : 'Send Recovery Email', handleEmailSubmit)}
          <View style={styles.signupContainer}>
          <Link href="/" style={styles.signupLink}>
                          <Text style={estilos.linkText}>Volver al log-in</Text>
                        </Link>
                        </View>
          {isLoading && <ActivityIndicator style={styles.loader} color="#004993" />}

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalTokenVisible}
            onRequestClose={() => setModalTokenVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Verify Token</Text>
                <Text style={styles.modalSubtitle}>Enter the 6-digit code sent to your email</Text>
                <TokenInput
                  value={token}
                  onChange={setToken}
                  cellCount={6}
                />
                {renderButton('Verify', handleTokenSubmit)}
                {renderButton('Re-send Token', handleEmailSubmit)}
                {renderButton('Cancel', () => setModalTokenVisible(false), true)}
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalPasswordVisible}
            onRequestClose={() => setModalPasswordVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Change Password</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="New password"
                    secureTextEntry={!showPassword}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholderTextColor="#666"
                  />
                
                  <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                  <Ionicons
                                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                                    size={24}
                                    color="#666"
                                  />
                  </Pressable>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirm password"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholderTextColor="#666"
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                  <Ionicons
                                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                                    size={24}
                                    color="#666"
                                  />
                  </Pressable>
                </View>
                {renderButton('Change Password', handleChangePassword) }
                {renderButton('Cancel', () => setModalPasswordVisible(false), true)}
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004993',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  signupLink: {
    marginLeft: 5,
  },
  content: {
    backgroundColor: "'rgba(255, 255, 255, 0.8)'",
    borderRadius: 10,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#004993',
    marginTop: 10,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
button: {
  backgroundColor: '#007AFF',
  borderRadius: 10,
  height: 50,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 20,
  width: '75%',
  minWidth: 200,
},

  linkText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#aeffff',
  },
  secondaryButtonText: {
    color: '#004993',
     width: '75%',
  minWidth: 200,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#004993',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  loader: {
    marginTop: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#0082bf',
    borderRadius: 5,
    padding: 15,
    fontSize: 16,
    color: '#004993',
  },
});

export default PasswordRecovery;

