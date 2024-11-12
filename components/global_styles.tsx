import { StyleSheet } from "react-native";


export const estilos = StyleSheet.create({
    mainView: {
        flex: 1,
        width: "100%",
        
    },
    overlay:{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(240, 240, 240, 0.8)", 
        opacity:0.6
    },
    estilo1: {
        flex: 1
    },
    a: {
        color: '#0077cc',
        textDecorationLine: 'underline', // Esto simula el subrayado de un enlace
      },
      aActive: {
        color: '#003d66',
      },
      mainButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        backgroundColor:  "#0082bf",
        width: "55%",
        borderWidth: 1,
        borderColor: "#0082bf",
      },
      menu: {
        width: "80%",
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#0082bf",
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        overflow: "hidden", // Asegura que las opciones se alineen sin espacio
      },
      option: {
        paddingVertical: 15,
        backgroundColor: "lightblue",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "#0082bf",
      },
      lastOption: {
        borderBottomWidth: 0, // Quita el borde inferior en la última opción
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
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
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
        
        padding: 10,
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
    poco_margen:{
        margin: 21
    },
    boton1: {
        flex:1,
        padding: 10,
        borderWidth: 2,
        borderColor:"black",
        marginVertical: 10,
        backgroundColor: "#00c8c8",
    },
    list_element:{
        borderBottomColor: "black",
        borderBottomWidth: 2,
        padding: 5,
        minWidth: "100%",
        maxHeight:400
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

