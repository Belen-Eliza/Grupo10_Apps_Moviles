import { Stack, Tabs } from "expo-router";
import { UserContextProvider } from "@/context/UserContext";

export default function RootLayout() {
  return (
    <UserContextProvider>
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: "white"
      },
      headerTintColor: 'blue',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
      <Stack.Screen name='index' options={{title:"Login",headerShown: false}}/>
      <Stack.Screen name='signup' options={{title:"Crear cuenta"}}/>
      <Stack.Screen name='tabs' options={{headerShown: false}}/>
    </Stack>
    </UserContextProvider>
  );
}
