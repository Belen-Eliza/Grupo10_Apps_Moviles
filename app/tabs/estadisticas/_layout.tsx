import { Stack } from 'expo-router';


export default function Layout(){
    return(
        <Stack>
            <Stack.Screen name='index' options={{title: "Estadisticas", headerShown: false}}/>
            <Stack.Screen name='gastos_por_fecha' options={{title: "Estadisticas", headerShown: false}}/>
            <Stack.Screen name='gastos_por_categoria' options={{title: "Estadisticas", headerShown: false}}/>
            
        </Stack>
    )
} 