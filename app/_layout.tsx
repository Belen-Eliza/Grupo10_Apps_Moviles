import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Stack, Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: '#83cefc',
      },
      headerTintColor: 'black',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
      <Stack.Screen name='index' options={{title:"Login"/*href:null*/}}/>
      <Stack.Screen name='signup' options={{title:"Crear cuenta",/*href:null*/}}/>
    </Stack>
  );
}
