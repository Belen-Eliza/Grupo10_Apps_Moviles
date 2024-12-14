import { ActivityIndicator, View ,Text} from "react-native";

function LoadingCircle (){
    return (
        <View style={{height:"100%",width:"100%",backgroundColor:"transparent",justifyContent:"center"}}>
          <ActivityIndicator size="large" />
        </View>
    )
}

export {LoadingCircle}