import { View, Pressable, Text, StyleSheet } from "react-native";
import { estilos,colores } from "@/components/global_styles";

import Ionicons from '@expo/vector-icons/Ionicons'

function Boton(props: { texto: string, callback :Function}){
    
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
            <Pressable onPress={()=>props.callback()} style={estilos.centrado} >
                <Text style={[estilos_priv.texto,estilos.centrado]}>{props.texto}</Text>
            </Pressable>
        </View>
            
    )
}

function IconButton (props:{icon_name:string,callback:Function}){
    return(
        <View>
            <Pressable>
                <Ionicons/>
            </Pressable>
        </View>
    )
}


export  {Boton,IconButton};