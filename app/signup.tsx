import { Pressable, Text, TextInput, View, ScrollView } from "react-native";
import { estilos, colores } from "@/components/global_styles";
import { useState } from "react";
import { Link } from "expo-router";
import { router } from "expo-router";
import { useUserContext } from "@/context/UserContext";

type User = { id: number; mail: string; name: string; password: string; saldo: number };

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


    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorEmail('El formato del email no es válido');
            return false;
        } else {
            setErrorEmail('');
            return true;
        }
    };


    const validatePassword = (password: string) => {
        const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!passwordRegex.test(password)) {
            setErrorPassword('La contraseña debe tener al menos 8 caracteres y un carácter especial');
            return false;
        } else {
            setErrorPassword('');
            return true;
        }
    };


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
        validateEmail(text);
    };

    const handleNameChange = (text: string) => {
        setName(text);
        setErrorName(text ? '' : 'El nombre de usuario no puede estar vacío');
    };

    const handlePasswordChange = (text: string) => {
        setPassword1(text);
        validatePassword(text);
        validatePasswordConfirm(text, password2);
    };

    const handlePasswordConfirmChange = (text: string) => {
        setPassword2(text);
        validatePasswordConfirm(password1, text);
    };

    async function signup() {
     
        const isEmailValid = validateEmail(mail);
        const isNameValid = name !== '';
        const isPasswordValid = validatePassword(password1);
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
            alert('Corrija los errores resaltados en pantalla para la correcta creacion del usuario');
        }
    }

    return (
        <View style={[estilos.mainView, { alignItems: "center" }]}>
            <ScrollView contentContainerStyle={[estilos.mainView, { alignItems: "center" }]} automaticallyAdjustKeyboardInsets={true}>
                <Text style={[estilos.subtitulo, { marginTop: 5 }]}>Mail</Text>
                <TextInput
                    style={[estilos.textInput, { marginTop: 10}]}
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    onChangeText={handleEmailChange}
                    value={mail}
                    placeholder="mail@example.com"
                />
                {errorEmail ? <Text style={{ color: 'red' }}>{errorEmail}</Text> : null}

                <Text style={estilos.subtitulo}>Nombre de usuario</Text>
                <TextInput
                    style={[estilos.textInput, { marginTop: 5 }]}
                    onChangeText={handleNameChange}
                    value={name}
                />
                {errorName ? <Text style={{ color: 'red' }}>{errorName}</Text> : null}

                <Text style={estilos.subtitulo}>Contraseña</Text>
                <TextInput
                    style={[estilos.textInput, { marginTop: 5 }]}
                    secureTextEntry={true}
                    textContentType="password"
                    onChangeText={handlePasswordChange}
                    value={password1}
                />
                {errorPassword ? <Text style={{ color: 'red' }}>{errorPassword}</Text> : null}

                <Text style={estilos.subtitulo}>Confirmar contraseña</Text>
                <TextInput
                    style={[estilos.textInput, { marginTop: 5 }]}
                    secureTextEntry={true}
                    textContentType="password"
                    onChangeText={handlePasswordConfirmChange}
                    value={password2}
                />
                {errorPasswordConfirm ? <Text style={{ color: 'red' }}>{errorPasswordConfirm}</Text> : null}

                <Pressable onPress={signup} style={[estilos.tarjeta, estilos.centrado, colores.botones, { maxHeight: 50 }]}>
                    <Text style={estilos.subtitulo}>Registrarse</Text>
                </Pressable>
                <Link href="/" style={estilos.margen}>
                    <Text>¿Ya tienes un usuario? Click aquí para ingresar</Text>
                </Link>
            </ScrollView>
        </View>
    );
}
