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
            <Stack.Screen name='ver_movimientos' options={{title: "Historial",headerShown:false}}/>
            <Stack.Screen name='ver_ingreso' options={{presentation:"card", title:"Ingreso"}}/>
            <Stack.Screen name='ver_gasto' options={{presentation:"card", title: "Gasto"}}/>
            <Stack.Screen name='ver_presupuesto' options={{presentation:"card", title: "Presupuesto"}}/>
        </Stack>
    )
} 