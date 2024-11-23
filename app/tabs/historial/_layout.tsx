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
            <Stack.Screen name='ver_movimientos' options={{title: "Historial"}}/>
            <Stack.Screen name='ver_ingreso' options={{presentation:"card", title:"Ingreso"}}/>
            <Stack.Screen name='ver_gasto' options={{presentation:"card", title: "Gasto"}}/>
            <Stack.Screen name='ver_presupuesto' options={{presentation:"card", title: "Presupuesto"}}/>
        </Stack>
    )
} 