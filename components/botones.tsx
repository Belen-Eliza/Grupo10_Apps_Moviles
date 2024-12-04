import { View, Pressable, Text, StyleSheet } from "react-native";
import { estilos,colores,botonesEstado } from "@/components/global_styles";
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';

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

function Alternar(props:{activo:number,callback:Function,datos:{texto:string,params_callback:number}[]}){
    return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", width: '100%', paddingHorizontal: 10 }}>
        {props.datos.map((each,index)=>{
            return(
                <Pressable key={index}
                    style={[
                        estilos.tarjetasesp,
                        estilos.centrado,
                        { 
                            flex: 1, 
                            marginHorizontal: 5, 
                            backgroundColor:  props.activo === index ? botonesEstado.active : botonesEstado.inactive 
                        }
                    ]}
                    onPress={() => props.callback(each.params_callback) }
                >
                    <Text style={{ color: props.activo === index ? "white" : "black" }}>{each.texto}</Text>
                </Pressable>
            )
        })}
        </View>
    )
}

function Filtro_aplicado(props:{texto:string, callback:Function,isVisible:boolean}){
    return (
        <Pressable onPress={()=>props.callback()} style={[estilos.centrado,
                                                        {backgroundColor:"lightgray", 
                                                        borderRadius:20,
                                                        padding:8,
                                                        flexDirection:"row",
                                                        marginTop:10,
                                                        display: props.isVisible ? "flex" : "none"
                                                        }]}>
            <Entypo name="circle-with-cross" size={24} color="white"  />
            <Text style={{paddingLeft:3}}>{props.texto}</Text>
        </Pressable>
    )
}


export  {Boton,IconButton,Alternar,Filtro_aplicado};