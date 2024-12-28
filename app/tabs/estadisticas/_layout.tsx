import { Stack } from 'expo-router';


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
            <Stack.Screen name='index' options={{title: "Estadisticas",headerShown:false}}/>
            <Stack.Screen name='gastos_por_fecha' options={{title: "Datos por tiempo"}}/>
            <Stack.Screen name='gastos_por_categoria' options={{title: "Gastos por categoría"}}/>
            
        </Stack>
    )
} 