import { View, Pressable, Text, StyleSheet } from "react-native";
import { estilos,colores } from "@/components/global_styles";

function Boton(props: { texto: string}){
    
    const estilos_priv = StyleSheet.create({
        tarjeta: {
            flex: 1,
            minWidth: "80%",
            maxHeight: 100,
            borderRadius: 5,
            borderWidth: 2,
            margin: 10
           },
        
        texto:{
            padding: 8,
            fontSize: 25,
            color:  "black"
        },
        
    });
    
    return(
        <View style={[estilos_priv.tarjeta,estilos.centrado, colores.botones]}>
            <Pressable style={estilos.centrado} >
                <Text style={[estilos_priv.texto,estilos.centrado]}>{props.texto}</Text>
            </Pressable>
        </View>
            
    )
}


export default Boton;