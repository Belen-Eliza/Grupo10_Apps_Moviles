import { ImageBackground, Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import { estilos, colores } from "@/components/global_styles";
import { useState } from "react";
import { Link } from "expo-router";
import { router } from "expo-router";
import { useUserContext } from "@/context/UserContext";
import { User } from "@/components/tipos";
import { validateEmail,validatePassword } from "@/components/validations";

export default function Login() {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const { login_app } = useUserContext();

    const handleEmailChange = (text: string) => {
        setMail(text);
        setErrorEmail(validateEmail(text));
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        setErrorPassword(validatePassword(text));
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
        <ImageBackground source={require('../assets/images/fondo.jpg')} style={estilos.background}>
            <View style={estilos.centeredContainer}>
                <View style={estilos.formContainer}>
                    <Text style={estilos.titulo}>Mail</Text>
                    <TextInput
                        style={[estilos.textInput]}
                        textContentType="emailAddress"
                        keyboardType="email-address"
                        onChangeText={handleEmailChange}
                        value={mail}
                        placeholder="mail@example.com"
                    />
                    {errorEmail ? <Text style={estilos.errorText}>{errorEmail}</Text> : null}

                    <Text style={estilos.titulo}>Contraseña</Text>
                    <TextInput
                        style={[estilos.textInput]}
                        secureTextEntry={true}
                        textContentType="password"
                        onChangeText={handlePasswordChange}
                        value={password}
                    />
                    {errorPassword ? <Text style={estilos.errorText}>{errorPassword}</Text> : null}

                    <Pressable onPress={login} style={[estilos.tarjeta, estilos.centrado, colores.botones, { maxHeight: 50 }]}>
                        <Text style={estilos.subtitulo}>Ingresar</Text>
                    </Pressable>

                    {/* Enlace de registro dentro del formulario */}
                    <View style={estilos.signupContainer}>
                        <Text>¿No tienes un usuario? </Text>
                        <Link href="/signup">
                            <Text style={estilos.a}>Click aquí para registrarte</Text>
                        </Link>
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
}
