import { Stack } from 'expo-router';


export default function Layout(){
    return(
        <Stack>
            <Stack.Screen name='ver_movimientos' options={{title: "Historial", headerShown: false}}/>
            <Stack.Screen name='ver_ingreso' options={{presentation:"card", headerShown: false}}/>
            <Stack.Screen name='ver_gasto' options={{presentation:"card", headerShown: false}}/>
            <Stack.Screen name='ver_presupuesto' options={{presentation:"card", headerShown: false}}/>
        </Stack>
    )
} 