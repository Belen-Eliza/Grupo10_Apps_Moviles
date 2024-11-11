import { Stack } from 'expo-router';

export default function Layout(){
    return(
        <Stack>
            <Stack.Screen name='index' options={{title: "Add", headerShown: false}}/>
            <Stack.Screen name='ahorro' options={{presentation:"card", headerShown: false}}/>
            <Stack.Screen name='gasto' options={{presentation:"card", headerShown: false}}/>
            <Stack.Screen name='presupuesto' options={{presentation:"card", headerShown: false}}/>
        </Stack>
    )
} 