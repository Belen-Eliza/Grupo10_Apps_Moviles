import { View, Pressable, Text, StyleSheet,Keyboard, ScrollView, ImageBackground,  } from "react-native";
import { estilos,colores,botonesEstado } from "@/components/global_styles";
import { MaterialIcons,Ionicons,Entypo } from "@expo/vector-icons";
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

type Icon = {
    materialIconName: keyof typeof MaterialIcons.glyphMap;
  }
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

function Alternar(props:{activo:number,callback:Function,datos:{texto:string,params_callback:number, icon: Icon}[]}){
    return (
    <SafeAreaProvider>
    <SafeAreaView style={estilos.flex1} edges={['left', 'right']}>
        <ImageBackground style={{  flex: 1, justifyContent: 'center',minHeight:80}} source={require("@/assets/images/fondo1.jpeg")} resizeMode="cover">
        <ScrollView horizontal contentContainerStyle={{ flexDirection: "row", justifyContent: "space-between", width: '100%',maxHeight:60,flex:1}}>
        {props.datos.map((each,index)=>{
            return(
                <Pressable key={index}
                    style={[
                        //estilos.tarjetasesp,
                        estilos.centrado,
                        { 
                            flex: 1, 
                            marginTop: 10,
                            marginHorizontal: 5, 
                            height: 50,
                            borderWidth: 1,
                            borderColor: "lightgray",
                            borderRadius:30,
                            backgroundColor:  props.activo === index ? '#007AFF': "white",//botonesEstado.active : botonesEstado.inactive 
                            flexDirection:"row",
                            padding:3,
                        }
                    ]}
                    onPress={() => props.callback(each.params_callback) }
                >
                    <MaterialIcons name={each.icon.materialIconName} size={24} color={props.activo === index ? "white" : "#0e017e"}/>
                    <Text style={{fontSize:14,marginLeft:4, color: props.activo === index ? "white" : "#0e017e" }}>{each.texto}</Text>
                </Pressable>
            )
        })}
        </ScrollView>
        </ImageBackground>
    </SafeAreaView>
    </SafeAreaProvider>
        
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

function Dismiss_keyboard(props:{pos_y:number,setVisible:React.Dispatch<React.SetStateAction<boolean>>}){
    return( 
    <Pressable style={[{padding:10,borderRadius:10,alignSelf:"flex-end", position:"absolute",top:props.pos_y}]} 
    onPress={()=>{
        Keyboard.dismiss();
        props.setVisible(false);
     }} >
        <MaterialIcons name="keyboard-hide" size={30} color="gray" />
    </Pressable>
    )
}


export  {Boton,IconButton,Alternar,Filtro_aplicado,Dismiss_keyboard};