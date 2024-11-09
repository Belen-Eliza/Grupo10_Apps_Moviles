import { StyleSheet } from "react-native";


export const estilos = StyleSheet.create({
    mainView: {
        flex: 1,
        width: "100%",
    },
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
        minHeight: 60,
        borderRadius: 5,
        borderWidth: 2,
        margin: 10,
        
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
        minHeight: 40,
        borderColor: "#0538cf",
        borderRadius: 5,
        borderWidth: 2,
        flex: 1,
    },
    margen: {
        margin: 41
    },
    boton1: {
        flex:1,
        padding: 10,
        borderWidth: 2,
        borderColor:"black",
        marginVertical: 10,
        backgroundColor: "#00c8c8"
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

