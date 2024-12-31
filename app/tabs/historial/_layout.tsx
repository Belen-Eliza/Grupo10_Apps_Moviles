import { estilos } from '@/components/global_styles';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack, Navigator } from 'expo-router';
import { Pressable } from 'react-native';


export default function Layout(){
    return(
      
        <Stack screenOptions={{
          
          headerStyle: {
            backgroundColor: "#004993",
          },
          headerTintColor: 'white',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
            <Stack.Screen name='index' options={{title: "Historial",headerShown:false}}/>
            <Stack.Screen name='[presupuesto_id]' options={({ navigation }) => ({
                presentation:"card", title: "Presupuesto",
                headerLeft: () => (
                  <Pressable onPress={()=>{navigation.replace("index")}}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="white" /> 
                </Pressable>
                  
                ),
              })}
      />
        </Stack>
    )
} 