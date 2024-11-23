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
            <Stack.Screen name='index' options={{title: "Estadisticas"}}/>
            <Stack.Screen name='gastos_por_fecha' options={{title: "Datos por tiempo"}}/>
            <Stack.Screen name='gastos_por_categoria' options={{title: "Datos por categoría"}}/>
            
        </Stack>
    )
} 