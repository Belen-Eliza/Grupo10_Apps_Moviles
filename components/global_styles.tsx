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
    subtitulo: {
        fontSize: 25,
        fontWeight: "semibold"
    },
    tarjeta: {
        flex: 1,
        minWidth: "80%",
        maxHeight: 100,
        borderRadius: 5,
        borderWidth: 2,
        margin: 10
       },
    titulo: {
        padding: 15,
        fontSize: 30,
        fontWeight: "bold",
        color:  "black",
    },
    textInput:{
        padding:8,
        backgroundColor: "white",
        fontSize:18,
        margin: "10%",
        minWidth: "60%",
        maxHeight: 60,
        borderColor: "#0538cf",
        borderRadius: 5,
        borderWidth: 2,
        flex: 1,
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

