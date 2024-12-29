import { ActivityIndicator, View ,Text} from "react-native";
import { estilos } from "./global_styles";

function LoadingCircle (){
    return (
        <View style={[{backgroundColor:"transparent",height:"100%",zIndex:-1},estilos.centrado]}>
          <ActivityIndicator size="large" />
        </View>
    )
}

export {LoadingCircle}