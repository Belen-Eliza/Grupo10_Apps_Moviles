import { Stack } from 'expo-router';

export default function Layout(){
    return(
        <Stack screenOptions={{
            headerStyle: {
              backgroundColor: '#83cefc',
            },
            headerTintColor: 'black',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
            <Stack.Screen name='index' options={{title: "Add",headerShown:false}}/>
            <Stack.Screen name='editar_perfil' options={{presentation:"transparentModal",headerShown:false }}/>
            
        </Stack>
    )
} 