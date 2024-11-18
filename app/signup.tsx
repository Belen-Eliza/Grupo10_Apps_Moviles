import { Pressable, Text, TextInput, View, ScrollView, StyleSheet, ImageBackground } from "react-native";
import { estilos, colores } from "@/components/global_styles";
import { useState } from "react";
import { Link } from "expo-router";
import { router } from "expo-router";
import { useUserContext } from "@/context/UserContext";
import { User } from "@/components/tipos";
import { validateEmail,validatePassword } from "@/components/validations";

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
                    throw new Error('Error al registrarse');
                } else {
                    const datos_usuario: User = await response.json();
                    context.login_app(datos_usuario);
                    router.replace('/tabs/');
                }
            } catch (error) {
                alert("Error: " + error);
            }
        } else {
            alert('Corrija los errores resaltados en pantalla para la correcta creación del usuario');
        }
    }

    return (
        <ImageBackground source={require('../assets/images/fondo.jpg')} style={estilos.background}>
            <View style={[estilos.formContainer,estilos.centrado,{height:700}]}>
            <ScrollView automaticallyAdjustKeyboardInsets={true} contentContainerStyle={estilos.centrado}>
                <Text style={[estilos.titulo,estilos.centrado]}>Mail</Text>
                <TextInput
                    style={[estilos.textInput,estilos.poco_margen]}
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    onChangeText={handleEmailChange}
                    value={mail}
                    placeholder="mail@example.com"
                />
                {errorEmail ? <Text style={estilos.errorText}>{errorEmail}</Text> : null}

                <Text style={estilos.titulo}>Nombre de usuario</Text>
                <TextInput
                    style={[estilos.textInput,estilos.poco_margen]}
                    onChangeText={handleNameChange}
                    value={name}
                />
                {errorName ? <Text style={estilos.errorText}>{errorName}</Text> : null}

                <Text style={estilos.titulo}>Contraseña</Text>
                <TextInput
                    style={[estilos.textInput,estilos.poco_margen]}
                    secureTextEntry={true}
                    textContentType="password"
                    onChangeText={handlePasswordChange}
                    value={password1}
                />
                {errorPassword ? <Text style={estilos.errorText}>{errorPassword}</Text> : null}

                <Text style={estilos.titulo}>Confirmar contraseña</Text>
                <TextInput
                    style={[estilos.textInput,estilos.poco_margen]}
                    secureTextEntry={true}
                    textContentType="password"
                    onChangeText={handlePasswordConfirmChange}
                    value={password2}
                />
                {errorPasswordConfirm ? <Text style={estilos.errorText}>{errorPasswordConfirm}</Text> : null}

                
            </ScrollView>
            <Pressable onPress={signup} style={[estilos.tarjeta, estilos.centrado, colores.botones, { maxHeight: 50 }]}>
                    <Text style={estilos.subtitulo}>Registrarse</Text>
                </Pressable>

                <View style={estilos.signupContainer}>
                    <Text>¿Ya tienes un usuario? </Text>
                    <Link href="/">
                        <Text style={estilos.a}>Click aquí para ingresar</Text>
                    </Link>
                </View>
            </View>
        </ImageBackground>
    );
}


