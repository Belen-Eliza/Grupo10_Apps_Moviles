import { StyleSheet } from "react-native";


export const estilos = StyleSheet.create({
    estilo1: {
        flex: 1
    },
    centrado:{
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        alignSelf: "center"
    },
    titulo:{
        fontSize: 30,
        fontWeight: "bold",
        
    },
    subtitulo: {
        fontSize: 25,
        fontWeight: "semibold"
    }
});

export const colores = StyleSheet.create({
    fondo: {
        backgroundColor: "white",
    },
    botones: {
        backgroundColor: "lightblue",
        borderColor: "#0082bf",
        borderWidth: 3,
        borderRadius: 5
    },
    menu: {
        backgroundColor: "#aeffff",
        borderRadius: 10
    }
})

