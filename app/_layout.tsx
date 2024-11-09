import { Stack, Tabs } from "expo-router";
import { UserContextProvider } from "@/context/UserContext";

export default function RootLayout() {
  return (
    <UserContextProvider>
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: '#83cefc',
      },
      headerTintColor: 'black',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
      <Stack.Screen name='index' options={{title:"Login"}}/>
      <Stack.Screen name='signup' options={{title:"Crear cuenta"}}/>
      <Stack.Screen name='tabs' options={{headerShown: false}}/>
    </Stack>
    </UserContextProvider>
  );
}
