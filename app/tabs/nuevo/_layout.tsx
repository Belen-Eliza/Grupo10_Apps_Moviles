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
            <Stack.Screen name='index' options={{title: "Add",headerShown:false}}/>
            <Stack.Screen name='ingreso' options={{presentation:"card", title:"Agregar ingreso"}}/>
            <Stack.Screen name='gasto' options={{presentation:"card", title:"Agregar gasto"}}/>
            <Stack.Screen name='presupuesto' options={{presentation:"card", title:"Crear presupuesto"}}/>
        </Stack>
    )
} 