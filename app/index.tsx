import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { estilos, colores } from "@/components/global_styles";
import { useState, useContext } from "react";
import { Link } from "expo-router";
import { router } from "expo-router";

import { useUserContext } from "@/context/UserContext";

type User = { id: number; mail: string; name: string; password: string; saldo: number };

export default function Login() {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const { login_app } = useUserContext();

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

    const handleEmailChange = (text: string) => {
        setMail(text);
        validateEmail(text);
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        validatePassword(text);
    };

    async function login() {
        const user = { email: mail, password_attempt: password };

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
                router.replace("/tabs/");
            }
        } catch (error) {
            alert(error);
        }
    }

    return (
        <View style={[estilos.mainView, estilos.centrado]}>
            <ScrollView contentContainerStyle={[estilos.mainView, { alignItems: "center" }]} automaticallyAdjustKeyboardInsets={true}>
                <Text style={estilos.titulo}>Mail</Text>
                <TextInput
                    style={[estilos.textInput]}
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    onChangeText={handleEmailChange}
                    value={mail}
                    placeholder="mail@example.com"
                />
                {errorEmail ? <Text style={{ color: 'red' }}>{errorEmail}</Text> : null}

                <Text style={estilos.titulo}>Contraseña</Text>
                <TextInput
                    style={[estilos.textInput]}
                    secureTextEntry={true}
                    textContentType="password"
                    onChangeText={handlePasswordChange}
                    value={password}
                />
                {errorPassword ? <Text style={{ color: 'red' }}>{errorPassword}</Text> : null}

                <Pressable onPress={login} style={[estilos.tarjeta, estilos.centrado, colores.botones, { maxHeight: 50 }]}>
                    <Text style={estilos.subtitulo}>Ingresar</Text>
                </Pressable>

                <Link href="/signup" style={estilos.margen}>
                    <Text>¿No tienes un usuario? Click aquí para registrarte</Text>
                </Link>
            </ScrollView>
        </View>
    );
}
