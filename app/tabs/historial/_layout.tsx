import { Stack } from 'expo-router';


export default function Layout(){
    return(
        <Stack>
            <Stack.Screen name='ver_movimientos' options={{title: "Historial", headerShown: false}}/>
            
        </Stack>
    )
} 