import { Dimensions, StyleSheet } from "react-native";


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
    flex1: {
        flex: 1
    },
    a: {
        color: '#0077cc',
        textDecorationLine: 'underline', // Esto simula el subrayado de un enlace
      },
      aActive: {
        color: '#003d66',
      },
      linkText: {
        color: '#007AFF',
        
        fontSize: 14,
        fontWeight: 'bold',
        textAlign:"center",
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
        fontSize: 20,
        fontWeight: "semibold"
    },
    tarjetasesp:{
        flex: 1,
        minWidth: "30%",
        maxHeight: 100,
        minHeight: 60,
        borderRadius: 5,
        borderWidth: 2,
        margin: 10,
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
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'cover',
    },
    background2 :{
        flex: 1,
        width: '100%',
        height: '100%',
    },
    formContainer: {
        width: '80%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        height: 500
    },
    signupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    errorText: {
        color: '#ff3b30',
        fontSize: 12,
        marginBottom: 10,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    
    poco_margen:{
        margin: 21
    },
    boton1: {
        flex:1,
        padding: 10,
        borderWidth: 2,
        borderColor:"black",
        marginBottom: 10,
        backgroundColor: "#00c8c8",
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        marginBottom: 15,
        minWidth: "90%"
    },
    buttonIcon: {
    marginRight: 10,
    },
    buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    },
    list_element:{
        paddingVertical: 25,
        paddingHorizontal: 10,
        minWidth: "100%",
        maxHeight:400,
        backgroundColor: "#ffffff"
    },
    fila_espaciada:{
      flexDirection: "row",
      justifyContent: "space-between",
    },
    show_date:{
        borderColor: "#808080",
        borderRadius: 5,
        borderWidth: 2,
        padding: 8,
        backgroundColor: "white",
        marginVertical:10 
    },
    cancelButton: {
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#007AFF',
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
        minWidth: "80%"

      },
      cancelButtonText: {
        color: '#007AFF',
        fontSize: 18,
        fontWeight: 'bold',
      },
      confirmButton: {
        backgroundColor: '#007AFF',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
        minWidth: "80%"
      },
      confirmButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
      filterContainer: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
      },
      filterTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#333333",
      },
      filterButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
      },
    modalContent: {
      flexGrow: 1,
      justifyContent: 'center',
      minWidth: Dimensions.get("window").width*0.7,
      opacity:1,
    },
    whiteModalContent: {
      backgroundColor: "#FFFFFF",
      borderRadius: 8,
      padding: 20,
      width: "80%",
      alignItems: "center",
    },
    modalForm: {
      backgroundColor: 'rgb(255, 255, 255)',
      borderRadius: 20,
      padding: 20,
      width: Dimensions.get("window").width*0.9,
      alignSelf: 'center',
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
      textAlign: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    emptyListText: {
      textAlign: "center",
      marginTop: 20,
      fontSize: 16,
      color: "#007AFF",
    },
    curvedTopBorders: {
      borderTopEndRadius:20,
      borderTopStartRadius:20
    },
    thinGrayBottomBorder:{
      borderBottomColor:"lightgray",
      borderBottomWidth: 1
    },
    ver_debug:{
      borderColor: "black",
      borderWidth: 2,
      backgroundColor: "blue"

    },
    header: {
      padding: 20,
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: "bold",
      color: '#007AFF', 
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#007AFF",
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
    },
    actionButtonText: {
      color: "#FFFFFF",
      marginLeft: 10,
      fontSize: 18,
      fontWeight: "bold",
    },
    
});

export const colores = StyleSheet.create({
    fondo: {
        backgroundColor: "white",
    },
    fondo_azul: {
        backgroundColor: "#004993",
    },
    fondo_blanco: {
      backgroundColor:"white"
    },
    fondo_azul_botones: {
      backgroundColor: "#007AFF"
    },
    texto_azul: {
      color: '#007AFF',
    },
    botones: {
        backgroundColor: "lightblue",
        borderColor: "#0082bf",
        borderWidth: 3,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#007AFF',
    },

    menu: {
        backgroundColor: "#aeffff",
        borderRadius: 10
    },
    
})

 
export const botonesEstado = {
    active: "#228B22",  // Color for active button
    inactive: "#D3D3D3" // Color for inactive button
};